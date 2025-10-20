"use client";

import VerificationAlert from "../verification-alert";
import { useState, useMemo, useEffect, useRef } from "react";
import { TextAnimate } from "@/components/ui/text-animate";

// Components
import { BalanceSection } from "./balance-section";
import { AccountsSection } from "./accounts-section";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { NewAccountDialog } from "./new-account";
import { useFetchUserData } from "@/hooks/useFetchUserData";

export function DashboardContent() {
  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const userData = getUserData();
  const name = userData?.name || "User";
  const [newAccountDialogOpen, setNewAccountDialogOpen] = useState(false);
  const verificationStatus = "unverified" as const; // Default status since we're not using Redux
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { fetchAllData, balance: totalBalance, isLoading, hasData, isAuthenticated } = useFetchUserData();

  //auto refetch every 2 mins
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    fetchAllData();

    intervalRef.current = setInterval(() => {
      fetchAllData();
    }, 120000); // 2 min

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAllData]);

  // Memoized wallet balance calculation
  const walletBalance = useMemo(
    () => (totalBalance > 0 ? `$${totalBalance.toFixed(2)}` : "$0.00"),
    [totalBalance]
  );

  // Handle new account dialog close with data refresh
  const handleNewAccountDialogClose = (open: boolean) => {
    setNewAccountDialogOpen(open);
  };

  // Show skeleton when loading
  if (isLoading && !hasData) {
    return <DashboardSkeleton />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-[25px]">
        <TextAnimate className="text-2xl font-bold text-black/85 dark:text-white/85 tracking-tighter px-2 md:px-0">
          Welcome to Zuperior CRM
        </TextAnimate>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mx-2 md:mx-0">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please log in to access your MT5 trading accounts and dashboard features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[25px]">
      <TextAnimate className="text-2xl font-bold text-black/85 dark:text-white/85 tracking-tighter px-2 md:px-0">
        {`Welcome, ${name || "User"}`}
      </TextAnimate>

      <VerificationAlert
        name={name || "User"}
        verificationStatus={verificationStatus}
      />
      <BalanceSection balance={walletBalance} />
      <AccountsSection onOpenNewAccount={() => setNewAccountDialogOpen(true)} />
      <NewAccountDialog
        open={newAccountDialogOpen}
        onOpenChange={handleNewAccountDialogClose}
      />
    </div>
  );
}
