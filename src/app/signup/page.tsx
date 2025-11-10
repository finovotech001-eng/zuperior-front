"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { persistReferralCode } from "@/utils/referrals";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Persist referral code (if present) then redirect to login
    persistReferralCode();
    // Redirect to login page since signup is integrated there
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white">Redirecting to login...</div>
    </div>
  );
}
