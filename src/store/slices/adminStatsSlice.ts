// client/src/store/slices/adminStatsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface DashboardStats {
  totalUsers: number;
  emailUnverified: number;
  kycPending: number;
  mt5Accounts: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  recentActivity: any[];
}

interface UserStats {
  totalDeposits: number;
  totalWithdrawals: number;
  depositCount: number;
  withdrawalCount: number;
  mt5Accounts: number;
  transactions: number;
}

interface DepositStats {
  statusStats: Array<{
    status: string;
    _count: { status: number };
    _sum: { amount: number };
  }>;
  totalStats: {
    _sum: { amount: number };
    _count: number;
  };
  dailyStats: Array<{
    date: string;
    count: number;
    total_amount: number;
  }>;
  period: string;
}

interface WithdrawalStats {
  statusStats: Array<{
    status: string;
    _count: { status: number };
    _sum: { amount: number };
  }>;
  methodStats: Array<{
    method: string;
    _count: { method: number };
    _sum: { amount: number };
  }>;
  totalStats: {
    _sum: { amount: number };
    _count: number;
  };
  dailyStats: Array<{
    date: string;
    count: number;
    total_amount: number;
  }>;
  period: string;
}

interface KYCStats {
  statusStats: Array<{
    verificationStatus: string;
    _count: { verificationStatus: number };
  }>;
  verificationStats: {
    _count: {
      isDocumentVerified: number;
      isAddressVerified: number;
    };
  };
  dailyStats: Array<{
    date: string;
    count: number;
  }>;
  period: string;
}

interface ActivityStats {
  actionStats: Array<{
    action: string;
    _count: { action: number };
  }>;
  entityStats: Array<{
    entity: string;
    _count: { entity: number };
  }>;
  dailyStats: Array<{
    date: string;
    count: number;
  }>;
  period: string;
}

interface AdminStatsState {
  dashboard: {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
  };
  userStats: {
    data: UserStats | null;
    loading: boolean;
    error: string | null;
  };
  depositStats: {
    data: DepositStats | null;
    loading: boolean;
    error: string | null;
  };
  withdrawalStats: {
    data: WithdrawalStats | null;
    loading: boolean;
    error: string | null;
  };
  kycStats: {
    data: KYCStats | null;
    loading: boolean;
    error: string | null;
  };
  activityStats: {
    data: ActivityStats | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminStatsState = {
  dashboard: {
    data: null,
    loading: false,
    error: null,
  },
  userStats: {
    data: null,
    loading: false,
    error: null,
  },
  depositStats: {
    data: null,
    loading: false,
    error: null,
  },
  withdrawalStats: {
    data: null,
    loading: false,
    error: null,
  },
  kycStats: {
    data: null,
    loading: false,
    error: null,
  },
  activityStats: {
    data: null,
    loading: false,
    error: null,
  },
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'adminStats/fetchDashboardStats',
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch('/api/admin/stats/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }
);

export const fetchUserStats = createAsyncThunk(
  'adminStats/fetchUserStats',
  async (userId: string, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/users/${userId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return response.json();
  }
);

export const fetchDepositStats = createAsyncThunk(
  'adminStats/fetchDepositStats',
  async (days: number = 30, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/deposits/stats?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deposit stats');
    }

    return response.json();
  }
);

export const fetchWithdrawalStats = createAsyncThunk(
  'adminStats/fetchWithdrawalStats',
  async (days: number = 30, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/withdrawals/stats?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch withdrawal stats');
    }

    return response.json();
  }
);

export const fetchKycStats = createAsyncThunk(
  'adminStats/fetchKycStats',
  async (days: number = 30, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/kyc/stats?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch KYC stats');
    }

    return response.json();
  }
);

export const fetchActivityStats = createAsyncThunk(
  'adminStats/fetchActivityStats',
  async (days: number = 30, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/activity-logs/stats?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity stats');
    }

    return response.json();
  }
);

// Slice
const adminStatsSlice = createSlice({
  name: 'adminStats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.dashboard.error = null;
      state.userStats.error = null;
      state.depositStats.error = null;
      state.withdrawalStats.error = null;
      state.kycStats.error = null;
      state.activityStats.error = null;
    },
    clearDashboardStats: (state) => {
      state.dashboard.data = null;
    },
    clearUserStats: (state) => {
      state.userStats.data = null;
    },
    clearDepositStats: (state) => {
      state.depositStats.data = null;
    },
    clearWithdrawalStats: (state) => {
      state.withdrawalStats.data = null;
    },
    clearKycStats: (state) => {
      state.kycStats.data = null;
    },
    clearActivityStats: (state) => {
      state.activityStats.data = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.error.message || 'Failed to fetch dashboard stats';
      });

    // Fetch User Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.userStats.loading = true;
        state.userStats.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats.loading = false;
        state.userStats.data = action.payload.data;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.userStats.loading = false;
        state.userStats.error = action.error.message || 'Failed to fetch user stats';
      });

    // Fetch Deposit Stats
    builder
      .addCase(fetchDepositStats.pending, (state) => {
        state.depositStats.loading = true;
        state.depositStats.error = null;
      })
      .addCase(fetchDepositStats.fulfilled, (state, action) => {
        state.depositStats.loading = false;
        state.depositStats.data = action.payload.data;
      })
      .addCase(fetchDepositStats.rejected, (state, action) => {
        state.depositStats.loading = false;
        state.depositStats.error = action.error.message || 'Failed to fetch deposit stats';
      });

    // Fetch Withdrawal Stats
    builder
      .addCase(fetchWithdrawalStats.pending, (state) => {
        state.withdrawalStats.loading = true;
        state.withdrawalStats.error = null;
      })
      .addCase(fetchWithdrawalStats.fulfilled, (state, action) => {
        state.withdrawalStats.loading = false;
        state.withdrawalStats.data = action.payload.data;
      })
      .addCase(fetchWithdrawalStats.rejected, (state, action) => {
        state.withdrawalStats.loading = false;
        state.withdrawalStats.error = action.error.message || 'Failed to fetch withdrawal stats';
      });

    // Fetch KYC Stats
    builder
      .addCase(fetchKycStats.pending, (state) => {
        state.kycStats.loading = true;
        state.kycStats.error = null;
      })
      .addCase(fetchKycStats.fulfilled, (state, action) => {
        state.kycStats.loading = false;
        state.kycStats.data = action.payload.data;
      })
      .addCase(fetchKycStats.rejected, (state, action) => {
        state.kycStats.loading = false;
        state.kycStats.error = action.error.message || 'Failed to fetch KYC stats';
      });

    // Fetch Activity Stats
    builder
      .addCase(fetchActivityStats.pending, (state) => {
        state.activityStats.loading = true;
        state.activityStats.error = null;
      })
      .addCase(fetchActivityStats.fulfilled, (state, action) => {
        state.activityStats.loading = false;
        state.activityStats.data = action.payload.data;
      })
      .addCase(fetchActivityStats.rejected, (state, action) => {
        state.activityStats.loading = false;
        state.activityStats.error = action.error.message || 'Failed to fetch activity stats';
      });
  },
});

export const {
  clearStatsError,
  clearDashboardStats,
  clearUserStats,
  clearDepositStats,
  clearWithdrawalStats,
  clearKycStats,
  clearActivityStats,
} = adminStatsSlice.actions;

export default adminStatsSlice.reducer;

