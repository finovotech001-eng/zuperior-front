

"use client";

import { supabase } from "@/lib/supabase";
import { CheckCircle, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchUserData } from "@/hooks/useFetchUserData";

interface CallbackData {
  orderid?: string;
  transactionid?: string;
  tranmt?: string;
  currency?: string;
  account_number?: string;
  account_type?: string;
  created_at?: string;
}

const CreditCardSuccess = () => {
  const [callbackData, setCallbackData] = useState<CallbackData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositCompleted, setDepositCompleted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog open by default
  const router = useRouter();
  const { fetchAllData } = useFetchUserData();
  
  const dispatch = useAppDispatch();

  // Prevent multiple API calls
  const hasCalledDeposit = useRef(false);

  // Function to extract just the account number (before the "|")
  const extractAccountNumber = (accountString: string | undefined): string => {
    if (!accountString) return '';
    return accountString.split('|')[0].trim();
  };

  // Function to extract account type (after the "|")
  const extractAccountType = (accountString: string | undefined): string => {
    if (!accountString) return '';
    const parts = accountString.split('|');
    return parts.length > 1 ? parts[1].trim() : '';
  };

  useEffect(() => {
    const fetchLatestTransaction = async () => {
      try {
        console.log('Fetching latest transaction data...');

        // First, get the latest callback data
        const { data: callbackData, error: callbackError } = await supabase
          .from('epay_callback')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (callbackError) {
          console.error('Error fetching callback data:', callbackError);
          setError('Failed to load transaction data');
          setLoading(false);
          return;
        }

        if (callbackData) {
          console.log('Latest callback data found:', callbackData);
          
          let orderData = null;
          
          // Try to get order data using the epay_order_id foreign key if it exists
          if (callbackData.epay_order_id) {
            const { data: orderDataResult, error: orderError } = await supabase
              .from('epay_order')
              .select('*')
              .eq('id', callbackData.epay_order_id)
              .maybeSingle();

            if (orderError) {
              console.error('Error fetching order data by ID:', orderError);
            } else {
              orderData = orderDataResult;
            }
          }
          
          // If no order data found via foreign key, try to find by order_id
          if (!orderData && callbackData.orderid) {
            const { data: orderDataResult, error: orderError } = await supabase
              .from('epay_order')
              .select('*')
              .eq('order_id', callbackData.orderid)
              .maybeSingle();

            if (orderError) {
              console.error('Error fetching order data by order_id:', orderError);
            } else {
              orderData = orderDataResult;
            }
          }

          // If still no order data, get the latest order data
          if (!orderData) {
            const { data: latestOrderData, error: latestOrderError } = await supabase
              .from('epay_order')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (latestOrderError) {
              console.error('Error fetching latest order data:', latestOrderError);
            } else {
              orderData = latestOrderData;
            }
          }

          // Extract just the account number part (before "|")
          const accountNumber = orderData?.account_number 
            ? extractAccountNumber(orderData.account_number)
            : '';

          const accountType = orderData?.account_number
            ? extractAccountType(orderData.account_number)
            : '';

          setCallbackData({
            orderid: callbackData.orderid || orderData?.order_id,
            transactionid: callbackData.transactionid,
            tranmt: callbackData.transaction_amount?.toString(),
            currency: callbackData.currency || orderData?.currency,
            account_number: accountNumber,
            account_type: accountType,
            created_at: callbackData.created_at || orderData?.created_at,
          });

          // Automatically process deposit if we have the required data
          if (accountNumber && callbackData.transaction_amount && !hasCalledDeposit.current) {
            processDeposit(accountNumber, callbackData.transaction_amount.toString());
          }
        } else {
          // If no callback data, try to get the latest order data
          const { data: orderData, error: orderError } = await supabase
            .from('epay_order')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (orderError) {
            console.error('Error fetching order data:', orderError);
            setError('No transaction data available');
            setLoading(false);
            return;
          }

          if (orderData) {
            console.log('Latest order data found:', orderData);
            
            // Extract just the account number part (before "|")
            const accountNumber = orderData.account_number 
              ? extractAccountNumber(orderData.account_number)
              : '';

            const accountType = orderData.account_number
              ? extractAccountType(orderData.account_number)
              : '';

            setCallbackData({
              orderid: orderData.order_id,
              currency: orderData.currency,
              tranmt: orderData.amount?.toString(),
              account_number: accountNumber,
              account_type: accountType,
              created_at: orderData.created_at,
            });

            // Automatically process deposit if we have the required data
            if (accountNumber && orderData.amount && !hasCalledDeposit.current) {
              processDeposit(accountNumber, orderData.amount.toString());
            }
          } else {
            setError('No transaction data available');
          }
        }

      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTransaction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processDeposit = async (accountNumber: string, amount: string) => {
    try {
      hasCalledDeposit.current = true;
      setIsProcessing(true);
      
      toast.loading("Processing deposit...", {
        description: "Please wait while we credit your account.",
      });

      const freshToken = await dispatch(fetchAccessToken()).unwrap();
      if (!freshToken) {
        toast.error("Authentication Failed", {
          description: "Unable to authenticate. Please try again.",
        });
        return;
      }

      const formData = new URLSearchParams();
      formData.append("account_number", accountNumber);
      formData.append("amount", amount);
      formData.append("access_token", freshToken);

      console.log("Submitting deposit with data:", {
        account_number: accountNumber,
        amount,
        access_token: freshToken,
      });

      const response = await fetch("/api/epay-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      // Update lifetime deposit
      /* const userEmail = store.getState().user.data?.email1;
      if (userEmail) {
        await updateLifetimeDeposit(userEmail, Number(amount));
      } */

      // Refresh account data
      fetchAllData();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deposit failed");
      }

      const data = await response.json();
      if (data.status === "success") {
        setDepositCompleted(true);
        toast.success("Deposit Completed", {
          description: "Your funds have been successfully deposited to your account.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || "Deposit processing failed");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      const errorMessage = err instanceof Error ? err.message : "Deposit failed";
      setError(errorMessage);
      toast.error("Deposit Failed", {
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      setIsProcessing(false);
      toast.dismiss();
    }
  };

  const handleCopyDetails = () => {
    const details = `Amount: ${callbackData.tranmt} ${callbackData.currency}\nAccount: ${callbackData.account_number}\nOrder ID: ${callbackData.orderid}\nTransaction ID: ${callbackData.transactionid}\nDate: ${callbackData.created_at ? new Date(callbackData.created_at).toLocaleString() : 'N/A'}`;

    navigator.clipboard.writeText(details)
      .then(() => {
        toast.success("Details Copied", {
          description: "Transaction details copied to clipboard.",
        });
      })
      .catch(() => {
        toast.error("Copy Failed", {
          description: "Could not copy details to clipboard.",
        });
      });
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6 p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
        <p className="text-gray-300">Loading transaction details...</p>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        className="border-2 border-transparent p-6 text-white rounded-[18px] flex flex-col items-center w-full [background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
        disableOutsideClick={true}
      >
        <DialogTitle className="sr-only">Payment Success</DialogTitle>

        <DialogHeader className="w-full py-7">
          <div className="flex items-center justify-between w-full pt-6">
            <div className="flex items-center space-x-2 w-full mx-10">
              {/* Progress steps 1-4 */}
              <div className="flex h-8 w-8 px-4 mx-0 items-center bg-[#9F8BCF] justify-center rounded-full">
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="h-[4px] w-full mx-0 bg-[#6B5993]"></div>
              
              <div className="flex h-8 w-8 p-4 mx-0 items-center bg-[#9F8BCF] justify-center rounded-full">
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="h-[4px] w-full mx-0 bg-[#6B5993]"></div>
              
              <div className="flex h-8 w-8 p-4 items-center bg-[#9F8BCF] justify-center rounded-full">
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="h-[4px] w-full mx-0 bg-[#6B5993]"></div>
              
              <div className="flex h-8 w-8 p-4 mx-0 items-center bg-[#9F8BCF] justify-center rounded-full">
                <span className="text-sm font-medium">4</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
        
        <p className={`${depositCompleted ? 'text-green-400' : isProcessing ? 'text-blue-400' : 'text-gray-300'}`}>
          {isProcessing 
            ? "Processing your deposit..." 
            : depositCompleted 
              ? "Deposit completed successfully! Funds are now in your account."
              : "Your payment has been processed successfully. Funds will be credited to your account shortly."}
        </p>
        
        {callbackData.orderid ? (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-white mb-2">Transaction Details</h3>
            <div className="space-y-2 text-sm text-gray-300">
              {callbackData.orderid && (
                <p><span className="font-medium">Order ID:</span> {callbackData.orderid}</p>
              )}
              {callbackData.transactionid && (
                <p><span className="font-medium">Transaction ID:</span> {callbackData.transactionid}</p>
              )}
              {callbackData.tranmt && callbackData.currency && (
                <p><span className="font-medium">Amount:</span> {callbackData.currency} {callbackData.tranmt}</p>
              )}
              {callbackData.account_number && (
                <p><span className="font-medium">Account Number:</span> {callbackData.account_number}</p>
              )}
              {callbackData.account_type && (
                <p><span className="font-medium">Account Type:</span> {callbackData.account_type}</p>
              )}
              {callbackData.created_at && (
                <p><span className="font-medium">Date:</span> {new Date(callbackData.created_at).toLocaleString()}</p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button
                onClick={handleCopyDetails}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <CopyIcon className="h-3 w-3 mr-1" />
                Copy Details
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left">
            <p className="text-yellow-400 text-sm">
              {error || "No transaction details available."}
            </p>
          </div>
        )}

        {error && (
          <div className="text-green-400 text-sm">
            {error}
          </div>
        )}
         <button
          className="items-center bg-[#9F8BCF] px-4 py-2 text-sm rounded-lg cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Go to Dashboard
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardSuccess;
