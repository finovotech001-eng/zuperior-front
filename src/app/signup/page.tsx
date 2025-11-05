"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page since signup is integrated there
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white">Redirecting to login...</div>
    </div>
  );
}

