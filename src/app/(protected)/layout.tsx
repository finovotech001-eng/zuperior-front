"use client";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchKycStatus } from "@/store/slices/kycSlice";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [authChecked, setAuthChecked] = useState(false);
  
  // Enable session checking (WebSocket + polling) for account deletion
  useSessionCheck();

  useEffect(() => {
    // Check authentication using localStorage
    const token = localStorage.getItem('userToken');
    const clientId = localStorage.getItem('clientId');

    if (!token || !clientId) {
      router.push("/login");
    } else {
      setAuthChecked(true); // Mark auth as confirmed
      
      // Fetch KYC status from database (non-blocking)
      dispatch(fetchKycStatus()).catch((error) => {
        console.error("Failed to load KYC status:", error);
        // Continue even if KYC fetch fails - don't block the app
      });
    }
  }, [router, dispatch]);


  // Don't render layout until auth is confirmed
  if (!authChecked) return null;

  return (
    <div className="flex h-screen flex-col bg-[linear-gradient(180deg,#F7F5FC_0%,#F2EDFF_100%)] dark:bg-[#01040D]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto dark:bg-[#01040D]">
          <Navbar />
          <div className="lg:px-8 md:px-4 px-1 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
