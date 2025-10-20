<!-- b1f408e9-222a-45b7-add2-4f6b2b357ff3 64f94d0f-445c-4732-bd67-b12f63aee6fb -->
# MT5 Manager API Integration Plan

## Overview

**Goal**: Integrate MT5 Manager API for 4 core features with zero errors

**API Base URL**: `http://18.130.5.209:5003`

**Database**: PostgreSQL (replacing MongoDB)

**Strategy**: Implement one API at a time per component, test thoroughly before moving to next

---

## 1. Supported MT5 Groups

**Only use these 2 groups**:

1. `real\\Bbook\\Pro\\dynamic-2000x-10P` (Pro Account)
2. `real\\Bbook\\Standard\\dynamic-2000x-20Pips` (Standard Account)

---

## 2. MT5 API Endpoints Summary

### 2.1 Get Groups
- **Method**: GET
- **Endpoint**: `/api/Groups`
- **Purpose**: Fetch available trading groups
- **Response**: Array of group configurations

### 2.2 Open MT5 Account

- **Method**: POST
- **Endpoint**: `/api/Users` (implied from response)
- **Purpose**: Create new MT5 trading account
- **Returns**: Login number, account details

### 2.3 Deposit (Add Balance)

- **Method**: POST
- **Endpoint**: `/api/Users/{login}/AddClientBalance`
- **Purpose**: Add funds to MT5 account
- **Returns**: Updated balance information

### 2.4 Withdraw (Deduct Balance)

- **Method**: POST
- **Endpoint**: `/api/Users/{login}/DeductClientBalance`
- **Purpose**: Remove funds from MT5 account
- **Returns**: Updated balance information

### 2.5 Get User Profile

- **Method**: GET
- **Endpoint**: `/api/Users/{login}/getClientProfile`
- **Purpose**: Fetch complete account info (balance, equity, leverage, etc.)
- **Returns**: Full user profile with all trading metrics

---

## 3. Implementation Roadmap

### Phase 1: API Service Layer (Backend)

Create Next.js API routes that proxy to MT5 Manager API

### Phase 2: PostgreSQL Schema

Design tables to store MT5 account data

### Phase 3: Component Integration

Connect frontend components to new API routes one by one

---

## 4. Detailed API Implementation

### 4.1 Get Groups API

**File**: `src/app/api/mt5/groups/route.ts`

**Request**:

```typescript
GET /api/mt5/groups
```

**MT5 Manager API Call**:

```
GET http://18.130.5.209:5003/api/Groups
```

**Response Structure**:

```typescript
{
  Group: "real\\Bbook\\Pro\\dynamic-2000x-10P",
  Server: 1,
  Company: "Zuperior FX Limited",
  Currency: "USD",
  CurrencyDigits: 2,
  MarginCall: 100,
  MarginStopOut: 0,
  DemoLeverage: 100,
  // ... other group settings
}
```

**Filter Logic**: Return only the 2 allowed groups

- `real\\Bbook\\Pro\\dynamic-2000x-10P`
- `real\\Bbook\\Standard\\dynamic-2000x-20Pips`

**Error Handling**:

- Check if MT5 API is reachable
- Validate response structure
- Return user-friendly error messages

---

### 4.2 Open MT5 Account API

**File**: `src/app/api/mt5/create-account/route.ts`

**Request Body**:

```typescript
{
  name: string,              // User's full name
  group: string,             // One of the 2 allowed groups
  leverage: number,          // Default: 100
  masterPassword: string,    // Trading password
  investorPassword: string,  // Read-only password
  password: string,          // (Legacy field)
  email: string,
  country: string,
  city: string,
  phone: string,
  comment: string
}
```

**MT5 Manager API Call**:

```
POST http://18.130.5.209:5003/api/Users
Content-Type: application/json
```

**Response Structure**:

```typescript
{
  Success: true,
  Message: "User account created successfully with login 19876893",
  Data: {
    Login: 19876893,          // MT5 Account Number (CRITICAL)
    Name: "rk test",
    Group: "real\\Bbook\\Standard\\dynamic-2000x-20Pips",
    Email: "",
    Country: "string",
    Phone: "string",
    Leverage: 100,
    Balance: 0,
    Credit: 0,
    Equity: 0,
    Margin: 0,
    MarginFree: 0,
    MarginLevel: 0,
    Profit: 0,
    // ... more fields
    IsEnabled: true
  },
  Error: null
}
```

