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
import { Step1FormProps, WithdrawDest } from "@/components/withdraw/types";
import { useEffect, useMemo, useState } from "react";
import { store } from "@/store";
import { toast } from "sonner";
import axios from "axios";
import { TpAccountSnapshot } from "@/types/user-details";

export function Step1FormPayout({
  amount,
  setAmount,
  selectedNetwork,
  setSelectedNetwork,
  selectedCrypto,
  nextStep,
  accounts,
  selectedAccount,
  setSelectedAccount,
  toWallet,
  setToWallet,
  setSelectedDest,
  allowedMethodType,
}: Step1FormProps & {
  accounts: TpAccountSnapshot[];
  selectedAccount: TpAccountSnapshot | null;
  setSelectedAccount: (account: TpAccountSnapshot) => void;
  toWallet: string;
  setToWallet: (address: string) => void;
  setSelectedDest?: (dest: WithdrawDest | null) => void;
  allowedMethodType?: 'crypto' | 'bank';
}) {
  const [isValidating, setIsValidating] = useState(false);
  const [kycStep, setKycStep] = useState<
    "unverified" | "partial" | "verified" | ""
  >("");
  type ApprovedMethod = { type: 'crypto' | 'bank'; label: string; value: string; bank?: WithdrawDest['bank'] };
  const [approvedMethods, setApprovedMethods] = useState<ApprovedMethod[]>([]);

  // KYC Step
  useEffect(() => {
    setKycStep(store.getState().kyc.verificationStatus);
  }, []);

  // Load approved payment methods (wallet addresses + bank accounts)
  useEffect(() => {
    const load = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${base}/user/payment-methods`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json?.status === 'Success') {
          let list: ApprovedMethod[] = (json.data || [])
            .filter((pm: any) => pm.status === 'approved')
            .map((pm: any) => {
              const type = (pm.methodType ?? 'crypto') as 'crypto' | 'bank';
              if (type === 'bank') {
                const label = `${pm.bankName || 'Bank'} • ${pm.accountNumber || ''}`.trim();
                return { type: 'bank', label, value: pm.accountNumber || label, bank: {
                  bankName: pm.bankName,
                  accountName: pm.accountName,
                  accountNumber: pm.accountNumber,
                  ifscSwiftCode: pm.ifscSwiftCode,
                  accountType: pm.accountType,
                }};
              }
              return { type: 'crypto', label: pm.address, value: pm.address };
            });
          if (allowedMethodType) {
            list = list.filter((m) => m.type === allowedMethodType);
          }
          setApprovedMethods(list);
          if (list.length && !toWallet) {
            setToWallet(list[0].value);
            if (typeof setSelectedDest === 'function') {
              const dest: WithdrawDest = { type: list[0].type, label: list[0].label, value: list[0].value, bank: list[0].bank };
              setSelectedDest(dest);
            }
          }
        }
      } catch {}
    };
    load();
  }, [setToWallet, toWallet, allowedMethodType]);

  // Amount Validation
  const validateAmount = () => {
    if (!selectedAccount) {
      toast.error("Please select an account");
      return false;
    }
    const amountNum = parseFloat(amount);
    // Use account balance for withdrawal availability display/validation
    const balance = parseFloat(selectedAccount.balance);

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
    const selectedMethod = approvedMethods.find((m) => m.value === toWallet.trim());
    const isBank = selectedMethod?.type === 'bank';
    if (!isBank) {
      if (!(selectedNetwork ?? '').trim()) {
        toast.error("Network is required");
        return false;
      }
    }

    setIsValidating(true);
    try {
      // Skipping external address validation (no API available). Non-empty value already checked.
      return true;
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
        {/** De-duplicate and sanitize account list */}
        {(() => { return null; })()}
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
            {useMemo(() => {
              const seen = new Set<string>();
              return accounts
                .filter((account) => {
                  // Only show Live accounts
                  const accountType = (account as any).accountType || account.account_type || 'Live';
                  if (accountType !== 'Live') return false;
                  const id = String(account.acc ?? '').trim();
                  if (!id || id === '0' || seen.has(id)) return false;
                  seen.add(id);
                  return true;
                })
                .map((account, index) => (
                  <SelectItem
                    key={`${account.acc}-${index}`}
                    value={account.acc.toString()}
                    disabled={parseFloat(account.balance) === 0}
                  >
                    <span className="px-2 py-[2px] rounded-[5px] font-semibold text-black dark:text-white/75 tracking-tighter text-[10px]">
                      MT5
                    </span>
                    <span className="text-black dark:text-white/75">
                      {account.acc}
                    </span>
                    <span className="text-xs  text-black dark:text-white/75">
                      ${parseFloat(account.balance).toFixed(2)}
                    </span>
                  </SelectItem>
                ));
            }, [accounts])}
          </SelectContent>
        </Select>
      </div>

      {/* WALLET / BANK DESTINATION */}
      <div className="mt-4">
        <Label className="text-sm dark:text-white/75 text-black mb-1">{allowedMethodType === 'bank' ? 'Bank Account' : 'Wallet Address'}</Label>
        <Select value={toWallet} onValueChange={(val) => {
          setToWallet(val);
          if (typeof setSelectedDest === 'function') {
            const m = approvedMethods.find((x) => x.value === val);
            if (m) setSelectedDest({ type: m.type, label: m.label, value: m.value, bank: m.bank });
          }
        }}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={approvedMethods.length ? (allowedMethodType === 'bank' ? 'Select bank account' : 'Select wallet') : "No approved methods found"} />
          </SelectTrigger>
          <SelectContent>
            {approvedMethods.length === 0 ? (
              <SelectItem disabled value="__no_wallets__">No approved methods found</SelectItem>
            ) : (
              approvedMethods.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
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
