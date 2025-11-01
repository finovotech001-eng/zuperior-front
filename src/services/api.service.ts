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

// Track if token refresh is in progress to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Function to validate/refresh session
const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // Wait for ongoing refresh
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    
    if (!currentToken) {
      throw new Error('No token available');
    }

    // Try to validate session with backend
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';
      const checkResponse = await axios.get(`${BACKEND_URL}/auth/session/check-valid`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
        timeout: 10000,
      });

      // If session is valid, return current token
      if (checkResponse.status === 200) {
        processQueue(null, currentToken);
        return currentToken;
      }
    } catch (sessionError: any) {
      // If session check fails (401/403), token is invalid - redirect to login
      if (sessionError.response?.status === 401 || sessionError.response?.status === 403) {
        console.warn('Session invalid, redirecting to login');
        authService.clearAuthData();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }
    }
    
    // If we get here, session might still be valid, return current token
    processQueue(null, currentToken);
    return currentToken;
  } catch (error) {
    processQueue(error, null);
    authService.clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        // Retry original request with new token
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle timeout errors - retry with exponential backoff
    if ((error.code === 'ECONNABORTED' || error.message?.includes('timeout')) && 
        originalRequest && 
        !originalRequest._retry && 
        !originalRequest._retryCount) {
      
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const maxRetries = 2;
      
      if (originalRequest._retryCount <= maxRetries) {
        // Exponential backoff: 1s, 2s
        const delay = originalRequest._retryCount * 1000;
        
        // Try refreshing token before retry
        try {
          await refreshToken();
        } catch (refreshError) {
          // If refresh fails, continue with retry anyway
          console.warn('Token refresh failed, retrying with existing token');
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            // Update token in request
            const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          }, delay);
        });
      }
    }

    return Promise.reject(error);
  }
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
      phone: userData.phone,
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

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/password/forget', {
      email: email,
      accessToken: typeof window !== 'undefined' ? localStorage.getItem('userToken') : '',
    });
    return response.data;
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
  getUserAccountsFromDb: async (opts?: { signal?: AbortSignal }) => {
    return singleFlight('mt5-accounts-db', (signal) =>
      api.get('/api/mt5/user-accounts-db', { signal: opts?.signal ?? signal }).then(r => r.data),
      opts?.signal
    );
  },
  
  /** Legacy alias for backward compatibility */
  getUserMt5AccountsFromDb: async (opts?: { signal?: AbortSignal }) => {
    return mt5Service.getUserAccountsFromDb(opts);
  },

  /** Get MT5 account profile for a specific login
   * Route: /api/mt5/user-profile/:login (backend route)
   */
  getMt5AccountProfile: async (login: string | number, opts?: { signal?: AbortSignal }) => {
    const key = `mt5-profile:${login}`;
    return singleFlight(key, async (signal) => {
      const r = await api.get(`/api/mt5/user-profile/${login}`, { signal: opts?.signal ?? signal });
      return normalizeOk(r.data);
    }, opts?.signal);
  },

  /** Get full account profile from ClientProfile API 
   * Route: /api/mt5/user-profile/:accountId
   * This is the route used for fetching client details (every 400ms for balance/profit)
   */
  getAccountProfile: async (accountId: string | number, password: string, opts?: { signal?: AbortSignal }) => {
    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Call MT5 user profile endpoint through backend
        // The backend controller handles authentication with Bearer token if needed
        // Increased timeout to 60 seconds to handle slow MT5 API responses
        const response = await api.get(`/api/mt5/user-profile/${accountId}`, {
          signal: opts?.signal,
          timeout: 60000, // 60 seconds timeout
          _retryCount: attempt, // Track retry count
        });
        
        return normalizeOk(response.data);
      } catch (error: any) {
        lastError = error;
        
        // If it's a timeout and we haven't exceeded max retries
        if ((error.code === 'ECONNABORTED' || error.message?.includes('timeout')) && attempt < maxRetries) {
          console.log(`⏱️ Timeout error for account ${accountId}, retrying (attempt ${attempt + 1}/${maxRetries})`);
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
          continue; // Retry
        }

        // If it's a 401 or other auth error, try refreshing token once
        if (error.response?.status === 401 && attempt === 0) {
          try {
            await refreshToken();
            console.log(`🔄 Retrying account profile fetch for ${accountId} after token refresh`);
            continue; // Retry once after refresh
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw refreshError;
          }
        }

        // If aborted or other non-retryable error, throw immediately
        if (opts?.signal?.aborted || attempt >= maxRetries) {
          throw error;
        }
      }
    }

    // If we get here, all retries failed
    console.error(`Error fetching account profile for ${accountId} after ${maxRetries} retries:`, lastError);
    throw lastError;
  },

  /** Get only Balance and Profit for efficient polling (every 400ms) */
  getAccountBalanceAndProfit: async (accountId: string | number, password: string, opts?: { signal?: AbortSignal }) => {
    try {
      const profile = await mt5Service.getAccountProfile(accountId, password, opts);
      
      if (profile.success && profile.data) {
        return {
          success: true,
          data: {
            Balance: profile.data.Balance || profile.data.balance || 0,
            Profit: profile.data.Profit || profile.data.profit || 0
          }
        };
      }
      
      return { success: false, data: { Balance: 0, Profit: 0 } };
    } catch (error: any) {
      // Handle timeout errors gracefully - don't spam console
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        // Silently return zero values on timeout to continue polling
        return { success: false, data: { Balance: 0, Profit: 0 } };
      }
      console.error(`Error fetching balance and profit for ${accountId}:`, error);
      return { success: false, data: { Balance: 0, Profit: 0 } };
    }
  },

  /** Legacy method - kept for backward compatibility */
  getUserMt5Accounts: async (opts?: { signal?: AbortSignal }) => {
    // This method is deprecated - use getUserAccountsFromDb instead
    return mt5Service.getUserAccountsFromDb(opts);
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

// --- User Service Functions ---
const userService = {
  /** Get user login activity */
  getUserLoginActivity: async (page?: number, limit?: number, opts?: { signal?: AbortSignal }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `/api/user/login-activity${queryString ? `?${queryString}` : ''}`;
    
    return singleFlight('user-login-activity', (signal) =>
      api.get(url, { signal: opts?.signal ?? signal }).then(r => normalizeOk(r.data)),
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

export { authService, api, mt5Service, depositService, adminService, userService };
