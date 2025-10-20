"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { Step2ConfirmationProps } from "./types";
import fallbackImg from "@/assets/binance.png";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TpAccountSnapshot } from "@/types/user-details";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";

export function Step2ConfirmationPayout({
  amount,
  selectedNetwork,
  selectedCrypto,
  paymentMethod,
  paymentImages,
  isProcessing,
  toWallet,
  prevStep,
  handleContinueToPayment,
  selectedAccount,
  setPayoutId,
}: Step2ConfirmationProps & {
  selectedAccount: TpAccountSnapshot | null;
  toWallet: string;
  setToWallet: (address: string) => void;
  setPayoutId: (id: string) => void;
}) {
  const [isApiProcessing, setIsApiProcessing] = useState(false);
  const userData = store.getState().user.data;
  const dispatch = useAppDispatch();

  // Function to check payout status
  const checkPayoutStatus = useCallback(
    async (cid: string) => {
      try {
        const response = await fetch("/api/payout-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cid: cid }),
        });

        const statusData = await response.json();
        return statusData;
      } catch (error) {
        console.error("Error checking payout status:", error);
        throw error;
      }
    },
    []
  );

  // Function to store payout data in Supabase
  const storePayoutData = async (cid: string) => {
    try {
      if (selectedAccount === null) {
        throw new Error("Account details not available");
      }
      // Insert into Supabase
      const { data, error } = await supabase
        .from('withdraw_cid')
        .insert([
          {
            accountname: userData?.accountname,
            email: userData?.email1,
            account_type: selectedAccount.account_type || '',
            acc: (selectedAccount.acc).toString() || '',
            wallet_address: toWallet,
            amount: parseFloat(amount.toString()),
            cid: cid,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Payout data stored successfully:', data);
      return data;
    } catch (error) {
      console.error('Error storing payout data:', error);
      throw error;
    }
  };

  // Function to handle payout API call
  const handlePayout = async () => {
    if (!selectedCrypto || !amount || !selectedAccount) {
      toast.error("Missing required information");
      return;
    }

    setIsApiProcessing(true);

    try {
      // Step 1: Make the payout request
      const payoutResponse = await fetch('/api/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: selectedCrypto.name,
          address: toWallet,
          amount: amount.toString(),
          remark: `Payout to ${userData?.accountname}`,
          memo: `Payment for ${amount} ${selectedCrypto.name}`
        }),
      });

      const payoutData = await payoutResponse.json();
      console.log("Payout API response:", payoutData);

      if (!payoutResponse.ok) {
        throw new Error(payoutData.error || payoutData.message || 'Failed to process payout');
      }

      if (payoutData.code !== "00000" || !payoutData.data?.cid) {
        throw new Error(payoutData.msg || "Invalid response from payout API");
      }
      
      // Extract cid from response
      const cid = payoutData.data.cid;
      
      // Step 2: Store payout data in Supabase
      await storePayoutData(cid);
      await handleWithdraw()
      
      // Step 3: Check payout status
      const statusData = await checkPayoutStatus(cid);
      console.log("Payout status:", statusData);
      
      if (statusData.code === "00000") {
        setPayoutId(cid);
        handleContinueToPayment();
      } else {
        throw new Error(statusData.msg || "Payout verification failed");
      }

    } catch (err: unknown) {
      toast.error((err as Error).message || 'An error occurred while processing the payout');
    } finally {
      setIsApiProcessing(false);
    }
  };

  // To Do: integrate with actual withdraw API which sends the req to a pending state, not the completed state
  const handleWithdraw = async () => {
    try {
      const token = await dispatch(fetchAccessToken()).unwrap();

      toast("Processing Withdrawal...", {
        description: "Please wait while we process your transaction.",
      });
      if (selectedAccount === null) return;

      const formData = new URLSearchParams();
      formData.append("account_number", (selectedAccount?.acc).toString() || "");
      formData.append("amount", amount.toString() || "0");
      formData.append("access_token", token);

      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Withdrawal Completed", {
          description:
            "Your funds have been successfully withdrawn from your account.",
          duration: 4000,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Withdrawal failed";
      toast.error("Withdrawal Failed", {
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      toast.dismiss();
    }
  };

  useEffect(() => {
    console.log('Selected network changed:', selectedNetwork);
  }, [selectedNetwork]);

  return (
    <div className="mx-auto w-[400px]">
      <h2 className="text-2xl text-center font-bold text-black dark:text-white/75 mb-1">
        Pay {amount} {selectedCrypto?.name || "USD"}
      </h2>

      {selectedCrypto && selectedAccount && (
        <div className="mt-3 rounded-lg ">
          {/* Account Information */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-black dark:text-white/75">Account Number:</span>
            <span className="text-black dark:text-white/75">{selectedAccount?.acc}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white/75">Account Type:</span>
            <span className="text-black dark:text-white/75">{selectedAccount?.account_type}</span>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-3">
        <div className="space-y-2 flex justify-between items-center text-sm">
          <p className="text-black dark:text-white/75">Payment Method</p>
          <div className="flex items-center">
            {paymentMethod === "" && selectedCrypto?.name ? (
              <>
                <Image
                  src={selectedCrypto.icon}
                  alt={selectedCrypto.name}
                  className="h-6 w-6 mr-2"
                  width={24}
                  height={24}
                />
                <p className="text-black dark:text-white/75">{selectedCrypto?.name}</p>
              </>
            ) : (
              <>
                {paymentMethod && (
                  <Image
                    src={paymentImages[paymentMethod] || fallbackImg}
                    alt="Payment Method"
                    className="h-6 w-6 mr-2"
                    width={24}
                    height={24}
                  />
                )}
                <p className="text-black dark:text-white/75">{paymentMethod}</p>
              </>
            )}
          </div>
        </div>

        <hr className="border-t border-[#31263a]" />

        <div className="space-y-2 flex justify-between items-center text-sm">
          <p className="text-black dark:text-white/75">Amount</p>
          <p className="text-black dark:text-white/75">
            {amount} {selectedCrypto?.name || "USD"}
          </p>
        </div>

        <hr className="border-t border-[#31263a]" />

        <div className="space-y-2 flex justify-between items-center text-sm">
          <p className="text-black dark:text-white/75">Wallet Address</p>
          <p className="text-black dark:text-white/75 break-all text-xs">{toWallet}</p>
        </div>

        <hr className="border-t border-[#31263a]" />

        <div className="p-3 pt-4 flex justify-between rounded-lg items-center text-sm dark:bg-[#221D22]">
          <p className="text-black dark:text-white/75 text-xs font-semibold">
            To be Withdraw
          </p>
          <p className="text-[#945393] text-lg font-bold">
            {amount} {selectedCrypto?.name || "USD"}
          </p>
        </div>

        <div className="flex flex-col">
          <Button
            className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
            disabled={isProcessing || isApiProcessing}
            onClick={handlePayout}
          >
            {isProcessing || isApiProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </div>
            ) : (
              "Confirm Withdraw"
            )}
          </Button>

          <Button
            variant="outline"
            className="flex-1 bg-transparent cursor-pointer text-black dark:text-white/75 border-none text-xs mt-1 dark:hover:bg-[#090209] dark:hover:text-white"
            onClick={prevStep}
            disabled={isApiProcessing}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}