"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import btc from "@/assets/bitcoin.png";
import usdt from "@/assets/tether.png";
import usdc from "@/assets/binance.png";
import ethereum from "@/assets/binance.png";
import solana from "@/assets/binance.png";
import { NewAccountDialogProps, PaymentImages } from "./types";
import { Step2ConfirmationPayout } from "./Step2ConfirmationPayout";
import { Step1FormPayout } from "./Step1FormPayout";
import Step3Payout from "./Step3PayoutProps";
import { TpAccountSnapshot } from "@/types/user-details";

export function WithdrawPayoutDialog({
  open,
  onOpenChange,
  selectedCrypto,
}: NewAccountDialogProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [apiResponse, setApiResponse] = useState<{ status?: string } | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
 /*  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  ); */
  const liveAccounts = useSelector((state: RootState) => state.accounts.data).filter((account) => account.account_type === "Live");
  const [selectedAccount, setSelectedAccount] = useState<TpAccountSnapshot | null>(null);
  const [payoutId, setPayoutId] = useState<string | null>(null);

  const paymentImages: PaymentImages = {
    USDT: usdt,
    BTC: btc,
    USDC: usdc,
    ETH: ethereum,
    SOL: solana,
  };

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // const email = useSelector((state: RootState) => state.auth.clientId);


  const resetAllStates = useCallback(() => {
    setStep(1);
    setAmount("");
    setToWallet("");
    setSelectedNetwork(selectedCrypto?.network || "");
    setIsProcessing(false);
    setError(null);
    setSelectedAccount(null);
    setApiResponse(null);

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [selectedCrypto]);

  useEffect(() => {
    if (open) {
      setSelectedNetwork(selectedCrypto?.network || "");
    } else {
      resetAllStates();
    }
  }, [open, resetAllStates, selectedCrypto]);

  const nextStep = () => {
    if (step === 1 && apiResponse?.status === "200") {
      return; // stop if status is not 200
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1FormPayout
            amount={amount}
            setAmount={setAmount}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            selectedCrypto={selectedCrypto ?? null}
            nextStep={nextStep}
            accounts={liveAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            toWallet={toWallet}
            setToWallet={setToWallet}
          />
        );
      case 2:
        return (
          <Step2ConfirmationPayout
            amount={amount}
            selectedNetwork={selectedNetwork}
            selectedCrypto={selectedCrypto}
            paymentMethod={selectedCrypto?.symbol || ""}
            paymentImages={paymentImages}
            error={error}
            toWallet={toWallet}
            setToWallet={setToWallet}
            isProcessing={isProcessing}
            selectedAccount={selectedAccount}
            prevStep={prevStep}
            exchangeRate={1}
            handleContinueToPayment={nextStep}
            setPayoutId={setPayoutId} // Pass the setPayoutId function
          />
        );
      case 3:
        return (
          <Step3Payout
            amount={amount}
            toWallet={toWallet}
            accountNumber={selectedAccount?.acc.toString()}
            selectedCrypto={selectedCrypto ?? { name: "", symbol: "" }}
            payoutId={payoutId || undefined}
          />
        );
      default:
        return null;
    }
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
        <DialogTitle className="sr-only">
          {/* {selectedTab === "deposit" ? "Deposit Funds" : "Withdraw Funds"} */}
        </DialogTitle>

        <DialogHeader className="w-full py-7">
          <div className="flex items-center justify-between w-full pt-6">
            <div className="flex items-center space-x-2 w-full mx-10">
              <div
                className={`flex h-8 w-8 px-4 mx-0 items-center justify-center rounded-full ${
                  step >= 1 ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium">1</span>
              </div>
              <div
                className={`h-[4px] w-full mx-0 ${
                  step >= 2 ? "bg-[#6B5993]" : "bg-[#392F4F]"
                }`}
              ></div>
              <div
                className={`flex h-8 w-8 p-4 mx-0 items-center justify-center rounded-full ${
                  step >= 2 ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium ">2</span>
              </div>
              <div
                className={`h-[4px] w-full mx-0 ${
                  step >= 3 ? "bg-[#6B5993]" : "bg-[#392F4F]"
                }`}
              ></div>
              <div
                className={`flex h-8 w-8 p-4 items-center justify-center rounded-full ${
                  step >= 3 ? " bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}