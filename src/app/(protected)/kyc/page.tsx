"use client";
import { TextAnimate } from "@/components/ui/text-animate";
import { store } from "@/store";
import { Lock } from "lucide-react";
import Link from "next/link";
import React, { memo, useMemo } from "react";

const CheckIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
));
CheckIcon.displayName = "CheckIcon";

const Page = () => {
  // const addressVerified = store.getState().kyc.isAddressVerified;
  // const identityVerified = store.getState().kyc.isDocumentVerified;
  const {
    isAddressVerified: addressVerified,
    isDocumentVerified: identityVerified,
  } = store.getState().kyc;

  console.log("Address Verified:", addressVerified);
  console.log("Identity Verified:", identityVerified);

  const cardMaskStyle = useMemo<React.CSSProperties>(
    () => ({
      WebkitMaskImage:
        "linear-gradient(212deg, rgb(49,27,71) 0%, rgb(20,17,24) 100%)",
      maskImage:
        "linear-gradient(100deg, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.4) 100%)",
      borderRadius: "15px",
      opacity: 0.25,
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
    }),
    []
  );
  return (
    <div className="flex flex-col items-center md:justify-center px-6 h-full">
      <div className="max-w-3xl w-full h-auto text-center">
        <TextAnimate
          as={"h1"}
          className="text-[22px] md:text-[28px] font-bold dark:text-white/75 text-black/75"
        >
          KYC Verification
        </TextAnimate>
        <TextAnimate as={"p"} className="text-black/50 dark:text-white/75">
          Please complete your KYC verification by providing both Address Proof
          and Identity Proof.
        </TextAnimate>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Identity Proof */}
          {identityVerified ? (
            <div className="relative h-auto min-h-[186px] rounded-[15px] bg-white dark:bg-green-400/5 p-6 border border-green-500/40 dark:hover:bg-green-400/10 overflow-hidden transition-transform">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
                  <CheckIcon />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Identity Verified
                </h2>
                <p className="mt-2 text-black/80 dark:text-white/80 text-sm text-center">
                  Your identity verification has been successfully completed.
                  {/*  You can now access all platform features. */}
                </p>
              </div>
            </div>
          ) : (
            <Link
              className="cursor-pointer relative h-auto rounded-[15px] bg-white dark:bg-[#13061d] p-6 border hover:bg-gradient-to-r from-white to-[#f4e7f6] dark:from-[#330F33] dark:to-[#1C061C] overflow-hidden transition-transform"
              href="/kyc/identity-proof"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl">🪪</span>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Identity Proof
                </h2>
                <p className="mt-2 text-black/80 dark:text-white/80 text-sm">
                  Upload your passport, national ID card, or driver&apos;s
                  license.
                </p>
              </div>
            </Link>
          )}

          {/* Address Proof */}
          {addressVerified ? (
            <div className="relative h-auto min-h-[186px]  rounded-[15px] bg-white dark:bg-green-400/5 p-6 border border-green-500/40 dark:hover:bg-green-400/10 overflow-hidden transition-transform">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
                  <CheckIcon />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Address Verified
                </h2>
                <p className="mt-2 text-black/80 dark:text-white/80 text-sm text-center">
                  Your Address verification has been successfully completed.
                </p>
              </div>
            </div>
          ) : !identityVerified ? (
            // 🔒 Documents not verified → Locked card
            <div className="relative h-auto min-h-[186px]  rounded-[15px] bg-gray-100 dark:bg-[#0d0414] p-6 border border-gray-300 dark:border-[#1D1825] overflow-hidden opacity-60 cursor-not-allowed">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center text-gray-700 dark:text-gray-300">
                  <Lock className="w-8 h-8 mb-2" />
                  <p className="text-sm">Document Verification Required</p>
                </div>
              </div>
            </div>
          ) : (
            // 📍 Documents verified but address not → Upload card
            <Link
              className="cursor-pointer relative h-auto rounded-[15px] bg-white dark:bg-[#13061d] p-6 border hover:bg-gradient-to-r from-white to-[#f4e7f6] dark:from-[#330F33] dark:to-[#1C061C] overflow-hidden transition-transform"
              href="/kyc/address-proof"
            >
              <div style={cardMaskStyle} className="border border-white/50" />
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl">📍</span>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Address Proof
                </h2>
                <p className="mt-2 text-black/80 dark:text-white/80 text-sm">
                  Upload a utility bill, bank statement, or other
                  government-issued proof of address.
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
