// client/src/components/deposit/USDTManualStep2Instructions.tsx

"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface USDTManualStep2InstructionsProps {
  amount: string;
  selectedAccount: string;
  nextStep: () => void;
}

export function USDTManualStep2Instructions({
  amount,
  selectedAccount,
  nextStep,
}: USDTManualStep2InstructionsProps) {
  const paymentAddress = "Twinxa7902309skjhfsdlhflksjdhlkLL";
  const [copied, setCopied] = React.useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-2xl text-center font-bold dark:text-white/75 text-black mb-6">
        Pay with USDT TRC20 QR
      </h2>

      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          {/* USDT Logo and TRON Logo */}
          <div className="relative">
            <div className="w-20 h-20 bg-[#26A17B] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">₮</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#EF0027] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">◈</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">USDT TRC20 QR Network</h3>
              <h4 className="text-md font-medium text-white/80 mb-2">Payment Address</h4>
              <p className="text-sm font-mono text-white/60 mb-3">
                Twinxa7902309<br />
                skjhfsdlhflks<br />
                jdhlkLL
              </p>
              <Button
                onClick={handleCopyAddress}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Scan to send USDT</h4>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">
              Please make sure to send exactly {amount} USDT to the address above
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-white">Instructions</h5>
            <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
              <li>Send exactly {amount} USDT to the address above</li>
              <li>Use TRC20 network for USDT transfers</li>
              <li>Your deposit will be processed within 24 hours</li>
              <li>Keep your transaction hash for reference</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <Button
          className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
          onClick={nextStep}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}