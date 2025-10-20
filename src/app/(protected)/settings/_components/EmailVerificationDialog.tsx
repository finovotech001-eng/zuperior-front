"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OtpInput from "react-otp-input";
import { toast } from "sonner";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string | null;
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  email,
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<"confirm" | "otp">("confirm");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // Step 1: send verification email
  const handleSendVerification = async () => {
    setLoading(true);
    try {
      // API call for sending verification mail
      // await api.sendVerificationEmail(email);
      await new Promise((r) => setTimeout(r, 800)); // demo delay
      toast.success("Verification email sent");
      setStep("otp");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    try {
      // API call for verifying OTP
      // await api.verifyOtp({ email, otp });
      await new Promise((r) => setTimeout(r, 800)); // demo delay
      toast.success("Email verified successfully!");
      onOpenChange(false);
    } catch {
      toast.error("Invalid OTP, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-transparent p-6 text-black dark:text-white rounded-[18px] w-full max-w-md [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2">Email Verification</DialogTitle>
        </DialogHeader>

        {step === "confirm" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700 dark:text-white/70">
              We will send a verification code to your email:{" "}
              <span className="font-medium">{email}</span>.
            </p>
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleSendVerification}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-gray-700 dark:text-white/70 text-center">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium">{email}</span>.
            </p>

            <OtpInput
              value={otp}
              onChange={(val) => {
                setOtp(val.trim());
                setError("");
              }}
              shouldAutoFocus
              numInputs={6}
              renderInput={(props, idx) => (
                <input
                  {...props}
                  key={idx}
                  inputMode="numeric"
                  className={`!w-13 h-13 text-center text-2xl font-mono rounded-md outline-none bg-[#181A1B] text-white border transition ${
                    error
                      ? "border-red-500"
                      : "border-gray-600 focus:border-purple-500"
                  }`}
                />
              )}
              containerStyle="flex justify-center gap-3"
            />

            {error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}

            <Button
              className="w-full"
              disabled={loading}
              onClick={handleVerifyOtp}
            >
              {loading ? "Verifying..." : "Confirm OTP"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
