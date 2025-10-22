import axios from 'axios';

// Use empty base URL for proxy routes (Next API routes)
const API_URL = '';

/** In-flight de-duplication (single-flight) */
type InFlight = Record<string, { promise: Promise<any>; controller: AbortController }>;
const inFlight: InFlight = {};

function singleFlight<T>(key: string, exec: (signal: AbortSignal) => Promise<T>, externalSignal?: AbortSignal): Promise<T> {
  // Return existing if found
  if (inFlight[key]) return inFlight[key].promise as Promise<T>;

  const controller = new AbortController();

  // If caller passes a signal, tie both so either can cancel
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const promise = exec(controller.signal).finally(() => {
    delete inFlight[key];
  });

  inFlight[key] = { promise, controller };
  return promise;
}

function cancelAll() {
  Object.values(inFlight).forEach(({ controller }) => controller.abort());
}

/** Shared Axios instance */
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Authentication Service Functions ---
const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/api/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/api/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      country: userData.country,
    });
    return response.data;
  },

  setAuthData: (token: string, clientId: string) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('clientId', clientId);
    console.log('Auth data stored:', { token: token.substring(0, 20) + '...', clientId });
  },

  clearAuthData: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('clientId');
    localStorage.removeItem('user');
    console.log('Auth data cleared');
  },

  isAuthenticated: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    const clientId = typeof window !== 'undefined' ? localStorage.getItem('clientId') : null;
    return !!(token && clientId);
  },

  getAuthData: () => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('userToken') : null,
    clientId: typeof window !== 'undefined' ? localStorage.getItem('clientId') : null,
  }),

  logout: () => {
    authService.clearAuthData();
    if (typeof window !== 'undefined') window.location.href = '/login';
  },
};

// --- Helpers ---
const normalizeOk = (data: any) => {
  // Normalize responses from different backends
  if (data && typeof data === 'object') {
    if ('Data' in data && !('data' in data)) return { success: true, data: data.Data };
    if ('Success' in data) return { success: !!data.Success, data: data.Data ?? null, message: data.Message };
    if ('success' in data) return { success: !!data.success, data: data.data ?? null, message: data.message };
  }
  return { success: true, data };
};

const safe = <T,>(p: Promise<T>): Promise<T | null> => p.then(v => v).catch(() => null);

