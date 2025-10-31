"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { refreshMt5AccountProfile } from "@/store/slices/mt5AccountSlice";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: number;
  currentBalance: number;
}

export function TopUpDialog({
  open,
  onOpenChange,
  accountId,
  currentBalance,
}: TopUpDialogProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
  };

  const validateAmount = () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    
    if (amountNum < 1) {
      toast.error("Minimum top-up amount is $1");
      return false;
    }
    
    return true;
  };

  const handleTopUp = async () => {
    if (!validateAmount()) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`/api/mt5/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          login: accountId,
          balance: parseFloat(amount),
          comment: "Demo account top-up"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to top up account');
      }

      toast.success(`Successfully added $${parseFloat(amount).toFixed(2)} to your demo account`);
      
      // Refresh account profile to update balance
      dispatch(refreshMt5AccountProfile(accountId) as any);
      
      // Close dialog and reset form
      setAmount("");
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error topping up account:', error);
      toast.error(error.message || 'Failed to top up account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] flex flex-col items-center w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border sm:max-w-[425px]"
        disableOutsideClick={true}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold dark:text-white/75">
            Top Up Demo Account
          </DialogTitle>
        </DialogHeader>

        <div className="w-full px-6 mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-black dark:text-white/75">
              Amount (USD)
            </Label>
            <p className="text-xs text-black/60 dark:text-white/60 mb-2">
              Add funds to your demo account. Current balance: <span className="font-semibold">${currentBalance.toFixed(2)}</span>
            </p>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              disabled={isLoading}
              className="text-lg border-[#362e36] p-5 dark:bg-[#070307] w-full text-black dark:text-white dark:border-[#1e171e]"
            />
            <p className="text-xs text-black/60 dark:text-white/60">
              Minimum amount: $1.00
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5 w-full">
            <Button
              variant="outline"
              className="flex-1 border border-[#362e36] dark:bg-[#070307] dark:text-white/75 dark:hover:bg-[#1e171e]"
              onClick={() => {
                setAmount("");
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTopUp}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
            >
              {isLoading ? "Processing..." : "Top Up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

