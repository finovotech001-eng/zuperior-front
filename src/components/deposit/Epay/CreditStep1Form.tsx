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
import { CreditStep1Props } from "./types";
import { MT5Account } from "@/store/slices/mt5AccountSlice";

export function CreditStep1Form({
  amount,
  setAmount,
  nextStep,
  accounts,
  selectedAccount,
  setSelectedAccount,
  currency,
  lifetimeDeposit
}: CreditStep1Props & {
  accounts: MT5Account[];
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  lifetimeDeposit: number;
}) {
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);

  useEffect(() => {
    if (store.getState().kyc.verificationStatus === "unverified") {
      setStepOne(true);
    }
    if (store.getState().kyc.verificationStatus === "partial") {
      setStepTwo(true);
    }
    if (store.getState().kyc.verificationStatus === "verified") {
      setStepThree(true);
    }
  }, []);

  useEffect(() => {
    if (accounts.length === 0) {
      toast.error("No accounts found", {
        description: "Please check if you have any active trading accounts.",
      });
    }
  }, [accounts.length]);

  const selectedAccountObj = accounts.find(
    (account) => account.accountId === selectedAccount
  );

  const handleAccountChange = (value: string) => {
    setSelectedAccount(value);
  };

  // Helper function to extract account type from group name
  const getAccountTypeFromGroup = (group: string): string => {
    if (group.includes('Pro')) return 'Pro';
    if (group.includes('Standard')) return 'Standard';
    return 'Standard'; // Default fallback
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

    if (stepOne && !stepTwo && !stepThree && totalAfterDeposit > 5000) {
      toast.error("Deposit limit is $5,000 for Unverified accounts");
      return false;
    }

    if (stepTwo && !stepThree && totalAfterDeposit > 10000) {
      toast.error("Deposit limit is $10,000 for Partially Verified accounts");
      return false;
    }

    return true;
  };

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d*$/;

    if (!regex.test(value)) return;

    setAmount(value);

    const amountNum = parseFloat(value);
    if (isNaN(amountNum)) return;

    const totalAfterDeposit = lifetimeDeposit + amountNum;

    toast.dismiss();

    if (amountNum < 10) {
      toast.error("Minimum deposit amount is $10");
      return;
    }

    if (stepOne && !stepTwo && !stepThree && totalAfterDeposit > 5000) {
      toast.error("Deposit limit is $5,000 for Unverified accounts");
      return;
    }

    if (stepTwo && !stepThree && totalAfterDeposit > 10000) {
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

    if (!validateAmount()) {
      return;
    }

    toast.success("Details verified", {
      description: "Proceeding to the next step.",
    });
    nextStep();
  };

  const getLimitMessage = () => {
    if (stepThree) {
      return "No deposit limits (Unlimited account)";
    } else if (stepTwo) {
      return "Maximum deposit limit: $10,000";
    } else if (stepOne) {
      return "Maximum deposit limit: $5,000";
    }
    return "";
  };

  return (
    <div className="w-full px-6">
      <h2 className="text-2xl text-center font-bold dark:text-white/75 text-black">
        Pay {amount} {currency?.toUpperCase() ?? ""}
      </h2>

      <div className="-mt-4 w-full">
        <div className="rounded-lg ">
          <div className="mt-4">
            <Label className="text-sm dark:text-white/75 text-black mb-1">Account</Label>
            <Select
              onValueChange={handleAccountChange}
              value={selectedAccount}
              disabled={accounts.length === 0}
            >
              <SelectTrigger className="border-[#362e36] p-5 dark:bg-[#070307] flex items-center w-full dark:text-white/75 text-black focus:ring-[#8046c9]">
                <SelectValue placeholder="Select Account">
                  {selectedAccountObj ? (
                    <span className="flex items-center">
                      <span className="bg-[#9F8ACF]/30  px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                        MT5
                      </span>
                      <span className="ml-2">
                        {selectedAccountObj.accountId} ({getAccountTypeFromGroup(selectedAccountObj.group)})
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ${selectedAccountObj.balance.toFixed(2)}
                      </span>
                    </span>
                  ) : (
                    "Select Account"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-[#1e171e] bg-white dark:bg-[#060207]">
                {accounts.map((account, index) => (
                  <SelectItem
                    key={`${account.accountId}-${index}`}
                    value={account.accountId}
                  >
                    <span className="bg-[#9F8ACF]/30  px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                      MT5
                    </span>
                    <span>
                      {account.accountId} ({getAccountTypeFromGroup(account.group)})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${account.balance.toFixed(2)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative w-full">
          <div className="space-y-2 w-full">
            <Label className="text-sm dark:text-white/75 text-black">Currency</Label>
            <div className="relative w-full">
              <Input
                value="USD"
                readOnly
                className="dark:bg-[#070307] dark:text-white/75 text-black pr-12 border-[#362e36] p-5 focus-visible:ring-blue-600 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative w-full">
          <div className="space-y-2 w-full">
            <Label className="text-sm dark:text-white/75 text-black">Amount</Label>
            <div className="relative w-full">
              <Input
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="dark:bg-[#070307] dark:text-white/75 text-black pr-12 border-[#362e36] p-5 focus-visible:ring-blue-600 w-full"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white/75 text-black text-sm">
                USD
              </span>
            </div>

            {(stepOne || stepTwo || stepThree) && (
              <p className="text-xs mt-2 text-[#945393]">{getLimitMessage()}</p>
            )}
          </div>

          <Button
            className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9] w-full mt-3"
            onClick={handleContinue}
            disabled={accounts.length === 0}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
