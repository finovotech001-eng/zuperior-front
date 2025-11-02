"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import { fetchUserAccountsFromDb } from "../../../store/slices/mt5AccountSlice";
import { NewAccountDialogProps } from "../types";
import { CreditStep1Form } from "./CreditStep1Form";
import { CreditStep2Form } from "./CreditStep2Form";
import { CreditStep3Form } from "./CreditStep3Form";
import CreditCardSuccess from "@/app/(protected)/creditCardSuccess/page";
import CreditCardFailed from "@/app/(protected)/creditCardFailed/page";
import { toast } from "sonner";

export function CreditCardDialog({
  open,
  onOpenChange,
  selectedCrypto,
  lifetimeDeposit,
}: NewAccountDialogProps & { lifetimeDeposit: number }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "pending"
  >("pending");

  const dispatch = useDispatch<AppDispatch>();
  const mt5Accounts = useSelector((state: RootState) => state.mt5.accounts);
  // Use all accounts from database - no need to filter by isEnabled anymore
  const filteredAccounts = mt5Accounts.filter(
    (account) => {
      // Filter valid account IDs only
      const id = String(account.accountId || '').trim();
      return id && id !== '0' && /^\d+$/.test(id);
    }
  );

  const resetAllStates = useCallback(() => {
    setStep(1);
    setAmount("");
    setIsProcessing(false);
    setError(null);
    setSelectedAccount("");
    setCurrency("USD");
    setRedirectUrl("");
    setPaymentStatus("pending");
  }, []);

  useEffect(() => {
    if (!open) {
      resetAllStates();
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "success" || status === "failed") {
      setStep(4);
      setPaymentStatus(status);

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [open, resetAllStates]);

  // Fetch MT5 accounts from DB when dialog opens
  useEffect(() => {
    if (open && mt5Accounts.length === 0) {
      console.log('🔄 CreditCardDialog: Fetching MT5 accounts from DB...');
      dispatch(fetchUserAccountsFromDb() as any);
    }
  }, [open, dispatch, mt5Accounts.length]);

  const handlePaymentContinue = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }
    if (!selectedAccount) {
      setError("Please select an account");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const account = filteredAccounts.find(
        (account) => account.accountId === selectedAccount
      );

      // Get account package from DB field
      const accountPackage = account?.package || 'Standard';

      const buildRedirectUrl = (path: string) => {
        const url = new URL(`${window.location.origin}${path}`);
        url.searchParams.append("currency", currency);
        url.searchParams.append("tranmt", amount);
        return url;
      };

      const successUrl = buildRedirectUrl("/deposit/success");
      const failureUrl = buildRedirectUrl("/deposit/cancel");

      console.log('💳 Initiating Cregis card payment:', {
        amount,
        currency,
        account_number: selectedAccount,
        account_type: accountPackage,
      });

      const response = await fetch("/api/epay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderAmount: amount,
          success_url: successUrl.toString(),
          failure_url: failureUrl.toString(),
          account_number: selectedAccount,
          account_type: accountPackage,
        }),
      });

      let data;
      try {
        data = await response.json();
        console.log('💳 API response:', data);
      } catch (jsonError) {
        const text = await response.text();
        console.error('❌ Failed to parse API response as JSON:', text);
        throw new Error("Invalid response from server");
      }

      if (response.status !== 200) {
        console.error('❌ API returned error status:', response.status);
        console.error('❌ API response body:', data);
        console.error('❌ API error field:', data?.error);
        console.error('❌ API details field:', data?.details);
        console.error('❌ API message field:', data?.message);
        console.error('❌ Full error object:', JSON.stringify(data, null, 2));
        // Prefer details over error for more specific messages
        throw new Error(data?.details || data?.error || data?.message || "Payment initiation failed");
      }

      if (!data.redirectUrl) {
        console.error('❌ No redirect URL in response:', data);
        throw new Error("No payment URL received from server");
      }

      console.log('✅ Payment URL received, redirecting user to Cregis payment page');
      setRedirectUrl(data.redirectUrl);
      setStep(3);
    } catch (err) {
      console.error('❌ Payment initiation failed:', err);
      let errorMessage = err instanceof Error ? err.message : "Payment initiation failed";
      
      // Provide user-friendly error messages
      if (errorMessage.includes('whitelist')) {
        // Extract IP from error for better UX
        const ipMatch = errorMessage.match(/IP:\s*([\da-f.:]+)/i);
        const detectedIp = ipMatch ? ipMatch[1] : 'your server';
        
        errorMessage = `IP whitelist configuration required (IP: ${detectedIp})`;
        toast.error("Configuration Required", {
          description: `Your server IP needs to be whitelisted in Cregis. Please add your IP to the Cregis dashboard or contact support. See CREGIS_WHITELIST_SETUP.md for details.`,
          duration: 10000,
        });
      } else {
        toast.error("Payment Error", {
          description: errorMessage,
          duration: 6000,
        });
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!selectedAccount || selectedAccount === "")) {
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetAllStates();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="border-2 border-transparent p-6 text-white rounded-[18px] flex flex-col items-center w-full  [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
        disableOutsideClick={true}
      >
        <DialogTitle className="sr-only">Credit/Debit Card</DialogTitle>

        <DialogHeader className="w-full py-7">
          <div className="flex items-center justify-between w-full pt-6">
            <div className="flex items-center space-x-2 w-full mx-10 flex-nowrap">
              {[1, 2, 3, 4].map((num) => (
                <React.Fragment key={num}>
                  <div
                    className={`flex h-8 w-8 mx-0 items-center justify-center rounded-full ${
                      step >= num ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                    }`}
                  >
                    <span className="text-sm font-medium">{num}</span>
                  </div>
                  {num !== 4 && (
                    <div
                      className={`h-[4px] flex-grow mx-0 ${
                        step > num ? "bg-[#6B5993]" : "bg-[#392F4F]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <CreditStep1Form
            amount={amount}
            setAmount={setAmount}
            nextStep={nextStep}
            accounts={filteredAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            currency={currency}
            setCurrency={setCurrency}
            selectedNetwork=""
            lifetimeDeposit={lifetimeDeposit}
          />
        )}

        {step === 2 && (
          <CreditStep2Form
            amount={amount}
            paymentMethod={selectedCrypto?.symbol || ""}
            error={error}
            isProcessing={isProcessing}
            selectedAccount={selectedAccount}
            prevStep={prevStep}
            handleContinueToPayment={handlePaymentContinue}
            currency={currency}
            setCurrency={setCurrency}
            accounts={filteredAccounts}
          />
        )}

        {step === 3 && redirectUrl && (
          <CreditStep3Form
            amount={amount}
            currency={currency}
            redirectUrl={redirectUrl}
            selectedAccount={selectedAccount}
          />
        )}

        {step === 4 && paymentStatus === "success" && <CreditCardSuccess />}
        {step === 4 && paymentStatus === "failed" && <CreditCardFailed />}
      </DialogContent>
    </Dialog>
  );
}
