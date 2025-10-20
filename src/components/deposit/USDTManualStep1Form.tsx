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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { store } from "@/store";
import { MT5Account } from "@/store/slices/mt5AccountSlice";

interface USDTManualStep1FormProps {
  amount: string;
  setAmount: (amount: string) => void;
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  accounts: MT5Account[];
  lifetimeDeposit: number;
  nextStep: () => void;
}

export function USDTManualStep1Form({
  amount,
  setAmount,
  selectedAccount,
  setSelectedAccount,
  accounts,
  lifetimeDeposit,
  nextStep,
}: {
  amount: string;
  setAmount: (amount: string) => void;
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  accounts: MT5Account[];
  lifetimeDeposit: number;
  nextStep: () => void;
}) {
  const [step, setStep] = useState<"unverified" | "partial" | "verified" | "">(
    ""
  );

  useEffect(() => {
    const status = store.getState().kyc.verificationStatus;
    if (
      status === "unverified" ||
      status === "partial" ||
      status === "verified"
    ) {
      setStep(status);
    }
  }, []);

  useEffect(() => {
    if (accounts.length === 0) {
      toast.error("No accounts found", {
        description: "Please check if you have any active trading accounts.",
      });
    }
  }, [accounts.length]);

  // Helper function to extract account type from group name
  const getAccountTypeFromGroup = (group: string): string => {
    if (group.includes('Pro')) return 'Pro';
    if (group.includes('Standard')) return 'Standard';
    return 'Standard'; // Default fallback
  };

  const selectedAccountObj = accounts.find(
    (account) => account.accountId === selectedAccount
  );

  const handleAccountChange = (value: string) => {
    setSelectedAccount(value);
  };

  const validateAmount = () => {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (amountNum < 10) {
      toast.error("Minimum deposit amount is $10");
      return false;
    }

    const totalAfterDeposit = lifetimeDeposit + amountNum;

    if (step === "unverified" && totalAfterDeposit > 5000) {
      toast.error("Deposit limit is $5,000 for Unverified accounts");
      return false;
    }
    if (step === "partial" && totalAfterDeposit > 10000) {
      toast.error("Deposit limit is $10,000 for Partially Verified accounts");
      return false;
    }

    return true;
  };

  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
    toast.dismiss();

    const amountNum = parseFloat(value);
    if (isNaN(amountNum)) return;
    const totalAfterDeposit = lifetimeDeposit + amountNum;

    if (amountNum < 10) {
      toast.error("Minimum deposit amount is $10");
      return;
    }
    if (step === "unverified" && totalAfterDeposit > 5000) {
      toast.error("Deposit limit is $5,000 for Unverified accounts");
      return;
    }
    if (step === "partial" && totalAfterDeposit > 10000) {
      toast.error("Deposit limit is $10,000 for Partially Verified accounts");
      return;
    }
  };


  const handleContinue = () => {
    if (!selectedAccount) {
      toast.error("Account selection required", {
        description: "Please select an account to continue.",
      });
      return;
    }
    if (!amount) {
      toast.error("Amount required", {
        description: "Please enter an amount to continue.",
      });
      return;
    }
    if (!validateAmount()) return;

    toast.success("Details verified", {
      description: "Proceeding to the next step.",
    });
    nextStep();
  };

  const getLimitMessage = () => {
    if (step === "verified") {
      return "No deposit limits (Unlimited account)";
    } else if (step === "partial") {
      return "Maximum deposit limit: $10,000";
    } else if (step === "unverified") {
      return "Maximum deposit limit: $5,000";
    }
    return "";
  };

  return (
    <div className="w-full px-6 py-4">
      {/* Account Selection */}
      <div className="mb-6">
        <Label className="text-sm dark:text-white/75 text-black mb-3 block">Account</Label>
        <Select
          onValueChange={handleAccountChange}
          value={selectedAccount}
          disabled={accounts.length === 0}
        >
          <SelectTrigger className="border-[#362e36] p-5 flex items-center w-full text-white focus:ring-[#8046c9]">
            <SelectValue placeholder="Select Account">
              {selectedAccountObj ? (
                <span className="flex items-center">
                  <span className="bg-[#9F8ACF]/30 px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                    MT5
                  </span>
                  <span className="ml-2 dark:text-white/75 text-black">
                    {selectedAccountObj.accountId} ({getAccountTypeFromGroup(selectedAccountObj.group || '')})
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ${parseFloat((selectedAccountObj.balance || 0).toString()).toFixed(2)}
                  </span>
                </span>
              ) : (
                "Select Account"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-[#1e171e] dark:bg-[#060207]">
            {accounts
              .filter((account) => account.isEnabled)
              .map((account) => (
                <SelectItem
                  key={account.accountId}
                  value={account.accountId}
                >
                  <span className="bg-[#9F8ACF]/30 px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                    MT5
                  </span>
                  <span>
                    {account.accountId} ({getAccountTypeFromGroup(account.group || '')})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ${parseFloat((account.balance || 0).toString()).toFixed(2)}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Field */}
      <div className="mb-6">
        <Label className="text-sm dark:text-white/75 text-black mb-3 block">Amount</Label>
        <div className="relative w-full">
          <Input
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="dark:text-white/75 text-black pr-12 border-[#362e36] p-5 focus-visible:ring-blue-600 w-full"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white/75 text-black text-sm">
            USDT
          </span>
        </div>
        {step && (
          <p className="text-xs mt-2 text-[#945393]">{getLimitMessage()}</p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
        onClick={handleContinue}
        disabled={accounts.length === 0 || !selectedAccount || !amount}
      >
        Continue
      </Button>
    </div>
  );
}
