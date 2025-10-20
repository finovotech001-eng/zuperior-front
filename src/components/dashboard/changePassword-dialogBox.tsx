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
import { changeTpPassword } from "@/services/changeTpPassword";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import EyeIcon from "@/components/EyeIcon";
import { Check } from "lucide-react";
import { VerifyOtpDialog } from "./verifyOtp-dialogBox";
import { generateOtp } from "@/utils/generateOtp";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ChangePasswordDialogProps {
  accountNumber: number;
  open: boolean;
  onOpen: (open: boolean) => void;
}

const passwordChecks = [
  {
    label: "Between 6-15 characters",
    check: (v: string) => v.length >= 6 && v.length <= 15,
  },
  {
    label: "At least one upper and one lower case letter",
    check: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v),
  },
  {
    label: "At least one number",
    check: (v: string) => /\d/.test(v),
  },
  {
    label: "At least one special character",
    check: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
];

export function ChangePasswordDialog({
  open,
  onOpen,
  accountNumber,
}: ChangePasswordDialogProps) {
  const user = useSelector((state: RootState) => state.user.data);
  const email = user?.email1 ?? ""; // Always use Redux store email, fallback to empty string
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpSent, setOtpSent] = useState(""); // Store the generated OTP
  const dispatch = useAppDispatch();

  const allChecksPassed = passwordChecks.every((c) => c.check(password));

  const handleSubmit = async () => {
    if (!allChecksPassed) {
      toast.error("Password does not meet all requirements.");
      return;
    }
    setIsSubmitting(true);

    // 1. Generate OTP
    const otp = generateOtp(6);
    // 2. Send OTP to email
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) {
      toast.error("Failed to send OTP to your email.");
      setIsSubmitting(false);
      return;
    }
    setOtpSent(otp); // Store OTP locally for verification
    setIsSubmitting(false);
    onOpen(false);
    setShowOtpDialog(true); // Show OTP dialog
  };

  // Dummy handlers for OTP dialog (replace with your logic)
  const handleOtpVerify = async (enteredOtp: string) => {
    if (enteredOtp !== otpSent) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }
    setIsSubmitting(true);
    const freshToken = await dispatch(fetchAccessToken()).unwrap();
    try {
      const response = await changeTpPassword({
        accountNumber: String(accountNumber),
        oldPassword: "",
        newPassword: password,
        accessToken: freshToken,
      });
      if (response.status_code === "1") {
        toast.success("Password changed successfully!");
        setShowOtpDialog(false);
        setPassword("");
      } else {
        toast.error(response?.error || "Failed to change password");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Unable to change password");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOtpResend = async () => {
    const newOtp = generateOtp(6);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: newOtp }),
    });
    if (res.ok) {
      setOtpSent(newOtp);
      toast.success("OTP resent to your email.");
    } else {
      toast.error("Failed to resend OTP.");
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword("");
      setPasswordVisible(false);
    }
    onOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Change trading password
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full">
            <div className="text-base font-medium mb-2">
              Account # {accountNumber}
            </div>
            <Label
              htmlFor="new-password"
              className="space-y-1 flex flex-col items-start"
            >
              <div className="relative w-full">
                <Input
                  id="new-password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeIcon
                  visible={passwordVisible}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                />
              </div>
            </Label>
            <ul className="mt-2 mb-2 space-y-1 text-sm">
              {passwordChecks.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.check(password) ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
                  )}
                  <span
                    className={
                      c.check(password)
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !allChecksPassed}
                className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] cursor-pointer text-white"
              >
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <VerifyOtpDialog
        open={showOtpDialog}
        onOpen={setShowOtpDialog}
        email={email}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />
    </>
  );
}