**Implementation Steps**:

1. Validate group is one of 2 allowed groups
2. Hash/encrypt passwords before sending (if needed)
3. Call MT5 API
4. If Success:

   - Store account data in PostgreSQL `mt5_accounts` table
   - Link to CRM user via `crm_account_id`
   - Return Login number to frontend

5. If Error:

   - Parse error from MT5 API
   - Return user-friendly error

**PostgreSQL Storage**:

```sql
INSERT INTO mt5_accounts (
  crm_account_id,
  mt5_login,
  name,
  group_name,
  leverage,
  email,
  country,
  phone,
  balance,
  equity,
  created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
```

---

### 4.3 Deposit API

**File**: `src/app/api/mt5/deposit/route.ts`

**Request Body**:

```typescript
{
  login: number,      // MT5 account number
  balance: number,    // Amount to deposit
  comment: string     // Transaction note
}
```

**MT5 Manager API Call**:

```
POST http://18.130.5.209:5003/api/Users/{login}/AddClientBalance
Content-Type: application/json

{
  "balance": 100,
  "comment": "Deposit via Cregis - TxID: abc123"
}
```

**Response Structure**:

```typescript
{
  Success: true,
  Message: "Account balance updated successfully",
  Data: {
    Login: 19876893,
    CurrencyDigits: 2,
    Balance: 100,         // Updated balance
    Credit: 0,
    Margin: 0,
    MarginFree: 100,
    MarginLevel: 0,
    MarginLeverage: 100,
    Profit: 0,
    Equity: 100,
    // ... more fields
  },
  Error: null
}
```

**Implementation Steps**:

1. Validate login exists in database
2. Validate balance > 0
3. Call MT5 API to add balance
4. If Success:

   - Update balance in PostgreSQL `mt5_accounts` table
   - Create transaction record in `transactions` table
   - Return updated balance

5. If Error:

   - Log error
   - Do NOT update database
   - Return error to user

**PostgreSQL Storage**:

```sql
-- Update account balance
UPDATE mt5_accounts 
SET balance = ?, equity = ?, updated_at = NOW()
WHERE mt5_login = ?;

-- Record transaction
INSERT INTO transactions (
  mt5_login,
  type,
  amount,
  comment,
  status,
  created_at
) VALUES (?, 'deposit', ?, ?, 'completed', NOW());
```

---

### 4.4 Withdraw API

**File**: `src/app/api/mt5/withdraw/route.ts`

**Request Body**:

```typescript
{
  login: number,      // MT5 account number
  balance: number,    // Amount to withdraw
  comment: string     // Transaction note
}
```

**MT5 Manager API Call**:

```
POST http://18.130.5.209:5003/api/Users/{login}/DeductClientBalance
Content-Type: application/json

{
  "balance": 70,
  "comment": "Withdrawal to USDT wallet - abc123"
}
```

**Response Structure**:

```typescript
{
  Success: true,
  Message: "Account balance deducted successfully",
  Data: {
    Login: 19876893,
    Balance: 30,          // Updated balance (was 100, now 30)
    Credit: 0,
    Equity: 30,
    MarginFree: 30,
    // ... more fields
  },
  Error: null
}
```

**Implementation Steps**:

1. Validate login exists
2. Validate withdrawal amount <= current balance
3. Call MT5 API to deduct balance
4. If Success:

   - Update balance in PostgreSQL
   - Create withdrawal transaction record
   - Return updated balance

5. If Error:

   - Log error
   - Return error (e.g., "Insufficient balance")

**PostgreSQL Storage**:

```sql
-- Update account balance
UPDATE mt5_accounts 
SET balance = ?, equity = ?, updated_at = NOW()
WHERE mt5_login = ?;

-- Record transaction
INSERT INTO transactions (
  mt5_login,
  type,
  amount,
  comment,
  status,
  created_at
) VALUES (?, 'withdrawal', ?, ?, 'completed', NOW());
```

---

### 4.5 Get User Profile API

**File**: `src/app/api/mt5/user-profile/[login]/route.ts`

**Request**:

```typescript
GET /api/mt5/user-profile/19876893
```

**MT5 Manager API Call**:

```
GET http://18.130.5.209:5003/api/Users/{login}/getClientProfile
```

**Response Structure**:

