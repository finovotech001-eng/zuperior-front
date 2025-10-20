// client/src/store/slices/adminSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  kyc?: any;
  mt5Accounts: any[];
  manualDeposits: any[];
  withdrawals: any[];
  _count: {
    mt5Accounts: number;
    manualDeposits: number;
    withdrawals: number;
  };
}

interface Deposit {
  id: string;
  userId: string;
  mt5AccountId: string;
  amount: number;
  depositAddress: string;
  transactionHash?: string;
  proofFileUrl?: string;
  status: string;
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    clientId: string;
  };
}

interface Withdrawal {
  id: string;
  userId: string;
  mt5AccountId: string;
  amount: number;
  method: string;
  bankDetails?: string;
  cryptoAddress?: string;
  status: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    clientId: string;
  };
}

interface KYC {
  id: string;
  userId: string;
  isDocumentVerified: boolean;
  isAddressVerified: boolean;
  verificationStatus: string;
  documentReference?: string;
  addressReference?: string;
  amlReference?: string;
  documentSubmittedAt?: string;
  addressSubmittedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    clientId: string;
    phone?: string;
    country?: string;
    createdAt: string;
  };
}

interface ActivityLog {
  id: string;
  userId?: string;
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: string;
  newValues?: string;
  createdAt: string;
  admin: {
    id: string;
    name?: string;
    email: string;
  };
}

