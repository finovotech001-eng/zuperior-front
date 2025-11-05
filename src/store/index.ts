import {
  configureStore,
  combineReducers,
  Reducer,
  AnyAction,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import transactionsReducer from "./slices/transactionsSlice";
import userReducer from "./slices/getUserSlice";
import accountsReducer from "./slices/accountsSlice";
import kycReducer from "./slices/kycSlice";
import mt5Reducer from "./slices/mt5AccountSlice";
import adminReducer from "./slices/adminSlice";
import adminStatsReducer from "./slices/adminStatsSlice";

// Step 1: Create nested persist config for mt5 slice
// IMPORTANT: Exclude accounts and totalBalance - these contain dynamic balance data
// that should ALWAYS be fetched fresh from API, never from localStorage cache
const mt5PersistConfig = {
  key: "mt5",
  storage,
  // Whitelist only static data that doesn't change often (groups, selectedAccount ID, flags)
  // Accounts array and totalBalance are NOT in whitelist = NOT persisted = always fresh
  whitelist: ["groups", "selectedAccount", "isLoading", "error", "isFetchingGroups", "lastGroupsFetchAt", "ownerClientId"],
};

// Step 2: Apply persist only to static parts of mt5 slice
// Accounts array is excluded - will always start empty and be fetched fresh
const persistedMt5Reducer = persistReducer(mt5PersistConfig, mt5Reducer);

// Step 3: Combine reducers
const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  accounts: accountsReducer,
  transactions: transactionsReducer,
  kyc: kycReducer,
  mt5: persistedMt5Reducer, // Use persisted version for mt5
  admin: adminReducer,
  adminStats: adminStatsReducer,
});

// Step 2: Custom root reducer with logout reset
const rootReducer: Reducer<ReturnType<typeof appReducer>, AnyAction> = (
  state,
  action
) => {
  if (action.type === "auth/logout") {
    // Clear persisted storage on logout
    if (typeof window !== "undefined") {
    }

    // Reset specific slices (keep mt5 to preserve _persist property)
    return appReducer(
      {
        ...state,
        auth: authReducer(undefined, action),
        user: userReducer(undefined, action),
        accounts: accountsReducer(undefined, action),
        transactions: transactionsReducer(undefined, action),
        kyc: kycReducer(undefined, action),
        admin: adminReducer(undefined, action),
        adminStats: adminStatsReducer(undefined, action),
      },
      action
    );
  }

  return appReducer(state, action);
};

// Step 4: Root persist config (exclude mt5 since it has its own nested config)
const persistConfig = {
  key: "root",
  storage,
  // Exclude mt5 from root persist since it has nested persist config that excludes accounts
  whitelist: ["auth", "user", "accounts", "transactions", "kyc", "admin", "adminStats"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Step 5: Export types and persistor
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
