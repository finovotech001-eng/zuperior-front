"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface VerifyOtpDialogProps {
  open: boolean;
  onOpen: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export function VerifyOtpDialog({
  open,
  onOpen,
  email,
  onVerify,
  onResend,
}: VerifyOtpDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Automatically focus next input on change
  const handleOtpChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < otp.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await onVerify(otp.join(""));
      setOtp(["", "", "", "", "", ""]);
      onOpen(false);
    } catch {
      // handle error
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
    } finally {
      setIsResending(false);
      setTimer(60);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) setOtp(["", "", "", "", "", ""]);
    onOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Confirm your request
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 text-base font-medium mb-2">
            <Mail className="w-5 h-5 text-[#6242a5]" />
            <span>
              Enter the code we sent to:{" "}
              <span className="font-semibold">{email}</span>
            </span>
          </div>
          <div className="flex gap-2 justify-center mt-2 mb-2">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                className={`w-12 h-12 text-center text-lg font-semibold tracking-widest border-2 rounded-md ${
                  activeIndex === idx
                    ? "border-[#6242a5]"
                    : "border-gray-300"
                }`}
                onFocus={() => setActiveIndex(idx)}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-2">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isResending || timer > 0}
              className="text-[#6242a5] underline"
            >
              {isResending ? "Resending..." : "Resend code"}
            </Button>
            <span className="text-xs text-gray-500">
              {timer > 0
                ? `Get a new code or Try another option in 00:${timer
                    .toString()
                    .padStart(2, "0")}`
                : ""}
            </span>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isVerifying}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.some((d) => !d)}
              className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] cursor-pointer text-white"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}