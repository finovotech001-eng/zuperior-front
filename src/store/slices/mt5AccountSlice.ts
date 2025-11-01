// client/src/store/slices/mt5AccountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mt5Service } from "@/services/api.service";

// --------------------
// Type Definitions
// --------------------
// Static account data from database
export interface MT5AccountDB {
  accountId: string;
  nameOnAccount?: string | null;
  leverage?: number | null;
  package?: string | null;
  accountType: string;
  password?: string | null;
  createdAt?: string;
}

// ClientProfile data from MT5 API
export interface ClientProfileData {
  Balance?: number;
  Equity?: number;
  Credit?: number;
  Margin?: number;
  MarginFree?: number;
  MarginLevel?: number;
  Profit?: number;
  Server?: string;
  Login?: number;
  Name?: string;
  Group?: string;
  Leverage?: number;
}

// Combined account data for display
export interface MT5Account extends MT5AccountDB {
  // ClientProfile fields (fetched once on render)
  balance?: number;
  equity?: number;
  credit?: number;
  margin?: number;
  marginFree?: number;
  marginLevel?: number;
  server?: string;
  mtLogin?: number;
  // Dynamic fields (updated every 200ms)
  profit?: number;
  // Legacy fields for backward compatibility
  name?: string;
  group?: string;
  isEnabled?: boolean;
  platform?: string;
  status?: boolean;
  isProfileReady?: boolean;
  lastProfileUpdateAt?: number;
}

export interface MT5Group {
  Group: string;
  Server: number;
  Company: string;
  Currency: string;
  CurrencyDigits: number;
  MarginCall: number;
  MarginStopOut: number;
  DemoLeverage: number;
}

export interface MT5State {
  accounts: MT5Account[];
  groups: MT5Group[];
  selectedAccount: MT5Account | null;
  totalBalance: number;
  isLoading: boolean;
  error: string | null;

  // ✅ ADD: per-thunk loading & throttling (does not replace existing fields)
  isFetchingAccounts?: boolean;
  isFetchingGroups?: boolean;
  lastAccountsFetchAt?: number | null;
  lastGroupsFetchAt?: number | null;
  ownerClientId?: string | null;
}

// Small helper to throttle rapid duplicate dispatches
const within = (ts: number | null | undefined, ms: number) =>
  typeof ts === "number" && Date.now() - ts < ms;

// Normalize API responses
const normalizeOk = (data: any) => {
  // Normalize responses from different backends
  if (data && typeof data === 'object') {
    if ('Data' in data && !('data' in data)) return { success: true, data: data.Data };
    if ('Success' in data) return { success: !!data.Success, data: data.Data ?? null, message: data.Message };
    if ('success' in data) return { success: !!data.success, data: data.data ?? null, message: data.message };
  }
  return { success: true, data };
};

// Determine if an account payload is complete enough for the UI
const isProfileComplete = (a: Partial<MT5Account>): boolean => {
  return Boolean(
    a &&
      a.name &&
      a.group &&
      a.leverage !== undefined &&
      a.balance !== undefined &&
      a.equity !== undefined
  );
};

// --------------------
// Async Thunks
// --------------------

// ✅ Get Groups
export const fetchMt5Groups = createAsyncThunk(
  "mt5/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await mt5Service.getMt5Groups();
      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        return rejectWithValue(response.data?.Message || "Failed to fetch MT5 groups");
      }
      return response.data?.Data || response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || "Failed to fetch MT5 groups"
      );
    }
  },
  {
    // ✅ ADD: skip if already fetching or if fetched very recently (1.5s)
    condition: (_, { getState }) => {
      const state = getState() as { mt5: MT5State };
      const s = state.mt5;
      if (s.isFetchingGroups) return false;
      if (within(s.lastGroupsFetchAt, 1500)) return false;
      return true;
    },
  }
);

