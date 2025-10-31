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
  getUserMt5AccountsFromDb: async (opts?: { signal?: AbortSignal }) => {
    return singleFlight('mt5-accounts-db', (signal) =>
      api.get('/api/mt5/user-accounts-db', { signal: opts?.signal ?? signal }).then(r => r.data),
      opts?.signal
    );
  },

  /** Get MT5 account profile for a specific login
   * Prefer the existing proxy route `/api/proxy/users/:login`.
   * Fallback to `/api/mt5/user-profile/:login` if proxy is unavailable.
   */
  getMt5AccountProfile: async (login: string | number, opts?: { signal?: AbortSignal }) => {
    const key = `mt5-profile:${login}`;
    return singleFlight(key, async (signal) => {
      // Try proxy route first
      try {
        const r = await api.get(`/api/proxy/users/${login}`, { signal: opts?.signal ?? signal });
        return normalizeOk(r.data);
      } catch (e) {
        // Fallback to backend-routed path
        try {
          const r2 = await api.get(`/api/mt5/user-profile/${login}`, { signal: opts?.signal ?? signal });
          return normalizeOk(r2.data);
        } catch (e2) {
          throw e2;
        }
      }
    }, opts?.signal);
  },

  /** Get all MT5 accounts for current user (REBUILT - Step by step flow) */
  getUserMt5Accounts: async (opts?: { signal?: AbortSignal }) => {
    try {
      console.log('='.repeat(60));
      console.log('🚀 STEP 1: Fetching accounts from MT5Account table');
      console.log('='.repeat(60));
      
      // Step 1: Get all accounts from database for current user
      const db = await mt5Service.getUserMt5AccountsFromDb({ signal: opts?.signal });
      const ok = normalizeOk(db);
      
      if (!ok.success || !ok.data?.accounts) {
        console.log('❌ No accounts found in database');
        return { Success: false, Data: [] };
      }

      const dbAccounts = ok.data.accounts;
      console.log(`✅ Found ${dbAccounts.length} accounts in database`);
      console.log('📋 Database accounts:', dbAccounts.map((a: any) => ({
        id: a.id,
        accountId: a.accountId,
        accountType: a.accountType
      })));

      if (dbAccounts.length === 0) {
        return { Success: true, Data: [] };
      }

      // Step 2: Extract account IDs and create accountType map
      const accountTypeMap = new Map<string, string>();
      const validAccountIds: string[] = [];

      dbAccounts.forEach((acc: any) => {
        const accountId = String(acc.accountId || '').trim();
        if (accountId && accountId !== '0' && /^\d+$/.test(accountId)) {
          validAccountIds.push(accountId);
          accountTypeMap.set(accountId, acc.accountType || 'Live');
        }
      });

      console.log('='.repeat(60));
      console.log('🚀 STEP 2: Validated account IDs');
      console.log('='.repeat(60));
      console.log(`✅ Valid account IDs: ${validAccountIds.length}`);
      console.log('🔢 Account IDs:', validAccountIds);
      console.log('📝 Account Type Map:', Array.from(accountTypeMap.entries()));

      if (validAccountIds.length === 0) {
        console.log('❌ No valid account IDs found');
        return { Success: false, Data: [] };
      }

      // Step 3: Call ClientProfile API for ALL accounts in parallel
      console.log('='.repeat(60));
      console.log('🚀 STEP 3: Calling ClientProfile API for all accounts');
      console.log('='.repeat(60));
      
      const profileResults = await Promise.allSettled(
        validAccountIds.map(async (accountId, index) => {
          try {
            console.log(`📡 [${index + 1}/${validAccountIds.length}] Fetching profile for account ${accountId}...`);
            const profile = await mt5Service.getMt5AccountProfile(accountId, { signal: opts?.signal });
              
              if (profile && profile.success && profile.data && profile.data.Login) {
              console.log(`✅ [${index + 1}/${validAccountIds.length}] Profile fetched for ${accountId}:`, {
                Login: profile.data.Login,
                Name: profile.data.Name || 'N/A',
                Balance: profile.data.Balance || 0
              });
              return { accountId, profile, success: true };
              } else {
              console.log(`⚠️ [${index + 1}/${validAccountIds.length}] Profile data incomplete for ${accountId}`);
              return { accountId, profile: null, success: false };
            }
          } catch (error: any) {
            console.log(`❌ [${index + 1}/${validAccountIds.length}] Profile fetch failed for ${accountId}:`, error?.message || 'Unknown error');
            return { accountId, profile: null, success: false };
          }
        })
      );

      // Step 4: Merge database data with profile data for ALL accounts
      console.log('='.repeat(60));
      console.log('🚀 STEP 4: Merging database and profile data');
      console.log('='.repeat(60));
      
      // Create a map of accountId -> profile result for easier lookup
      const profileMap = new Map<string, any>();
      profileResults.forEach((result, index) => {
        const accountId = validAccountIds[index];
        if (accountId) {
          profileMap.set(accountId, result);
        }
      });
      
      console.log(`📊 Profile results map size: ${profileMap.size}`);
      console.log(`📊 Valid account IDs count: ${validAccountIds.length}`);
      
      const mergedAccounts = validAccountIds.map((accountId, index) => {
        const result = profileResults[index];
        const accountType = accountTypeMap.get(accountId) || 'Live';
        
        console.log(`\n🔍 Processing account ${index + 1}/${validAccountIds.length}: ${accountId}`);
        console.log(`   Result status: ${result?.status || 'undefined'}`);
        
        // CRITICAL: Always ensure Login is set to the accountId from database
        // Even if profile fetch succeeds but Login is different, use the accountId from DB
        const loginValue = Number(accountId);
        
        // If profile fetch was successful
        if (result?.status === 'fulfilled' && result.value?.success && result.value?.profile?.data) {
          const profileData = result.value.profile.data;
          console.log(`   ✅ Profile data available - Name: ${profileData.Name || 'N/A'}, Profile Login: ${profileData.Login}`);
          console.log(`   ⚠️ Using accountId from DB (${loginValue}) instead of profile Login to ensure consistency`);
          
          const merged = {
            ...profileData,
            Login: loginValue, // ALWAYS use accountId from DB, not profile Login
            accountType: accountType // Always use accountType from database
          };
          console.log(`   ✅ Created merged account with Login: ${merged.Login}, AccountType: ${merged.accountType}`);
          return merged;
        }
        
        // If profile fetch failed, use minimal data from database
        console.log(`   ⚠️ Profile fetch failed or incomplete - using minimal data`);
        const minimal = {
          Login: loginValue, // Use accountId from DB
          accountType: accountType
        };
        console.log(`   ✅ Created minimal account with Login: ${minimal.Login}, AccountType: ${minimal.accountType}`);
        return minimal;
      });

      console.log('='.repeat(60));
      console.log('🚀 STEP 5: Final result verification');
      console.log('='.repeat(60));
      console.log(`✅ Total accounts in merged result: ${mergedAccounts.length}`);
      console.log(`📋 Expected count: ${validAccountIds.length}`);
      
      // Extract Login from all merged accounts - normalize to strings for comparison
      const accountIdsInResult = mergedAccounts
        .map((a: any, idx: number) => {
          const login = a?.Login;
          const normalized = login !== undefined && login !== null ? String(login).trim() : null;
          
          // Debug logging for each account
          if (!normalized) {
            console.error(`❌ Account at index ${idx} has no Login!`, a);
          } else {
            console.log(`   Account ${idx + 1}: Login=${normalized}, AccountType=${a?.accountType || 'N/A'}`);
          }
          
          return normalized;
        })
        .filter((id: string | null): id is string => id !== null && id !== 'undefined' && id !== 'null');
      
      console.log(`\n📊 Verification:`);
      console.log(`🔢 Account IDs in result (${accountIdsInResult.length}):`, accountIdsInResult.sort());
      console.log(`🔢 Expected account IDs (${validAccountIds.length}):`, validAccountIds.sort());
      
      // Verify all accounts are included - compare as normalized strings
      const missing = validAccountIds.filter(id => {
        const normalizedId = String(id).trim();
        const found = accountIdsInResult.includes(normalizedId);
        
        if (!found) {
          console.error(`❌ MISSING: Account ${id} not found in result!`);
          console.error(`   Expected: "${normalizedId}"`);
          console.error(`   Available:`, accountIdsInResult);
          
          // Try to find similar IDs (for debugging)
          const similar = accountIdsInResult.filter(r => r.includes(id) || id.includes(r));
          if (similar.length > 0) {
            console.error(`   Similar IDs found:`, similar);
          }
        }
        return !found;
      });
      
      if (missing.length > 0) {
        console.error(`❌ ERROR: Missing ${missing.length} accounts in result!`);
        console.error(`❌ Missing account IDs:`, missing);
        console.error(`❌ This should NEVER happen!`);
      } else {
        console.log('✅ All accounts included in result!');
      }
      
      // Log each account in the final result
      console.log('\n📋 Final merged accounts:');
      mergedAccounts.forEach((acc: any, idx: number) => {
        console.log(`   ${idx + 1}. Login: ${acc.Login}, AccountType: ${acc.accountType}, Name: ${acc.Name || 'N/A'}`);
      });
      
      // FINAL VERIFICATION: Ensure we have exactly as many accounts as we started with
      if (mergedAccounts.length !== validAccountIds.length) {
        console.error(`\n🚨 CRITICAL ERROR: mergedAccounts.length (${mergedAccounts.length}) !== validAccountIds.length (${validAccountIds.length})`);
        console.error(`   This should NEVER happen as we map over validAccountIds!`);
        
        // Force include all accounts even if something went wrong
        validAccountIds.forEach((accountId, idx) => {
          const found = mergedAccounts.find((acc: any) => String(acc.Login) === String(accountId));
          if (!found) {
            console.error(`   🚨 Account ${accountId} is MISSING from mergedAccounts! Adding it now...`);
            const accountType = accountTypeMap.get(accountId) || 'Live';
            mergedAccounts.push({
              Login: Number(accountId),
              accountType: accountType
            });
          }
        });
        
        console.log(`   ✅ After recovery, mergedAccounts.length: ${mergedAccounts.length}`);
      }

      // Final count verification
      const finalCount = mergedAccounts.length;
      const expectedCount = validAccountIds.length;
      console.log(`\n✅ FINAL: Returning ${finalCount} accounts (expected ${expectedCount})`);
      
      if (finalCount !== expectedCount) {
        console.error(`❌ FINAL ERROR: Count mismatch! Expected ${expectedCount}, got ${finalCount}`);
      } else {
        console.log(`✅ FINAL: Count matches! All accounts included.`);
      }

      return { Success: true, Data: mergedAccounts };
      
    } catch (error: any) {
      console.error('='.repeat(60));
      console.error('❌ ERROR in getUserMt5Accounts:', error);
      console.error('='.repeat(60));
      
      if (error?.response?.status === 401 || error?.message?.includes('401')) {
        console.log('ℹ️ Authentication required');
        return { Success: false, Data: [] };
      }
      
      return { Success: false, Data: [], error: error?.message || 'Unknown error' };
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
