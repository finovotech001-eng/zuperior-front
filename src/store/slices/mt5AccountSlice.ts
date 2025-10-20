// client/src/store/slices/mt5AccountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mt5Service } from "@/services/api.service";

// --------------------
// Type Definitions
// --------------------
export interface MT5Account {
  accountId: string;
  createdAt?: string;
  // Additional fields from API response (not stored in DB)
  name?: string;
  group?: string;
  balance?: number;
  equity?: number;
  credit?: number;
  margin?: number;
  marginFree?: number;
  marginLevel?: number;
  profit?: number;
  leverage?: number;
  isEnabled?: boolean;
  platform?: string;
  status?: boolean;
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
}

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
   }
 );

// ✅ Get User MT5 Accounts
export const fetchUserMt5Accounts = createAsyncThunk(
   "mt5/fetchUserAccounts",
   async (_, { rejectWithValue }) => {
     try {
       const response = await mt5Service.getUserMt5Accounts();
       
       console.log('🔍 MT5 Service response:', response);
       
       // Handle response format - check if Success is false
       if (response.Success === false) {
         console.log("⚠️ Failed to fetch MT5 accounts or no accounts found");
         return [];
       }

       // Get the accounts data
       const accounts = response.Data || [];
       
       if (accounts.length === 0) {
         console.log("No MT5 accounts found for user");
         return [];
       }

       // Transform MT5 API data to match expected MT5Account format
       const transformedAccounts = accounts.map((account: any) => ({
         accountId: String(account.Login),
         name: account.Name,
         group: account.Group,
         leverage: account.Leverage,
         balance: account.Balance || 0,
         equity: account.Equity || 0,
         credit: account.Credit || 0,
         margin: account.Margin || 0,
         marginFree: account.MarginFree || 0,
         marginLevel: account.MarginLevel || 0,
         profit: account.Profit || 0,
         isEnabled: account.IsEnabled !== false, // Default to true if not specified
         createdAt: account.Registration || new Date().toISOString(),
         updatedAt: account.LastAccess || new Date().toISOString()
       }));
       
       console.log(`✅ Transformed ${transformedAccounts.length} MT5 accounts`);
       return transformedAccounts;
     } catch (error: any) {
       console.error("❌ Error in fetchUserMt5Accounts:", error);
       
       if (error.response?.status === 401) {
         return [];
       }

       if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
         return rejectWithValue("Network error - please check your connection");
       }

       return rejectWithValue(
         error.response?.data?.Message || error.response?.data?.message || error.message || "Failed to fetch MT5 accounts"
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
      const transformedAccount = {
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
        updatedAt: accountData.LastAccess || new Date().toISOString()
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
      const response = await mt5Service.getMt5UserProfile(login);
      // Handle .NET Core API response format
      if (response.data?.Success === false) {
        return rejectWithValue(response.data?.Message || "Failed to refresh MT5 profile");
      }

      const profileData = response.data?.Data || response.data;
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
};

// --------------------
// Slice Definition
// --------------------
const mt5AccountSlice = createSlice({
  name: "mt5",
  initialState,
  reducers: {
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
        // Calculate total balance from accounts that have balance
        state.totalBalance = state.accounts.reduce(
          (sum, acc) => sum + (acc.balance || 0),
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchMt5Groups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMt5Groups.fulfilled, (state, action) => {
        state.isLoading = false;
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
        state.error = action.payload as string;
      })

      // Fetch User MT5 Accounts
      .addCase(fetchUserMt5Accounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserMt5Accounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
        // Calculate total balance from all accounts
        state.totalBalance = state.accounts.reduce(
          (sum, acc) => sum + (acc.balance || 0),
          0
        );
        console.log(`💰 Total Balance calculated: $${state.totalBalance}`);
      })
      .addCase(fetchUserMt5Accounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.accounts = [];
        state.totalBalance = 0;
      })

      // Create Account
      .addCase(createMt5Account.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMt5Account.fulfilled, (state) => {
        state.isLoading = false;
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
        const accountData = action.payload;
        if (!accountData) return;
        const account = state.accounts.find(
          (acc) => acc.accountId === accountData.accountId
        );
        if (account) {
          Object.assign(account, accountData);
          // Calculate total balance from accounts that have balance
          state.totalBalance = state.accounts.reduce(
            (sum, acc) => sum + (acc.balance || 0),
            0
          );
        }
      })
      .addCase(refreshMt5AccountProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// --------------------
// Exports
// --------------------
export const { setSelectedAccount, clearError, updateAccountBalance } =
  mt5AccountSlice.actions;
export default mt5AccountSlice.reducer;
