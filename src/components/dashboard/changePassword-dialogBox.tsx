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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import EyeIcon from "@/components/EyeIcon";
import { Check } from "lucide-react";
import { VerifyOtpDialog } from "./verifyOtp-dialogBox";
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
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  // Fetch user email from backend if not in Redux
  useEffect(() => {
    const fetchUserEmail = async () => {
      // First try Redux store
      if (user?.email1) {
        setUserEmail(user.email1);
        return;
      }

      // If not in Redux, fetch from backend
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        if (!token) return;

        // Use Next.js API route which proxies to backend
        const response = await axios.get('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Backend returns { success: true, data: { email, ... } }
        if (response.data?.success && response.data?.data?.email) {
          setUserEmail(response.data.data.email);
          console.log('✅ User email fetched from backend:', response.data.data.email);
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error);
        // Keep email empty if fetch fails
      }
    };

    if (open) {
      fetchUserEmail();
    }
  }, [open, user?.email1]);

  const allChecksPassed = passwordChecks.every((c) => c.check(password));

  const handleSubmit = async () => {
    if (!allChecksPassed) {
      toast.error("Password does not meet all requirements.");
      return;
    }
    setIsSubmitting(true);

    // Send OTP to email - API generates the OTP
    try {
      // Validate email before sending
      if (!userEmail || !userEmail.trim()) {
        toast.error("Email address is required. Please refresh the page and try again.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userEmail.trim(), 
          name: user?.accountname || "User",
          purpose: "password-change", // Specify purpose for password change
          useBackend: true 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data?.success) {
        toast.error(data?.error || data?.message || "Failed to send OTP to your email.");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("OTP sent to your email.");
      setIsSubmitting(false);
      onOpen(false);
      setShowOtpDialog(true); // Show OTP dialog
    } catch (error) {
      toast.error("Failed to send OTP to your email.");
      setIsSubmitting(false);
    }
  };

  // Verify OTP with API, then change password
  const handleOtpVerify = async (enteredOtp: string) => {
    setIsSubmitting(true);
    try {
      // Verify OTP with backend
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userEmail, 
          otp: enteredOtp,
          useBackend: true 
        }),
      });
      
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok || !verifyData?.success) {
        toast.error(verifyData?.message || "Invalid OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      // OTP verified, now change password
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.put(
        `/api/mt5/change-password/${accountNumber}`,
        { 
          newPassword: password,
          passwordType: 'main' // main password type
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = response.data;
      
      if (data.success) {
        toast.success("Password changed successfully!");
        setShowOtpDialog(false);
        setPassword("");
        onOpen(false); // Close the main dialog after successful password change
      } else {
        toast.error(data?.message || "Failed to change password");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Unable to change password");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOtpResend = async () => {
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userEmail, 
          name: user?.accountname || "User",
          purpose: "password-change",
          useBackend: true 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data?.success) {
        toast.success("OTP resent to your email.");
      } else {
        toast.error(data?.error || data?.message || "Failed to resend OTP.");
      }
    } catch (error) {
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
        <DialogContent 
          disableOutsideClick={true}
          className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-8">
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
        email={userEmail}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />
    </>
  );
}