```typescript
{
  Success: true,
  Message: "User profile retrieved successfully",
  Data: {
    Login: 19876893,
    Name: "rk test",
    Group: "real\\Bbook\\Standard\\dynamic-2000x-20Pips",
    Email: "",
    Country: "string",
    Phone: "string",
    Leverage: 100,
    Balance: 99,         // Current balance
    Credit: 0,
    Equity: 99,          // Balance + Profit
    Margin: 0,           // Used margin
    MarginFree: 99,      // Free margin
    MarginLevel: 0,      // Margin level %
    Profit: 0,           // Open P&L
    IsEnabled: true
  },
  Error: null
}
```

**Implementation Steps**:

1. Validate login exists
2. Call MT5 API to fetch profile
3. If Success:

   - Update balance/equity in PostgreSQL (sync)
   - Return full profile data

4. If Error:

   - Return cached data from database (if available)

**Usage**:

- Called on dashboard load
- Called after deposit/withdrawal
- Called every 2 minutes for auto-refresh

---

## 5. PostgreSQL Database Schema

### 5.1 Table: `mt5_accounts`

```sql
CREATE TABLE mt5_accounts (
  id SERIAL PRIMARY KEY,
  crm_account_id INTEGER NOT NULL,
  mt5_login BIGINT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  leverage INTEGER DEFAULT 100,
  email VARCHAR(255),
  country VARCHAR(100),
  phone VARCHAR(50),
  balance DECIMAL(18, 2) DEFAULT 0,
  credit DECIMAL(18, 2) DEFAULT 0,
  equity DECIMAL(18, 2) DEFAULT 0,
  margin DECIMAL(18, 2) DEFAULT 0,
  margin_free DECIMAL(18, 2) DEFAULT 0,
  margin_level DECIMAL(10, 2) DEFAULT 0,
  profit DECIMAL(18, 2) DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (crm_account_id) REFERENCES users(id)
);

CREATE INDEX idx_mt5_login ON mt5_accounts(mt5_login);
CREATE INDEX idx_crm_account ON mt5_accounts(crm_account_id);
```

### 5.2 Table: `transactions`

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  mt5_login BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'transfer'
  amount DECIMAL(18, 2) NOT NULL,
  comment TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_method VARCHAR(100), -- 'crypto', 'card', 'bank'
  transaction_id VARCHAR(255), -- External payment gateway ID
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (mt5_login) REFERENCES mt5_accounts(mt5_login)
);

CREATE INDEX idx_mt5_login_trans ON transactions(mt5_login);
CREATE INDEX idx_created_at ON transactions(created_at);
```

### 5.3 Table: `users` (existing CRM users)

```sql
-- Assume this exists already
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Frontend Component Updates

### 6.1 New Account Creation

**Component**: `src/components/dashboard/new-account/StepChooseAccountType.tsx`

**Current Flow**:

1. User selects account type (Standard/Pro)
2. Redirects to Skale API

**New Flow**:

1. User selects account type
2. Map to MT5 group:

   - Standard → `real\\Bbook\\Standard\\dynamic-2000x-20Pips`
   - Pro → `real\\Bbook\\Pro\\dynamic-2000x-10P`

3. Call `/api/mt5/create-account` with:

   - name (from Redux)
   - group (selected)
   - leverage (default 100)
   - email, phone, country (from Redux)
   - Generate passwords (or let user set)

4. On success:

   - Store `mt5_login` in Redux
   - Show success screen with login number
   - Refresh account list

**API Call**:

```typescript
const response = await axios.post('/api/mt5/create-account', {
  name: user.name,
  group: groupName,
  leverage: 100,
  masterPassword: generatedPassword,
  investorPassword: generatedInvestorPassword,
  email: user.email,
  country: user.country,
  city: user.city,
  phone: user.phone,
  comment: 'Created from CRM'
});

if (response.data.Success) {
  const mt5Login = response.data.Data.Login;
  // Store in Redux
  // Show success
}
```

---

### 6.2 Deposit Flow

**Component**: `src/components/deposit/Step3Payment.tsx`

**Current Flow**:

1. User generates crypto address
2. Sends crypto
3. Webhook confirms payment
4. Calls Skale API to add balance

**New Flow**:

1. User generates crypto address (Cregis API)
2. Sends crypto
3. Webhook confirms payment
4. **Call `/api/mt5/deposit`** with:

   - login (MT5 account number)
   - balance (deposit amount)
   - comment (transaction ID from Cregis)

