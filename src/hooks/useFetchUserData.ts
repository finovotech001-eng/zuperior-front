import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUserAccountsFromDb, resetForNewClient, updateAccountBalance } from "@/store/slices/mt5AccountSlice";
import { authService, mt5Service } from "@/services/api.service";

export function useFetchUserData() {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, totalBalance, isLoading, error, ownerClientId } = useSelector(
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

    // If persisted state belongs to another user, clear it first
    const currentClientId = authService.getAuthData().clientId || null;
    if (currentClientId !== ownerClientId) {
      console.log("🔄 Detected client change. Resetting MT5 state cache.");
      dispatch(resetForNewClient(currentClientId));
    }

    // Allow force refresh after account creation, but keep the guard for normal auto-fetch
    if (hasFetchedRef.current && !forceRefresh) {
      return;
    }

    try {
      console.log("🔄 Fetching MT5 user accounts from DB...");
      await dispatch(fetchUserAccountsFromDb() as any)
        .unwrap()
        .catch((e: any) => {
          // Thunk was skipped – ignore condition errors
          if (e?.name === "ConditionError" || (e && e.message?.includes("condition"))) {
            console.log("⏭️ fetchUserAccountsFromDb skipped by condition");
            return;
          }
          throw e; // real error
        });

      console.log("✅ MT5 accounts fetched successfully from DB");

      // DISABLED: Refresh balances from MT5 getClientProfile - stopped per user request to prevent continuous API calls
      // try {
      //   const ids = (accounts || []).map(a => a.accountId).filter(Boolean);
      //   const ensureIdsRaw = ids.length ? ids : (
      //     (await mt5Service.getUserMt5AccountsFromDb())?.data?.accounts?.map((a: any) => a.accountId) ?? []
      //   );
      //   // Filter invalid/duplicate ids and avoid '0'
      //   const ensureIds = Array.from(new Set(
      //     ensureIdsRaw
      //       .map((id: any) => String(id).trim())
      //       .filter((id: string) => id && id !== '0' && /^\d+$/.test(id))
      //   ));
      //   await Promise.all(
      //     ensureIds.map(async (id: string) => {
      //       const res: any = await mt5Service.getMt5AccountProfile(id);
      //       if (res?.success && res.data) {
      //         const d = res.data;
      //         const bal = Number(d.Balance ?? d.balance ?? 0);
      //         const eq = Number(d.Equity ?? d.equity ?? 0);
      //         if (!Number.isNaN(bal)) {
      //           dispatch(updateAccountBalance({ login: Number(id), balance: bal, equity: eq }));
      //         }
      //       }
      //     })
      //   );
      // } catch (balErr) {
      //   console.warn("⚠️ Failed to refresh balances:", balErr);
      // }
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