// --- MT5 Service Functions ---
const mt5Service = {
  /** Get available MT5 groups */
  getMt5Groups: async (opts?: { signal?: AbortSignal }) => {
    return singleFlight('mt5-groups', (signal) =>
      api.get('/api/proxy/groups', { signal: opts?.signal ?? signal }).then(r => r.data),
      opts?.signal
    );
  },

  /** Create new MT5 account (explicit user action: no singleFlight) */
  createMt5Account: async (
    accountData: {
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
    opts?: { signal?: AbortSignal }
  ) => {
    console.log("🚀 API Service - Creating MT5 account with data:", accountData);
    const directApi = axios.create({
      baseURL: '',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      timeout: 30000,
      signal: opts?.signal,
    });

    const payload = {
      request: "create_mt5_account",
      name: accountData.name,
      group: accountData.group,
      leverage: accountData.leverage || 100,
      masterPassword: accountData.masterPassword,
      investorPassword: accountData.investorPassword,
      email: accountData.email || "",
      country: accountData.country || "",
      city: accountData.city || "",
      phone: accountData.phone || "",
      comment: accountData.comment || "Created from CRM"
    };

    const response = await directApi.post('/api/proxy/users', payload);
    return response; // you log/use full response in the slice
  },

  /** Deposit */
  depositToMt5: async (data: { login: number; balance: number; comment?: string }, opts?: { signal?: AbortSignal }) => {
    const response = await api.post(
      `/api/proxy/users/${data.login}/balance-adjustment`,
      { type: 'BALANCE', amount: data.balance, comment: data.comment || 'Deposit' },
      { signal: opts?.signal }
    );
    return response.data;
  },

  /** Withdraw */
  withdrawFromMt5: async (data: { login: number; balance: number; comment?: string }, opts?: { signal?: AbortSignal }) => {
    const response = await api.post(
      `/api/proxy/users/${data.login}/balance-adjustment`,
      { type: 'BALANCE', amount: -data.balance, comment: data.comment || 'Withdrawal' },
      { signal: opts?.signal }
    );
    return response.data;
  },

  /** Get MT5 account IDs from database for current user */
  getUserMt5AccountsFromDb: async (opts?: { signal?: AbortSignal }) => {
    return singleFlight('mt5-accounts-db', (signal) =>
      api.get('/api/mt5/user-accounts-db', { signal: opts?.signal ?? signal }).then(r => r.data),
      opts?.signal
    );
  },

  /** Get MT5 account profile for a specific login (via Next route) */
  getMt5AccountProfile: async (login: string | number, opts?: { signal?: AbortSignal }) => {
    const key = `mt5-profile:${login}`;
    return singleFlight(key, (signal) =>
      api.get(`/api/mt5/user-profile/${login}`, { signal: opts?.signal ?? signal }).then(r => {
        const norm = normalizeOk(r.data);
        return norm; // { success, data }
      }),
      opts?.signal
    );
  },

  /** Get all MT5 accounts for current user (new flow) */
  getUserMt5Accounts: async (opts?: { signal?: AbortSignal }) => {
    try {
      const db = await mt5Service.getUserMt5AccountsFromDb({ signal: opts?.signal });
      const ok = normalizeOk(db);
      if (!ok.success) return { Success: false, Data: [] };

      const accountIds: string[] = ok.data?.accounts?.map((a: any) => a.accountId).filter(Boolean) ?? [];
      if (!accountIds.length) return { Success: false, Data: [] };

      const profiles = await Promise.all(
        accountIds.map((id) => safe(mt5Service.getMt5AccountProfile(id, { signal: opts?.signal })))
      );

      const valid = profiles
        ?.filter(Boolean)
        ?.map((p: any) => (p && p.success ? p.data : null))
        ?.filter(Boolean) ?? [];

      return { Success: true, Data: valid };
    } catch (error: any) {
      console.error('❌ Error fetching user MT5 accounts:', error?.message || error);
      return { Success: false, Data: [], error: error?.message };
    }
  },

  /** Legacy MT5 profile (direct proxy) */
  getMt5UserProfile: async (login: number, opts?: { signal?: AbortSignal }) => {
    const response = await api.get(`/api/proxy/users/${login}`, { signal: opts?.signal });
    return response.data;
  },

  cancelAll,
};

// --- Deposit Service Functions ---
const depositService = {
  /** Get transactions by MT5 account ID */
  getTransactionsByAccountId: async (accountId: string, opts?: { signal?: AbortSignal }) => {
    return singleFlight(`transactions-${accountId}`, (signal) =>
      api.get(`/api/deposit/transactions/${accountId}`, { signal: opts?.signal ?? signal }).then(r => {
        const norm = normalizeOk(r.data);
        return norm; // { success, data, message }
      }),
      opts?.signal
    );
  },

  /** Get user deposits */
  getUserDeposits: async (opts?: { signal?: AbortSignal }) => {
    return singleFlight('user-deposits', (signal) =>
      api.get('/api/deposit/user', { signal: opts?.signal ?? signal }).then(r => {
        const norm = normalizeOk(r.data);
        return norm;
      }),
      opts?.signal
    );
  },

  cancelAll,
};

// --- Admin Service Functions ---
const adminService = {
  /** Get all users (for admin dropdown) */
  getUsers: async (opts?: { signal?: AbortSignal; search?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (opts?.search) params.append('search', opts.search);
    if (opts?.limit) params.append('limit', opts.limit.toString());
    
    const response = await api.get(`/api/admin/users?${params.toString()}`, { signal: opts?.signal });
    return response.data;
  },

  /** Get MT5 accounts for a specific user (admin) */
  getUserMt5Accounts: async (userId: string, opts?: { signal?: AbortSignal }) => {
    const response = await api.get(`/api/admin/users/${userId}/mt5-accounts`, { signal: opts?.signal });
    return response.data;
  },

  cancelAll,
};

export { authService, api, mt5Service, depositService, adminService };
