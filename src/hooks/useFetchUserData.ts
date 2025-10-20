import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUserMt5Accounts } from "@/store/slices/mt5AccountSlice";
import { authService } from "@/services/api.service";

export function useFetchUserData() {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, totalBalance, isLoading, error } = useSelector((state: RootState) => state.mt5);
  const hasData = accounts.length > 0;
  const isAuthenticated = authService.isAuthenticated();

  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping MT5 data fetch");
      return;
    }

    try {
       console.log("🔄 Fetching MT5 user accounts...");
       await dispatch(fetchUserMt5Accounts()).unwrap();
       console.log("✅ MT5 accounts fetched successfully");
     } catch (err: any) {
      // Don't throw error for authentication issues
      if (err === "Not authorized to access this route") {
        return;
      }
      throw err;
    }
  }, [dispatch, isAuthenticated]);

  // Auto-fetch on mount only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      console.log("User not authenticated, waiting for login");
    }
  }, [fetchAllData, isAuthenticated]);

  return {
    fetchAllData,
    balance: totalBalance,
    isLoading,
    hasData,
    error,
    accounts,
    isAuthenticated
  };
}
