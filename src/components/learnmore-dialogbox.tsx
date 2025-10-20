"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

export default function LearnMoreDialogBox({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Get verification status from Redux
  const verificationStatus = useSelector(
    (state: RootState) => state.kyc.verificationStatus
  );

  // Step coloring logic
  const isIdentityVerified =
    verificationStatus === "verified" || verificationStatus === "partial";
  const isAddressVerified = verificationStatus === "verified";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-2 border-transparent p-6 dark:text-white/75 text-black rounded-[18px] flex flex-col items-center w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
        disableOutsideClick={true}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold dark:text-white/75 text-black">
            Verification steps
          </DialogTitle>
          <div className="text-sm dark:text-white/75 text-black font-normal mb-2 w-full text-center">
            This will take about 10 minutes
          </div>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4 mt-2 relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-[25px] h-[100px] w-px bg-gray-400/40 z-0" />
          {/* Step 1 */}
          <div className="flex items-start gap-3 relative z-10">
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full font-bold mt-1 ${
                isIdentityVerified
                  ? "bg-[#6242a5] text-white"
                  : "bg-[#181422] text-gray-400 border border-gray-500"
              }`}
              style={{ minWidth: 24 }}
            >
              1
            </span>
            <div>
              <span
                className={`font-semibold ${
                  isIdentityVerified ? "text-white" : "text-gray-400"
                }`}
              >
                Verify your identity
              </span>
              <div className="text-xs text-gray-400 mb-1">
                Features and Limits
              </div>
              <ul
                className={`list-disc ml-5 text-sm ${
                  isIdentityVerified ? "text-gray-200" : "text-gray-500"
                }`}
              >
                <li>Deposits up to 10,000 USD</li>
                <li>Unlock Withdrawals</li>
              </ul>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex items-start gap-3 relative z-10">
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full font-bold mt-1 ${
                isAddressVerified
                  ? "bg-[#6242a5] text-white"
                  : "bg-[#181422] text-gray-400 border border-gray-500"
              }`}
              style={{ minWidth: 24 }}
            >
              2
            </span>
            <div>
              <span
                className={`font-semibold ${
                  isAddressVerified ? "text-white" : "text-gray-400"
                }`}
              >
                Verify residential address
              </span>
              <div className="text-xs text-gray-400 mb-1">
                Features and Limits
              </div>
              <ul
                className={`list-disc ml-5 text-sm ${
                  isAddressVerified ? "text-gray-200" : "text-gray-500"
                }`}
              >
                <li>Unlimited deposits</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link href="/kyc" passHref>
              <Button
                className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9] font-semibold px-6 py-2 rounded-[8px] shadow-md transition-all duration-200 ease-in-out"
                onClick={() => onOpenChange(false)}
              >
                Start now
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
