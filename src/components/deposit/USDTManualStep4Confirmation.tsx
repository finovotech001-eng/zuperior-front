// client/src/components/deposit/USDTManualStep4Confirmation.tsx

"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface USDTManualStep4ConfirmationProps {
  amount: string;
  selectedAccount: string;
  transactionId: string;
  depositRequestId: string;
  onClose: () => void;
}

export function USDTManualStep4Confirmation({
  amount,
  selectedAccount,
  transactionId,
  depositRequestId,
  onClose,
}: USDTManualStep4ConfirmationProps) {
  const paymentAddress = "Twinxa7902309skjhfsdlhflksjdhlkLL";

  const handleCopyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      toast.success("Transaction ID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy transaction ID");
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(paymentAddress);
      toast.success("Address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white/75 text-black mb-2">
          🎉 Payment Request Created! 🎉
        </h2>
        <p className="text-white/60">
          Your manual deposit request has been submitted successfully
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-white/60">Amount</Label>
            <p className="text-lg font-semibold text-white">{amount} USDT</p>
          </div>

          <div>
            <Label className="text-sm text-white/60">Payment Address</Label>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <span className="font-mono text-sm text-white/80">
                {paymentAddress}
              </span>
              <Button
                onClick={handleCopyAddress}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-white/60">Transaction ID</Label>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <span className="font-mono text-sm text-white/80">
                {transactionId}
              </span>
              <Button
                onClick={handleCopyTransactionId}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-white/60">Request ID</Label>
            <p className="font-mono text-sm text-white/80">{depositRequestId}</p>
          </div>

          <div>
            <Label className="text-sm text-white/60">Account</Label>
            <p className="text-white/80">{selectedAccount}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-white mb-2">🎯 What's Next?</h4>
        <ul className="text-sm text-white/80 space-y-1">
          <li>✅ Your payment request is being processed</li>
          <li>🔄 Admin will review and approve your deposit</li>
          <li>💰 Funds will be credited to your MT5 account</li>
          <li>📱 You'll receive a notification once completed</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
          onClick={() => {
            toast.success("Payment request submitted successfully!");
            onClose();
          }}
        >
          Done
        </Button>

        <Button
          variant="outline"
          className="w-full text-white border-white/20 hover:bg-white/10"
          onClick={() => {
            window.open(`/transactions/${depositRequestId}`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Transaction Details
        </Button>
      </div>
    </div>
  );
}

// Add missing import for Label
import { Label } from "@/components/ui/label";