interface AdminState {
  users: {
    list: User[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  deposits: {
    list: Deposit[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  withdrawals: {
    list: Withdrawal[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  kyc: {
    list: KYC[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  activityLogs: {
    list: ActivityLog[];
    total: number;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  users: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  deposits: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  withdrawals: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  kyc: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  activityLogs: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    kycStatus?: string;
    emailVerified?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/users?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }
);

export const fetchDeposits = createAsyncThunk(
  'admin/fetchDeposits',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/deposits?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deposits');
    }

    return response.json();
  }
);

export const fetchWithdrawals = createAsyncThunk(
  'admin/fetchWithdrawals',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/withdrawals?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch withdrawals');
    }

    return response.json();
  }
);

export const fetchKycRequests = createAsyncThunk(
  'admin/fetchKycRequests',
  async (params: {
    page?: number;
    limit?: number;
    verificationStatus?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/kyc?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch KYC requests');
    }

    return response.json();
  }
);

export const fetchActivityLogs = createAsyncThunk(
  'admin/fetchActivityLogs',
  async (params: {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
    userId?: string;
    adminId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/activity-logs?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity logs');
    }

    return response.json();
  }
);

export const fetchManualDeposits = createAsyncThunk(
  'admin/fetchManualDeposits',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/admin/deposits?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch manual deposits');
    }

    return response.json();
  }
);

export const approveDeposit = createAsyncThunk(
  'admin/approveDeposit',
  async ({ id, comment }: { id: string; comment?: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/deposits/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve deposit');
    }

    return response.json();
  }
);

export const rejectDeposit = createAsyncThunk(
  'admin/rejectDeposit',
  async ({ id, rejectionReason }: { id: string; rejectionReason: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/deposits/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rejectionReason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject deposit');
    }

    return response.json();
  }
);

export const approveWithdrawal = createAsyncThunk(
  'admin/approveWithdrawal',
  async ({ id, comment }: { id: string; comment?: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/withdrawals/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve withdrawal');
    }

    return response.json();
  }
);

export const rejectWithdrawal = createAsyncThunk(
  'admin/rejectWithdrawal',
  async ({ id, rejectionReason }: { id: string; rejectionReason: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/withdrawals/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rejectionReason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject withdrawal');
    }

    return response.json();
  }
);

export const updateKycStatus = createAsyncThunk(
  'admin/updateKycStatus',
  async ({
    id,
    verificationStatus,
    rejectionReason,
    isDocumentVerified,
    isAddressVerified
  }: {
    id: string;
    verificationStatus?: string;
    rejectionReason?: string;
    isDocumentVerified?: boolean;
    isAddressVerified?: boolean;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/kyc/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        verificationStatus,
        rejectionReason,
        isDocumentVerified,
        isAddressVerified
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update KYC status');
    }

    return response.json();
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({
    id,
    name,
    phone,
    country,
    status,
    role,
    emailVerified
  }: {
    id: string;
    name?: string;
    phone?: string;
    country?: string;
    status?: string;
    role?: string;
    emailVerified?: boolean;
  }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone,
        country,
        status,
        role,
        emailVerified
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }
);

export const banUser = createAsyncThunk(
  'admin/banUser',
  async ({ id, action, reason }: { id: string; action: 'ban' | 'unban'; reason?: string }, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`/api/admin/users/${id}/ban`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to ban user');
    }

    return response.json();
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.users.error = null;
      state.deposits.error = null;
      state.withdrawals.error = null;
      state.kyc.error = null;
      state.activityLogs.error = null;
    },
    clearUsers: (state) => {
      state.users.list = [];
      state.users.total = 0;
    },
    clearDeposits: (state) => {
      state.deposits.list = [];
      state.deposits.total = 0;
    },
    clearWithdrawals: (state) => {
      state.withdrawals.list = [];
      state.withdrawals.total = 0;
    },
    clearKyc: (state) => {
      state.kyc.list = [];
      state.kyc.total = 0;
    },
    clearActivityLogs: (state) => {
      state.activityLogs.list = [];
      state.activityLogs.total = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload.data.users;
        state.users.total = action.payload.data.pagination.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message || 'Failed to fetch users';
      });

    // Fetch Deposits
    builder
      .addCase(fetchDeposits.pending, (state) => {
        state.deposits.loading = true;
        state.deposits.error = null;
      })
      .addCase(fetchDeposits.fulfilled, (state, action) => {
        state.deposits.loading = false;
        state.deposits.list = action.payload.data.deposits;
        state.deposits.total = action.payload.data.pagination.total;
      })
      .addCase(fetchDeposits.rejected, (state, action) => {
        state.deposits.loading = false;
        state.deposits.error = action.error.message || 'Failed to fetch deposits';
      });

    // Fetch Withdrawals
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.withdrawals.loading = true;
        state.withdrawals.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.withdrawals.loading = false;
        state.withdrawals.list = action.payload.data.withdrawals;
        state.withdrawals.total = action.payload.data.pagination.total;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.withdrawals.loading = false;
        state.withdrawals.error = action.error.message || 'Failed to fetch withdrawals';
      });

    // Fetch KYC Requests
    builder
      .addCase(fetchKycRequests.pending, (state) => {
        state.kyc.loading = true;
        state.kyc.error = null;
      })
      .addCase(fetchKycRequests.fulfilled, (state, action) => {
        state.kyc.loading = false;
        state.kyc.list = action.payload.data.kycRequests;
        state.kyc.total = action.payload.data.pagination.total;
      })
      .addCase(fetchKycRequests.rejected, (state, action) => {
        state.kyc.loading = false;
        state.kyc.error = action.error.message || 'Failed to fetch KYC requests';
      });

    // Fetch Activity Logs
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.activityLogs.loading = true;
        state.activityLogs.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs.loading = false;
        state.activityLogs.list = action.payload.data.logs;
        state.activityLogs.total = action.payload.data.pagination.total;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityLogs.loading = false;
        state.activityLogs.error = action.error.message || 'Failed to fetch activity logs';
      });

    // Fetch Manual Deposits
    builder
      .addCase(fetchManualDeposits.pending, (state) => {
        state.deposits.loading = true;
        state.deposits.error = null;
      })
      .addCase(fetchManualDeposits.fulfilled, (state, action) => {
        state.deposits.loading = false;
        state.deposits.list = action.payload.data.deposits;
        state.deposits.total = action.payload.data.pagination.total;
      })
      .addCase(fetchManualDeposits.rejected, (state, action) => {
        state.deposits.loading = false;
        state.deposits.error = action.error.message || 'Failed to fetch manual deposits';
      });

    // Approve Deposit
    builder
      .addCase(approveDeposit.fulfilled, (state, action) => {
        const depositId = action.payload.data.id;
        const depositIndex = state.deposits.list.findIndex(deposit => deposit.id === depositId);
        if (depositIndex !== -1) {
          state.deposits.list[depositIndex] = action.payload.data;
        }
      });

    // Reject Deposit
    builder
      .addCase(rejectDeposit.fulfilled, (state, action) => {
        const depositId = action.payload.data.id;
        const depositIndex = state.deposits.list.findIndex(deposit => deposit.id === depositId);
        if (depositIndex !== -1) {
          state.deposits.list[depositIndex] = action.payload.data;
        }
      });

    // Approve Withdrawal
    builder
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        const withdrawalId = action.payload.data.id;
        const withdrawalIndex = state.withdrawals.list.findIndex(withdrawal => withdrawal.id === withdrawalId);
        if (withdrawalIndex !== -1) {
          state.withdrawals.list[withdrawalIndex] = action.payload.data;
        }
      });

    // Reject Withdrawal
    builder
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        const withdrawalId = action.payload.data.id;
        const withdrawalIndex = state.withdrawals.list.findIndex(withdrawal => withdrawal.id === withdrawalId);
        if (withdrawalIndex !== -1) {
          state.withdrawals.list[withdrawalIndex] = action.payload.data;
        }
      });

    // Update KYC Status
    builder
      .addCase(updateKycStatus.fulfilled, (state, action) => {
        const kycId = action.payload.data.id;
        const kycIndex = state.kyc.list.findIndex(kyc => kyc.id === kycId);
        if (kycIndex !== -1) {
          state.kyc.list[kycIndex] = action.payload.data;
        }
      });

    // Update User
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const userId = action.payload.data.id;
        const userIndex = state.users.list.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users.list[userIndex] = action.payload.data;
        }
      });

    // Ban User
    builder
      .addCase(banUser.fulfilled, (state, action) => {
        const userId = action.payload.data.id;
        const userIndex = state.users.list.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users.list[userIndex] = action.payload.data;
        }
      });
  },
});

export const {
  clearError,
  clearUsers,
  clearDeposits,
  clearWithdrawals,
  clearKyc,
  clearActivityLogs,
} = adminSlice.actions;

export default adminSlice.reducer;