// ✅ Get User Accounts from Database (Static fields only)
export const fetchUserAccountsFromDb = createAsyncThunk(
  "mt5/fetchUserAccountsFromDb",
  async (_, { rejectWithValue }) => {
    try {
      const response = await mt5Service.getUserAccountsFromDb();
      const normalized = normalizeOk(response);

      if (!normalized.success || !normalized.data?.accounts) {
        console.log("⚠️ No accounts found in database");
        return [];
      }

      const accounts = normalized.data.accounts as MT5AccountDB[];
      console.log(`✅ Fetched ${accounts.length} accounts from database`);
      
      return accounts.map(acc => ({
        ...acc,
        accountType: acc.accountType || 'Live'
      }));
    } catch (error: any) {
      console.error("❌ Error in fetchUserAccountsFromDb:", error);
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || error.message || "Failed to fetch accounts from database"
      );
    }
  }
);

// ✅ Fetch Account Profile (ClientProfile fields - once on render)
export const fetchAccountProfile = createAsyncThunk(
  "mt5/fetchAccountProfile",
  async ({ accountId, password }: { accountId: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await mt5Service.getAccountProfile(accountId, password);
      
      if (!response.success || !response.data) {
        return rejectWithValue("Failed to fetch account profile");
      }

      const profile = response.data as ClientProfileData;
      return {
        accountId,
        profile: {
          balance: profile.Balance || 0,
          equity: profile.Equity || 0,
          credit: profile.Credit || 0,
          margin: profile.Margin || 0,
          marginFree: profile.MarginFree || 0,
          marginLevel: profile.MarginLevel || 0,
          server: profile.Server || '',
          mtLogin: profile.Login || parseInt(accountId, 10)
        }
      };
    } catch (error: any) {
      console.error(`❌ Error fetching profile for ${accountId}:`, error);
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || error.message || "Failed to fetch account profile"
      );
    }
  }
);

// ✅ Fetch Balance and Profit only (for 200ms polling)
export const fetchAccountBalanceAndProfit = createAsyncThunk(
  "mt5/fetchAccountBalanceAndProfit",
  async ({ accountId, password }: { accountId: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await mt5Service.getAccountBalanceAndProfit(accountId, password);
      
      if (!response.success) {
        return { accountId, balance: 0, profit: 0 };
      }

      return {
        accountId,
        balance: response.data.Balance || 0,
        profit: response.data.Profit || 0
      };
    } catch (error: any) {
      console.error(`❌ Error fetching balance/profit for ${accountId}:`, error);
      // Return zero values on error instead of rejecting
      return { accountId, balance: 0, profit: 0 };
    }
  }
);

// Legacy method - kept for backward compatibility (deprecated, use fetchUserAccountsFromDb)
export const fetchUserMt5Accounts = createAsyncThunk(
  "mt5/fetchUserAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await mt5Service.getUserAccountsFromDb();
      const normalized = normalizeOk(response);

      if (!normalized.success || !normalized.data?.accounts) {
        return [];
      }

      const accounts = normalized.data.accounts as MT5AccountDB[];
      return accounts.map(acc => ({
        ...acc,
        accountType: acc.accountType || 'Live'
      }));
    } catch (error: any) {
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || error.message || "Failed to fetch accounts"
      );
    }
  }
);

