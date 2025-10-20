"use client";

import { Clock } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { CopyButton } from "../CopyButton";

interface Step3PayoutProps {
  amount: string;
  toWallet: string;
  selectedCrypto: { name: string; [key: string]: unknown };
  payoutDetails?: {
    amount?: string;
    address?: string;
    [key: string]: unknown;
  } | null;
  accountNumber: string | undefined;
  payoutId?: string;
}

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

export default function Step3Payout({
  amount,
  toWallet,
  selectedCrypto,
  payoutDetails,
  accountNumber,
}: Step3PayoutProps) {
  useEffect(() => {
    toast.success(
      "Your withdrawal request has been successfully submitted and is being processed."
    );
  }, []);

  const handleSupportClick = () => {
    toast.message("Contact Support", {
      description: `Please email ${SUPPORT_EMAIL} for assistance with your withdrawal.`,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full relative">
      {/* Processing Message */}
      <div className="dark:bg-[#0f2b1d] bg-white border border-[#2e7d52] rounded-lg p-4 w-full max-w-md flex items-start gap-3">
        <div className="bg-[#2e7d52] rounded-full p-2 mt-0.5">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white/75 mb-1">
            Withdrawal Processing
          </h3>
          
          <p className="text-black dark:text-white/75 text-sm">
            Your withdrawal request has been initiated and is currently being
            processed. It will be completed within the next 12 to 24 hours.
          </p>
          
          <button
            onClick={handleSupportClick}
            className="text-[#2e7d52] hover:text-[#3a9365] text-xs mt-2 underline cursor-pointer"
          >
            Contact support if you have questions
          </button>
        </div>
      </div>

      {/* Transaction details */}
      <div className="mt-4 w-full max-w-md rounded-xl border border-white/20 p-3 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white/75">
            Withdrawal Details
          </h3>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-black dark:text-white/75">Amount</span>
          <span className="font-medium text-black dark:text-white/75">
            {payoutDetails?.amount || amount}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-black dark:text-white/75">Currency</span>
          <span className="font-medium text-black dark:text-white/75">{selectedCrypto?.name}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-black dark:text-white/75">Address</span>
          <div className="flex items-center gap-2">
            <span className="font-medium break-all text-xs text-black dark:text-white/75 text-right ">
              {payoutDetails?.address || toWallet}
            </span>
            <CopyButton text={payoutDetails?.address || toWallet} className="text-black dark:text-white/75" />
          </div>
        </div>

        {accountNumber && (
          <div className="flex justify-between py-2">
            <span className="text-black dark:text-white/75">Account Number</span>
            <span className="font-medium text-black dark:text-white/75">{accountNumber}</span>
          </div>
        )}
         <div className="mt-3 p-2 bg-black/20 rounded text-xs text-black dark:text-white/75">
          Your withdrawal order has been generated, and the amount has been deducted from your trading account. Once approved, the funds will be transferred to your given wallet.
        </div>
      </div>
    </div>
  );
}