5. On success:

   - Update balance in Redux
   - Show success message

**API Call**:

```typescript
const response = await axios.post('/api/mt5/deposit', {
  login: selectedAccount.mt5_login,
  balance: depositAmount,
  comment: `Deposit via ${cryptoName} - TxID: ${txId}`
});

if (response.data.Success) {
  // Update Redux balance
  dispatch(updateAccountBalance({
    login: selectedAccount.mt5_login,
    balance: response.data.Data.Balance,
    equity: response.data.Data.Equity
  }));
}
```

---

### 6.3 Withdrawal Flow

**Component**: `src/components/withdraw/Step3PayoutProps.tsx`

**Current Flow**:

1. User enters wallet address + amount
2. Calls Skale API to request withdrawal
3. Pending approval

**New Flow**:

1. User enters wallet address + amount
2. **Validate balance** via `/api/mt5/user-profile/{login}`
3. **Call `/api/mt5/withdraw`** with:

   - login (MT5 account number)
   - balance (withdrawal amount)
   - comment (wallet address + crypto)

4. On success:

   - Create payout request in Cregis/payment gateway
   - Update balance in Redux
   - Show pending status

**API Call**:

```typescript
// First check balance
const profileResponse = await axios.get(`/api/mt5/user-profile/${mt5Login}`);
const currentBalance = profileResponse.data.Data.Balance;

if (currentBalance < withdrawalAmount) {
  toast.error('Insufficient balance');
  return;
}

// Deduct from MT5
const response = await axios.post('/api/mt5/withdraw', {
  login: mt5Login,
  balance: withdrawalAmount,
  comment: `Withdrawal to ${walletAddress} - ${cryptoName}`
});

if (response.data.Success) {
  // Create payout in payment gateway
  // Update Redux
}
```

---

### 6.4 Dashboard Balance Display

**Component**: `src/components/dashboard/dashboard-content.tsx`

**Current Flow**:

- Fetches user data from Skale API
- Stores in Redux
- Displays total balance

**New Flow**:

- Fetch MT5 accounts from PostgreSQL via `/api/mt5/user-accounts`
- For each account, optionally call `/api/mt5/user-profile/{login}` for live data
- Calculate total balance
- Display with auto-refresh every 2 minutes

**API Call**:

```typescript
// Fetch all MT5 accounts for this user
const response = await axios.get('/api/mt5/user-accounts', {
  params: { crmAccountId: user.crm_account_id }
});

const accounts = response.data.accounts;

// Optionally fetch live data for each
for (const account of accounts) {
  const liveData = await axios.get(`/api/mt5/user-profile/${account.mt5_login}`);
  // Update account with live balance
}

// Calculate total
const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
```

---

## 7. API Route File Structure

```
src/app/api/mt5/
├── groups/
│   └── route.ts              (GET - Fetch MT5 groups)
├── create-account/
│   └── route.ts              (POST - Create MT5 account)
├── deposit/
│   └── route.ts              (POST - Add balance)
├── withdraw/
│   └── route.ts              (POST - Deduct balance)
├── user-profile/
│   └── [login]/
│       └── route.ts          (GET - Fetch user profile)
└── user-accounts/
    └── route.ts              (GET - Fetch all accounts for CRM user)
```

---

## 8. Error Handling Strategy

### 8.1 MT5 API Errors

**Common Errors**:

- Connection timeout
- Invalid login number
- Insufficient balance
- Group not found
- Duplicate account

**Handling**:

```typescript
try {
  const response = await axios.post(MT5_API_URL, data);
  
  if (!response.data.Success) {
    throw new Error(response.data.Error || response.data.Message);
  }
  
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Network error
    return { success: false, error: 'MT5 API unreachable' };
  }
  
  // API returned error
  return { success: false, error: error.message };
}
```

---

## 9. Testing Checklist

### 9.1 API Testing (Use Postman/curl)

**Test 1: Get Groups**

```bash
curl http://localhost:3000/api/mt5/groups
```

✅ Should return 2 groups only

**Test 2: Create Account**

```bash
curl -X POST http://localhost:3000/api/mt5/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "group": "real\\Bbook\\Standard\\dynamic-2000x-20Pips",
    "leverage": 100,
    "masterPassword": "Test@123",
    "investorPassword": "Test@000",
    "email": "test@example.com",
    "country": "India",
    "city": "Mumbai",
    "phone": "+911234567890",
    "comment": "Test account"
  }'
```

