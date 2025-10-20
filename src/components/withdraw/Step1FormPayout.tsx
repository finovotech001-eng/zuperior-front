"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Step1FormProps } from "@/components/withdraw/types";
import { useEffect, useState } from "react";
import { store } from "@/store";
import { toast } from "sonner";
import axios from "axios";
import { TpAccountSnapshot } from "@/types/user-details";

export function Step1FormPayout({
  amount,
  setAmount,
  selectedNetwork,
  selectedCrypto,
  nextStep,
  accounts,
  selectedAccount,
  setSelectedAccount,
  toWallet,
  setToWallet,
}: Step1FormProps & {
  accounts: TpAccountSnapshot[];
  selectedAccount: TpAccountSnapshot | null;
  setSelectedAccount: (account: TpAccountSnapshot) => void;
  toWallet: string;
  setToWallet: (address: string) => void;
}) {
  const [isValidating, setIsValidating] = useState(false);
  const [kycStep, setKycStep] = useState<
    "unverified" | "partial" | "verified" | ""
  >("");

  // KYC Step
  useEffect(() => {
    setKycStep(store.getState().kyc.verificationStatus);
  }, []);

  // Amount Validation
  const validateAmount = () => {
    if (!selectedAccount) {
      toast.error("Please select an account");
      return false;
    }
    const amountNum = parseFloat(amount);
    const balance = parseFloat(selectedAccount.margin_free);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (amountNum < 10) {
      toast.error("Minimum withdrawal amount is $10");
      return false;
    }
    if (amountNum > balance) {
      toast.error(
        `Insufficient funds. Your balance is ${balance.toFixed(2)} USD`
      );
      return false;
    }
    if (kycStep === "partial" && amountNum > 10000) {
      toast.error("Withdrawal limit is $10,000 for Partial accounts");
      return false;
    }
    return true;
  };

  // Wallet Validation
  const validateWalletAddress = async () => {
    if (!toWallet.trim()) {
      toast.error("Wallet address is required");
      return false;
    }
    if (!selectedNetwork.trim()) {
      toast.error("Network is required");
      return false;
    }

    setIsValidating(true);
    try {
      const { data } = await axios.post("/api/payout-address-legal", {
        address: toWallet.trim(),
        chain_id: selectedNetwork.split("@")[0],
      });

      if (data.code !== "00000" || !data.data?.result) {
        throw new Error(data.data?.result || "Invalid wallet address");
      }
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Address validation failed"
      );
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Continue Handler
  const handleNextStep = async () => {
    if (!selectedAccount) return toast.error("Please select an account");
    if (!amount.trim()) return toast.error("Amount is required");
    if (!validateAmount()) return;
    const isValid = await validateWalletAddress();
    if (isValid) nextStep();
  };

  // Limit Message
  const getLimitMessage = () => {
    switch (kycStep) {
      case "unverified":
        return "Please complete KYC to withdraw funds";
      case "partial":
        return "Maximum withdrawal limit: $10,000";
      default:
        return "";
    }
  };

  return (
    <div className="w-full px-6">
      {/* ACCOUNT SELECT */}
      <div className="mt-4">
        <Label className="text-sm dark:text-white/75 text-black mb-1">
          Account
        </Label>
        <Select
          onValueChange={(value) => {
            const found = accounts.find(
              (account) => account.acc.toString() === value
            );
            if (found) setSelectedAccount(found);
          }}
          value={selectedAccount?.acc.toString()}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem
                key={account.acc}
                value={account.acc.toString()}
                disabled={parseFloat(account.margin_free) === 0}
              >
                <span className="px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                  MT5
                </span>
                <span className="text-black dark:text-white/75">
                  {account.acc}
                </span>
                <span className="text-xs  text-black dark:text-white/75">
                  ${parseFloat(account.margin_free).toFixed(2)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* WALLET ADDRESS */}
      <div className="mt-4">
        <Label className="text-sm dark:text-white/75 text-black mb-1">
          Wallet Address
        </Label>
        <Input
          value={toWallet}
          onChange={(e) => setToWallet(e.target.value)}
          placeholder="Enter your wallet address"
          className="border-[#362e36] p-5 text-black dark:text-white/75 dark:bg-[#070307] focus:ring-[#8046c9] w-full "
        />
      </div>

      {/* AMOUNT */}
      <div className="mt-4">
        <Label className="text-sm dark:text-white/75 text-black">
          Withdraw Amount
        </Label>
        <div className="relative w-full">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="Enter withdraw amount"
            className="dark:bg-[#070307]  pr-12 text-black dark:text-white/75 border-[#362e36] p-5 focus-visible:ring-blue-600 w-full"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-white text-sm">
            {selectedCrypto?.name || "USD"}
          </span>
        </div>

        {kycStep && (
          <p className="text-xs mt-2 text-[#945393]">{getLimitMessage()}</p>
        )}
      </div>

      {/* CONTINUE BUTTON */}
      <Button
        className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9] w-full mt-3"
        onClick={handleNextStep}
        disabled={isValidating || kycStep === "unverified"}
      >
        {isValidating ? "Validating..." : "Continue"}
      </Button>
    </div>
  );
}
