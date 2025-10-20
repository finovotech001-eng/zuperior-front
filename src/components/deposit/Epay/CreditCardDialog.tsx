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
import { fetchUserMt5Accounts } from "../../../store/slices/mt5AccountSlice";
import { NewAccountDialogProps } from "../types";
import { CreditStep1Form } from "./CreditStep1Form";
import { CreditStep2Form } from "./CreditStep2Form";
import { CreditStep3Form } from "./CreditStep3Form";
import CreditCardSuccess from "@/app/(protected)/creditCardSuccess/page";
import CreditCardFailed from "@/app/(protected)/creditCardFailed/page";

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
  const filteredAccounts = mt5Accounts.filter(
    (account) => account.isEnabled
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

  // Fetch MT5 accounts when dialog opens
  useEffect(() => {
    if (open && mt5Accounts.length === 0) {
      console.log('🔄 CreditCardDialog: Fetching MT5 accounts...');
      dispatch(fetchUserMt5Accounts());
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
        (account) => account.acc.toString() === selectedAccount
      );

      const buildRedirectUrl = (path: string) => {
        const url = new URL(`${window.location.origin}${path}`);
        url.searchParams.append("orderid", `order_${Date.now()}`);
        url.searchParams.append("currency", currency);
        url.searchParams.append("tranmt", amount);
        url.searchParams.append("transactionid", `txn_${Date.now()}`);
        return url;
      };

      const successUrl = buildRedirectUrl("/creditCardSuccess");
      const failureUrl = buildRedirectUrl("/creditCardFailed");

      const response = await fetch("/api/epay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countrycode: "+91",
          mobilenumber: "9999999999",
          orderAmount: amount,
          user_name: "Customer Name",
          orderCurrency: currency,
          account_number: selectedAccount,
          account_type: account?.account_type || "Live",
          success_url: successUrl.toString(),
          failure_url: failureUrl.toString(),
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.error?.message || "Payment initiation failed");
      }

      if (data.orderId && data.transactionId) {
        successUrl.searchParams.set("orderid", data.orderId);
        successUrl.searchParams.set("transactionid", data.transactionId);

        failureUrl.searchParams.set("orderid", data.orderId);
      }

      setRedirectUrl(data.redirectUrl);
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment initiation failed"
      );
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
