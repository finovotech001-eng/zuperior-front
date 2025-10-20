"use client";

import { supabase } from "@/lib/supabase";
import { XCircle, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CallbackData {
  orderid?: string;
  transactionid?: string;
  tranmt?: string;
  currency?: string;
  account_number?: string;
  account_type?: string;
  created_at?: string;
}

const CreditCardFailed = () => {
  const [callbackData, setCallbackData] = useState<CallbackData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog open by default
  const router = useRouter();

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
        console.log("Fetching latest transaction data...");

        // First, get the latest callback data
        const { data: callbackData, error: callbackError } = await supabase
          .from("epay_callback")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (callbackError) {
          console.error("Error fetching callback data:", callbackError);
          setError("Failed to load transaction data");
          setLoading(false);
          return;
        }

        if (callbackData) {
          console.log("Latest callback data found:", callbackData);

          let orderData = null;

          // Try to get order data using the epay_order_id foreign key if it exists
          if (callbackData.epay_order_id) {
            const { data: orderDataResult, error: orderError } = await supabase
              .from("epay_order")
              .select("*")
              .eq("id", callbackData.epay_order_id)
              .maybeSingle();

            if (orderError) {
              console.error("Error fetching order data by ID:", orderError);
            } else {
              orderData = orderDataResult;
            }
          }

          // If no order data found via foreign key, try to find by order_id
          if (!orderData && callbackData.orderid) {
            const { data: orderDataResult, error: orderError } = await supabase
              .from("epay_order")
              .select("*")
              .eq("order_id", callbackData.orderid)
              .maybeSingle();

            if (orderError) {
              console.error("Error fetching order data by order_id:", orderError);
            } else {
              orderData = orderDataResult;
            }
          }

          // If still no order data, get the latest order data
          if (!orderData) {
            const { data: latestOrderData, error: latestOrderError } = await supabase
              .from("epay_order")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (latestOrderError) {
              console.error("Error fetching latest order data:", latestOrderError);
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
        } else {
          // If no callback data, try to get the latest order data
          const { data: orderData, error: orderError } = await supabase
            .from("epay_order")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (orderError) {
            console.error("Error fetching order data:", orderError);
            setError("No transaction data available");
            setLoading(false);
            return;
          }

          if (orderData) {
            console.log("Latest order data found:", orderData);
            
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
          } else {
            setError("No transaction data available");
          }
        }
      } catch (err) {
        console.error("Error fetching transaction data:", err);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTransaction();
  }, []);

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
        <DialogTitle className="sr-only">Payment Failed</DialogTitle>

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

        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
        
        <p className="text-gray-300">
          Your deposit could not be processed. Please try again later.
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

export default CreditCardFailed;