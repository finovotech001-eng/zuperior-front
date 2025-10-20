"use client";

import React from "react";
//import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
//import { MoveLeft } from "lucide-react";
import Link from "next/link";

interface VerificationInProgressStepProps {
  onNext?: () => void;
  onBack: () => void;
  isLoading: boolean;
  verificationStatus?: string;
  declinedReason?: string | null;
}

export default function VerificationInProgressStep({
  //onNext,
  onBack,
  isLoading,
  verificationStatus,
  declinedReason
}: VerificationInProgressStepProps) {
  /* const handleNext = () => {
    toast.success("Identity verification completed! 🎉");
    onNext();
  }; */


  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <Card className="border-0 bg-white dark:bg-[#01040D] p-10 dark:text-white text-black max-w-md w-full shadow-lg rounded-lg">
          <div className="flex flex-col items-center space-y-8 text-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              className="rounded-md object-contain z-[9999] relative h-24 w-24"
              preload="auto"
            >
              <source src="/logo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div>
              <h2 className="text-2xl font-extrabold leading-tight">
                Verifying your Identity...
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium italic">
                We are verifying your identity—this will only take 10-15
                seconds. Please wait while we process your information. Almost
                there! ⏳
              </p>
            </div>
            <div className="w-full space-y-4">
              {/* <Button
                className="w-full py-5 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white text-black font-semibold shadow-lg hover:brightness-110 transition"
                onClick={handleNext}
                disabled={isLoading}
              >
                Go to Review
              </Button> */}
              {/* <Button
                variant="ghost"
                className="w-full underline text-gray-700 dark:text-gray-300 hover:text-[#9f8bcf] dark:hover:text-[#b893e8]"
                onClick={onBack}
                disabled={isLoading}
              >
                <MoveLeft className="h-5 w-5 mr-2 inline-block" />
                Go to Dashboard
              </Button> */}
            </div>
          </div>
        </Card>
      </div>
    );

  if (verificationStatus === "verified")
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center space-y-6">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
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
        </div>

        <h2 className="text-2xl font-bold text-green-400">
          Verification Successful!
        </h2>

        <p className="text-gray-400 max-w-md">
          Your identity has been successfully verified. You can now proceed to the next step.
        </p>

        <Link
          className="px-6 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          href={'/'}
        >
          Go to Dashboard
        </Link>
      </div>

    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6 max-w-lg mx-auto">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-900/40 border border-purple-700/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-red-400">
        Verification Declined
      </h2>

      <p className="text-gray-400 max-w-md">
        We couldnt verify your identity at this time. This usually happens due to
        missing or unclear documents.
      </p>

      {declinedReason && (
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-lg p-4 w-full text-left">
          <p className="text-sm text-red-300 font-medium">
            <span className="font-semibold">Reason:</span> {declinedReason}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-4">
        <Button
          variant="default"
          className="px-6 py-2 font-medium rounded-lg bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-[#FFFFFF] text-[#000000] cursor-pointer"
          onClick={onBack}
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          className="px-6 py-2 font-medium rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-900/30 transition"
        >
          Contact Support
        </Button>
      </div>

      {/* Help Link */}
      <p className="text-xs text-gray-500 mt-4">
        Need help? Check our{" "}
        <a
          href="/support"
          className="underline text-purple-400 hover:text-purple-300 transition"
        >
          KYC guidelines
        </a>{" "}
        before retrying.
      </p>
    </div>


  );
}