// ✅ Create MT5 Account
export const createMt5Account = createAsyncThunk(
  "mt5/createAccount",
  async (
    data: {
      name: string;
      group: string;
      leverage?: number;
      masterPassword: string;
      investorPassword: string;
      email?: string;
      country?: string;
      city?: string;
      phone?: string;
      comment?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Redux slice - Calling MT5 service with data:", data);
      const response = await mt5Service.createMt5Account(data);
      console.log("✅ Redux slice - MT5 service response:", response);
      console.log("📊 Redux slice - Response data:", response.data);
      console.log("📊 Redux slice - Response data type:", typeof response.data);

      // Handle different response formats
      if (!response.data) {
        console.error("❌ No response data received");
        return rejectWithValue("No response data received from MT5 API");
      }

      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        console.error("❌ API returned error:", response.data.Message);
        return rejectWithValue(response.data?.Message || "Failed to create MT5 account");
      }

      // Try different response structures
      let accountData = null;

      if (response.data?.Data) {
        accountData = response.data.Data;
        console.log("📊 Using response.data.Data:", accountData);
      } else if (response.data?.Login) {
        accountData = response.data;
        console.log("📊 Using response.data directly:", accountData);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        accountData = response.data[0];
        console.log("📊 Using first array element:", accountData);
      } else {
        console.error("❌ Unexpected response structure:", response.data);
        return rejectWithValue("Unexpected response structure from MT5 API");
      }

      if (!accountData || accountData.Login === 0 || accountData.Login === undefined) {
        console.error("❌ Account creation failed - Login is 0 or undefined:", accountData);
        return rejectWithValue("MT5 account creation failed - account was not actually created");
      }

      console.log("📊 Redux slice - Account data with Login:", accountData);

      // Transform .NET Core user format to match expected MT5Account format
      const transformedAccount: MT5Account = {
        accountId: String(accountData.Login),
        name: accountData.Name || data.name,
        group: accountData.Group || data.group,
        leverage: accountData.Leverage || data.leverage,
        balance: accountData.Balance || 0,
        equity: accountData.Equity || 0,
        credit: accountData.Credit || 0,
        margin: accountData.Margin || 0,
        marginFree: accountData.MarginFree || 0,
        marginLevel: accountData.MarginLevel || 0,
        profit: accountData.Profit || 0,
        isEnabled: accountData.IsEnabled !== undefined ? accountData.IsEnabled : true,
        createdAt: accountData.Registration || new Date().toISOString(),
        updatedAt: accountData.LastAccess || new Date().toISOString(),
        isProfileReady: isProfileComplete({
          name: accountData.Name || data.name,
          group: accountData.Group || data.group,
          leverage: accountData.Leverage || data.leverage,
          balance: accountData.Balance || 0,
          equity: accountData.Equity || 0,
        }),
        lastProfileUpdateAt: Date.now(),
      };

      console.log("🔄 Redux slice - Transformed account:", transformedAccount);
      return transformedAccount;
    } catch (error: any) {
      console.error("❌ Redux slice - Error:", error);
      if (error.response?.status === 401)
        return rejectWithValue("Authentication required. Please log in first.");
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || error.message || "Failed to create MT5 account"
      );
    }
  }
);

// ✅ Deposit Funds
export const depositToMt5Account = createAsyncThunk(
  "mt5/deposit",
  async (
    data: { login: number; balance: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await mt5Service.depositToMt5(data);
      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        return rejectWithValue(response.data?.Message || "Failed to deposit funds");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401)
        return rejectWithValue("Authentication required. Please log in first.");
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || "Failed to deposit funds"
      );
    }
  }
);

// ✅ Withdraw Funds
export const withdrawFromMt5Account = createAsyncThunk(
  "mt5/withdraw",
  async (
    data: { login: number; balance: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await mt5Service.withdrawFromMt5(data);
      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        return rejectWithValue(response.data?.Message || "Failed to withdraw funds");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401)
        return rejectWithValue("Authentication required. Please log in first.");
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || "Failed to withdraw funds"
      );
    }
  }
);

// ✅ Get Client Profile
export const refreshMt5AccountProfile = createAsyncThunk(
  "mt5/refreshProfile",
  async (login: number, { rejectWithValue }) => {
    try {
      console.log(`[MT5] 🔄 refreshMt5AccountProfile → requesting profile for login=${login}`);
      const response = await mt5Service.getMt5UserProfile(login);
      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        console.warn(`[MT5] ⚠️ refreshMt5AccountProfile failed (Success=false) for login=${login}:`, response.data?.Message);
        return rejectWithValue(response.data?.Message || "Failed to refresh MT5 profile");
      }

      const profileData = response.data?.Data ?? response.data;
      console.log(`[MT5] ✅ refreshMt5AccountProfile response for login=${login}:`, profileData);

      // Guard: API sometimes returns 200 with empty/undefined body. Do not access properties.
      if (!profileData || profileData.Login === undefined || profileData.Login === 0) {
        console.warn(`[MT5] ⚠️ Empty or invalid profile payload for login=${login}. Will retry.`);
        return rejectWithValue("Empty MT5 profile payload");
      }
      // Transform .NET Core user format to match expected MT5Account format
      return {
        accountId: String(profileData.Login),
        name: profileData.Name,
        group: profileData.Group,
        leverage: profileData.Leverage,
        balance: profileData.Balance,
        equity: profileData.Equity,
        credit: profileData.Credit,
        margin: profileData.Margin,
        marginFree: profileData.MarginFree,
        marginLevel: profileData.MarginLevel,
        profit: profileData.Profit,
        isEnabled: profileData.IsEnabled,
        createdAt: profileData.Registration,
        updatedAt: profileData.LastAccess
      };
    } catch (error: any) {
      console.error(`[MT5] ❌ refreshMt5AccountProfile error for login=${login}:`, error?.response?.data || error?.message || error);
      if (error.response?.status === 401)
        return rejectWithValue("Authentication required. Please log in first.");
      return rejectWithValue(
        error.response?.data?.Message || error.response?.data?.message || "Failed to refresh MT5 profile"
      );
    }
  }
);