✅ Should return Login number

✅ Should store in PostgreSQL

**Test 3: Deposit**

```bash
curl -X POST http://localhost:3000/api/mt5/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "login": 19876893,
    "balance": 100,
    "comment": "Test deposit"
  }'
```

✅ Should update balance

✅ Should create transaction record

**Test 4: Withdraw**

```bash
curl -X POST http://localhost:3000/api/mt5/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "login": 19876893,
    "balance": 50,
    "comment": "Test withdrawal"
  }'
```

✅ Should deduct balance

✅ Should fail if insufficient balance

**Test 5: Get Profile**

```bash
curl http://localhost:3000/api/mt5/user-profile/19876893
```

✅ Should return full profile with updated balance

---

## 10. Implementation Order (Zero Errors Strategy)

### Step 1: Setup PostgreSQL

1. Create database
2. Create tables (`mt5_accounts`, `transactions`)
3. Test connections

### Step 2: Implement Groups API

1. Create `/api/mt5/groups/route.ts`
2. Test with Postman
3. Fix any errors before moving forward

### Step 3: Implement Create Account API

1. Create `/api/mt5/create-account/route.ts`
2. Add PostgreSQL insert logic
3. Test end-to-end (API → MT5 → Database)
4. Fix errors

### Step 4: Implement User Profile API

1. Create `/api/mt5/user-profile/[login]/route.ts`
2. Test fetching existing account
3. Add database sync logic

### Step 5: Implement Deposit API

1. Create `/api/mt5/deposit/route.ts`
2. Add balance validation
3. Add transaction logging
4. Test with dummy data

### Step 6: Implement Withdraw API

1. Create `/api/mt5/withdraw/route.ts`
2. Add balance check logic
3. Test insufficient balance scenario
4. Add transaction logging

### Step 7: Update Frontend Components

1. Update `NewAccountDialog` to use new API
2. Test account creation
3. Update `DepositDialog` to use new API
4. Test deposit flow
5. Update `WithdrawDialog` to use new API
6. Test withdrawal flow
7. Update Dashboard to use new APIs
8. Test balance display

### Step 8: Integration Testing

1. End-to-end flow: Create account → Deposit → Withdraw
2. Test error scenarios
3. Test edge cases (zero balance, invalid login, etc.)

---

## 11. Environment Variables

**Add to `.env.local`**:

```
MT5_API_BASE_URL=http://18.130.5.209:5003
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=zuperior_crm
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

---

## 12. Security Considerations

1. **API Key/Auth**: Add authentication to MT5 API calls (if required)
2. **Rate Limiting**: Limit deposit/withdraw requests per user
3. **Balance Validation**: Always validate balance before withdrawal
4. **SQL Injection**: Use parameterized queries
5. **Password Storage**: Never log or expose MT5 passwords

---

## Summary

This plan focuses on **4 core MT5 features** with a **zero-error implementation strategy**:

1. ✅ Open Live Account
2. ✅ Deposit
3. ✅ Withdrawal  
4. ✅ Groups

**Key Principles**:

- Implement ONE API at a time
- Test thoroughly before moving to next
- Store all data in PostgreSQL
- Direct MT5 Manager API integration (no Skale proxy)
- Simple, focused implementation

**Next Steps**:

1. Setup PostgreSQL database
2. Implement API routes one by one
3. Test each route independently
4. Update frontend components
5. End-to-end testing

### To-dos

- [ ] Setup PostgreSQL database and create tables (mt5_accounts, transactions, users)
- [ ] Implement /api/mt5/groups route and test with Postman
- [ ] Implement /api/mt5/create-account route with PostgreSQL insert logic
- [ ] Implement /api/mt5/user-profile/[login] route for fetching account details
- [ ] Implement /api/mt5/deposit route with balance update and transaction logging
- [ ] Implement /api/mt5/withdraw route with balance validation and transaction logging
- [ ] Update NewAccountDialog component to use new MT5 API
- [ ] Update DepositDialog component to use new MT5 deposit API
- [ ] Update WithdrawDialog component to use new MT5 withdraw API
- [ ] Update Dashboard to fetch and display MT5 account balances from new APIs
- [ ] End-to-end testing: Create account → Deposit → Withdraw → Balance check