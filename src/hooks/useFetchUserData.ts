import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUserMt5Accounts } from "@/store/slices/mt5AccountSlice";
import { authService } from "@/services/api.service";

export function useFetchUserData() {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, totalBalance, isLoading, error } = useSelector(
    (state: RootState) => state.mt5
  );
  const hasData = accounts.length > 0;
  const isAuthenticated = authService.isAuthenticated();

  // Guard to prevent double fetch on first mount (React 18 StrictMode in dev)
  const hasFetchedRef = useRef(false);

  const fetchAllData = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping MT5 data fetch");
      return;
    }

    // Allow force refresh after account creation, but keep the guard for normal auto-fetch
    if (hasFetchedRef.current && !forceRefresh) {
      return;
    }

    try {
      console.log("🔄 Fetching MT5 user accounts...");
      await dispatch(fetchUserMt5Accounts())
        .unwrap()
        .catch((e: any) => {
          // Thunk was skipped by its `condition` (we added in the slice) – ignore
          if (e?.name === "ConditionError" || (e && e.message?.includes("condition"))) {
            console.log("⏭️ fetchUserMt5Accounts skipped by condition");
            return;
          }
          throw e; // real error
        });

      console.log("✅ MT5 accounts fetched successfully");
      hasFetchedRef.current = true;
    } catch (err: any) {
      // Don't throw error for authentication issues
      if (err === "Not authorized to access this route") return;
      console.error("❌ fetchAllData error:", err);
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
    isAuthenticated,
  };
}
