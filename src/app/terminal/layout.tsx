"use client";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import TickerSidebar from "./_components/tickerSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecked(true); // Mark auth as confirmed
    }
  }, [token, router]);

  // Don’t render layout until auth is confirmed
  if (!authChecked) return null;

  return (
    <div className="flex h-screen flex-col bg-[linear-gradient(180deg,#F7F5FC_0%,#F2EDFF_100%)] dark:bg-[#01040D]">
      <div className="flex flex-1 overflow-hidden">
        <TickerSidebar />
        <main className="flex-1 flex flex-col gap-3 dark:bg-[#01040D]">
          <Navbar />
          <div className="md:px-0 px-1 flex-1 pb-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