// --------------------
// Initial State
// --------------------
const initialState: MT5State = {
  accounts: [],
  groups: [],
  selectedAccount: null,
  totalBalance: 0,
  isLoading: false,
  error: null,

  // ✅ ADD: per-thunk flags & timestamps
  isFetchingAccounts: false,
  isFetchingGroups: false,
  lastAccountsFetchAt: null,
  lastGroupsFetchAt: null,
  ownerClientId: null,
};

// --------------------
// Slice Definition
// --------------------
const mt5AccountSlice = createSlice({
  name: "mt5",
  initialState,
  reducers: {
    resetForNewClient: (state, action: PayloadAction<string | null>) => {
      state.accounts = [];
      state.groups = [];
      state.selectedAccount = null;
      state.totalBalance = 0;
      state.isLoading = false;
      state.error = null;
      state.isFetchingAccounts = false;
      state.isFetchingGroups = false;
      state.lastAccountsFetchAt = null;
      state.lastGroupsFetchAt = null;
      state.ownerClientId = action.payload ?? null;
    },
    setSelectedAccount: (state, action: PayloadAction<MT5Account | null>) => {
      state.selectedAccount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateAccountBalance: (
      state,
      action: PayloadAction<{ login: number; balance: number; equity: number }>
    ) => {
      const account = state.accounts.find(
        (acc) => acc.accountId === String(action.payload.login)
      );
      if (account) {
        account.balance = action.payload.balance;
        account.equity = action.payload.equity;
        // Calculate total balance from Live accounts only
        state.totalBalance = state.accounts
          .filter((acc) => (acc.accountType || 'Live') === 'Live')
          .reduce(
            (sum, acc) => sum + (acc.balance || 0),
            0
          );
      }
    },
    addAccountOptimistically: (state, action: PayloadAction<MT5Account>) => {
      // Add new account immediately without waiting for fetch
      const exists = state.accounts.some(acc => acc.accountId === action.payload.accountId);
      if (!exists) {
        state.accounts.push(action.payload);
        // Only add to total balance if it's a Live account
        if ((action.payload.accountType || 'Live') === 'Live') {
          state.totalBalance += (action.payload.balance || 0);
          console.log('🚀 Live account added optimistically:', action.payload.accountId);
        } else {
          console.log('🚀 Demo/Non-Live account added (not included in balance):', action.payload.accountId);
        }
      }
      // Reset throttling to allow immediate refresh
      state.lastAccountsFetchAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchMt5Groups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isFetchingGroups = true;                 // ✅ ADD
      })
      .addCase(fetchMt5Groups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetchingGroups = false;                // ✅ ADD
        state.lastGroupsFetchAt = Date.now();          // ✅ ADD
        // ✅ Only include supported groups
        state.groups = action.payload.filter((g: MT5Group) =>
          [
            "real\\Bbook\\Pro\\dynamic-2000x-10P",
            "real\\Bbook\\Standard\\dynamic-2000x-20Pips",
          ].includes(g.Group)
        );
      })
      .addCase(fetchMt5Groups.rejected, (state, action) => {
        state.isLoading = false;
        state.isFetchingGroups = false;                // ✅ ADD
        state.lastGroupsFetchAt = Date.now();          // ✅ ADD
        state.error = action.payload as string;
      })

      // Fetch User Accounts from DB (new simplified method)
      .addCase(fetchUserAccountsFromDb.pending, (state) => {
        state.isFetchingAccounts = true;
        state.error = null;
      })
      .addCase(fetchUserAccountsFromDb.fulfilled, (state, action) => {
        state.isFetchingAccounts = false;
        state.lastAccountsFetchAt = Date.now();
        // Merge with existing accounts, updating only DB fields
        const dbAccounts = action.payload as MT5AccountDB[];
        dbAccounts.forEach((dbAcc) => {
          const existing = state.accounts.find(acc => acc.accountId === dbAcc.accountId);
          if (existing) {
            // Update only DB fields
            existing.accountType = dbAcc.accountType;
            existing.nameOnAccount = dbAcc.nameOnAccount;
            existing.leverage = dbAcc.leverage;
            existing.package = dbAcc.package;
            existing.password = dbAcc.password;
          } else {
            // Add new account
            state.accounts.push({ ...dbAcc } as MT5Account);
          }
        });
        // Remove accounts that are no longer in DB
        state.accounts = state.accounts.filter(acc => 
          dbAccounts.some(dbAcc => dbAcc.accountId === acc.accountId)
        );
        if (typeof window !== 'undefined') {
          state.ownerClientId = localStorage.getItem('clientId');
        }
      })
      .addCase(fetchUserAccountsFromDb.rejected, (state, action) => {
        state.isFetchingAccounts = false;
        state.lastAccountsFetchAt = Date.now();
        state.error = action.payload as string;
      })

      // Fetch Account Profile (ClientProfile fields - once)
      .addCase(fetchAccountProfile.fulfilled, (state, action) => {
        const { accountId, profile } = action.payload;
        const account = state.accounts.find(acc => acc.accountId === accountId);
        if (account) {
          // Update ClientProfile fields
          account.balance = profile.balance;
          account.equity = profile.equity;
          account.credit = profile.credit;
          account.margin = profile.margin;
          account.marginFree = profile.marginFree;
          account.marginLevel = profile.marginLevel;
          account.server = profile.server;
          account.mtLogin = profile.mtLogin;
          // Recalculate total balance
          state.totalBalance = state.accounts
            .filter((acc) => (acc.accountType || 'Live') === 'Live')
            .reduce((sum, acc) => sum + (acc.balance || 0), 0);
        }
      })

      // Fetch Balance and Profit (200ms polling)
      .addCase(fetchAccountBalanceAndProfit.fulfilled, (state, action) => {
        const { accountId, balance, profit } = action.payload;
        const account = state.accounts.find(acc => acc.accountId === accountId);
        if (account) {
          // Update only dynamic fields
          account.balance = balance;
          account.profit = profit;
          // Recalculate total balance
          state.totalBalance = state.accounts
            .filter((acc) => (acc.accountType || 'Live') === 'Live')
            .reduce((sum, acc) => sum + (acc.balance || 0), 0);
        }
      })

      // Fetch User MT5 Accounts (legacy - for backward compatibility)
      .addCase(fetchUserMt5Accounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isFetchingAccounts = true;
      })
      .addCase(fetchUserMt5Accounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetchingAccounts = false;
        state.lastAccountsFetchAt = Date.now();
        // Merge with existing accounts
        const dbAccounts = action.payload as MT5AccountDB[];
        dbAccounts.forEach((dbAcc) => {
          const existing = state.accounts.find(acc => acc.accountId === dbAcc.accountId);
          if (existing) {
            existing.accountType = dbAcc.accountType;
            existing.nameOnAccount = dbAcc.nameOnAccount;
            existing.leverage = dbAcc.leverage;
            existing.package = dbAcc.package;
          } else {
            state.accounts.push({ ...dbAcc } as MT5Account);
          }
        });
        // Remove accounts that are no longer in DB
        state.accounts = state.accounts.filter(acc => 
          dbAccounts.some(dbAcc => dbAcc.accountId === acc.accountId)
        );
        // Calculate total balance from Live accounts only
        state.totalBalance = state.accounts
          .filter((acc) => (acc.accountType || 'Live') === 'Live')
          .reduce((sum, acc) => sum + (acc.balance || 0), 0);
        if (typeof window !== 'undefined') {
          state.ownerClientId = localStorage.getItem('clientId');
        }
      })
      .addCase(fetchUserMt5Accounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isFetchingAccounts = false;
        state.lastAccountsFetchAt = Date.now();
        state.error = action.payload as string;
      })

      // Create Account
      .addCase(createMt5Account.pending, (state) => {
        state.isLoading = true;
        state.isFetchingAccounts = true;
        state.error = null;
      })
      .addCase(createMt5Account.fulfilled, (state, action) => {
        state.isLoading = false;
        // Immediately add the new account to state (optimistic update)
        const newAccount = action.payload;
        console.log('🚀 Adding new account to state immediately:', newAccount);
        
        // Check if account already exists to avoid duplicates
        const exists = state.accounts.some(acc => acc.accountId === newAccount.accountId);
        if (!exists && newAccount.accountId) {
          state.accounts.push(newAccount);
          // Only add to total balance if it's a Live account
          if ((newAccount.accountType || 'Live') === 'Live') {
            state.totalBalance += (newAccount.balance || 0);
            console.log(`✅ New Live account added! Total accounts: ${state.accounts.length}`);
          } else {
            console.log(`✅ New Demo/Non-Live account added (not included in balance). Total accounts: ${state.accounts.length}`);
          }
        }
        
        // Reset throttling to allow immediate refresh
        state.lastAccountsFetchAt = null;
        state.isFetchingAccounts = false;
      })
      .addCase(createMt5Account.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Deposit Funds
      .addCase(depositToMt5Account.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(depositToMt5Account.fulfilled, (state, action) => {
        state.isLoading = false;
        // For .NET Core API, deposit success means we should refresh account data
        if (action.payload?.Success) {
          console.log("Deposit successful - account data should be refreshed");
          // The account will be refreshed when the user data is refetched
        }
      })
      .addCase(depositToMt5Account.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Withdraw Funds
      .addCase(withdrawFromMt5Account.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(withdrawFromMt5Account.fulfilled, (state, action) => {
        state.isLoading = false;
        // For .NET Core API, withdraw success means we should refresh account data
        if (action.payload?.Success) {
          console.log("Withdrawal successful - account data should be refreshed");
          // The account will be refreshed when the user data is refetched
        }
      })
      .addCase(withdrawFromMt5Account.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Refresh Profile
      .addCase(refreshMt5AccountProfile.fulfilled, (state, action) => {
        const accountData = action.payload as Partial<MT5Account> & { accountId: string };
        if (!accountData) return;
        const account = state.accounts.find(
          (acc) => acc.accountId === accountData.accountId
        );
        if (account) {
          // Merge only provided fields to avoid wiping placeholders with undefined
          Object.assign(account, accountData);
          account.lastProfileUpdateAt = Date.now();
          account.isProfileReady = isProfileComplete(account);
          console.log(`[MT5] ✅ Profile merged for ${account.accountId}. isProfileReady=${account.isProfileReady}`, {
            name: account.name,
            group: account.group,
            leverage: account.leverage,
            balance: account.balance,
            equity: account.equity,
          });

          // Calculate total balance from Live accounts only
          state.totalBalance = state.accounts
            .filter((acc) => (acc.accountType || 'Live') === 'Live')
            .reduce(
              (sum, acc) => sum + (acc.balance || 0),
              0
            );
        }
      })
      .addCase(refreshMt5AccountProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        console.warn(`[MT5] ❌ refreshMt5AccountProfile rejected:`, action.payload);
      });
  },
});

// --------------------
// Exports
// --------------------
export const { setSelectedAccount, clearError, updateAccountBalance, resetForNewClient, addAccountOptimistically } =
  mt5AccountSlice.actions;
export default mt5AccountSlice.reducer;