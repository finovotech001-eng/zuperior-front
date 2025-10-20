<!-- b1f408e9-222a-45b7-add2-4f6b2b357ff3 bfd90810-3451-4028-bec3-465927f03272 -->
# Zuperior Forex CRM - Client-Side Analysis & Planning

## Executive Summary

**Project**: Zuperior Forex Trading CRM
**Framework**: Next.js 15.3.2 (App Router) + TypeScript + React 19
**State Management**: Redux Toolkit + Redux Persist
**UI Library**: Radix UI + Tailwind CSS + Framer Motion
**Current State**: Fully functional client-side with API integration to Skale CRM API
**Backend API**: Will use own bakcned and own makmde apis from aother url only to perform mt5 operations

---

## 1. Directory Structure Analysis

### 1.1 `src/app/` - Application Routes (Next.js App Router)

**Purpose**: Contains all routes, pages, layouts, and API endpoints.

**Structure**:
```
app/
├── (protected)/          # Protected routes requiring authentication
│   ├── layout.tsx        # Dashboard layout with Sidebar + Navbar
│   ├── page.tsx          # Dashboard home (/)
│   ├── deposit/          # Crypto & card deposit flows
│   ├── withdrawal/       # Crypto withdrawal + internal transfer
│   ├── transactions/     # Transaction history (deposits/withdrawals)
│   ├── kyc/              # KYC verification (identity + address)
│   ├── settings/         # Profile, security, verification
│   ├── support/          # Support hub + ticket system
│   ├── partner/          # IB (Introducing Broker) program
│   ├── trading-platforms/ # MT5 download links
│   └── trading-tools/    # Trading calculators & analysis tools
├── api/                  # Next.js API routes (proxy to Skale API)
├── login/                # Auth page (login/register)
├── terminal/             # TradingView chart terminal
└── tools/                # Standalone trading tool pages
```

**Key Insights**:
- **Route Groups**: `(protected)` enforces authentication via middleware
- **Nested Layouts**: Separate layouts for protected routes and login
- **API Routes**: All 39 API routes act as proxies to external Skale CRM API

---

### 1.2 `src/components/` - Reusable UI Components

**Purpose**: Modular, reusable React components for UI and business logic.

**Categories**:

| Category | Components | Purpose |
|----------|-----------|---------|
| **Dashboard** | `dashboard-content.tsx`, `accounts-section.tsx`, `balance-section.tsx` | Core dashboard UI |
| **Deposit/Withdraw** | `DepositDialog.tsx`, `WithdrawPayoutDialog.tsx`, `TransferFundsDialog.tsx` | Multi-step payment flows |
| **Transactions** | `TransactionTable.tsx`, `TransactionsToolbar.tsx` | Transaction history UI |
| **Charts** | `market-overview.tsx`, `technical-analysis.tsx`, `crypto-heatmap.tsx` | TradingView widgets |
| **Sidebar/Navbar** | `sidebar/`, `navbar.tsx` | Navigation components |
| **UI Primitives** | `ui/` (23 components) | Radix UI wrappers (Button, Dialog, Select, etc.) |

**UI Component Library** (`components/ui/`):
- Button, Input, Select, Textarea, Label
- Dialog, Dropdown Menu, Popover, Tooltip
- Card, Tabs, Toggle, Switch
- Calendar, Skeleton, Sonner (toast notifications)
- Custom: `text-animate.tsx`, `floating-dots.tsx`

---

### 1.3 `src/store/` - Redux State Management

**Purpose**: Centralized state with Redux Toolkit + Redux Persist.

**Slices**:

| Slice | File | State Managed |
|-------|------|---------------|
| **Auth** | `authSlice.ts` | `token`, `clientId`, login/logout |
| **User** | `getUserSlice.ts` | User profile data (name, email, phone, etc.) |
| **Accounts** | `accountsSlice.ts` | MT5 accounts (Live/Demo), balances |
| **Transactions** | `transactionsSlice.ts` | Deposit/withdrawal history |
| **KYC** | `kycSlice.ts` | Verification status (document/address) |
| **Access Token** | `accessCodeSlice.ts` | Temporary access token for API calls |
| **Register** | `registerSlice.ts` | Registration flow state |

**Key Features**:
- **Redux Persist**: Stores auth, user, accounts, transactions, KYC in localStorage
- **Automatic Token Refresh**: `accessCodeSlice` fetches new tokens before API calls
- **Logout Reset**: Custom root reducer clears all state on logout

---

### 1.4 `src/context/` - React Context API

**Purpose**: Global state not managed by Redux.

**Contexts**:
- **LoadingContext** (`LoadingContext.tsx`): Global loading spinner state

---

### 1.5 `src/hooks/` - Custom React Hooks

| Hook | Purpose |
|------|---------|
| `useFetchUserData.ts` | Fetches user data + accounts, auto-refresh every 2 mins |
| `useSidebarState.ts` | Sidebar collapse/expand state |
| `useChartToken.ts` | TradingView widget authentication |

---

### 1.6 `src/services/` - API Service Functions

**Purpose**: Reusable functions for API calls.

**Services**:
- `forgetPassword.ts`, `resetPassword.ts`, `changeTpPassword.ts`
- `documentVerification.ts`, `addressVerification.ts`, `amlVerification.ts`
- `kycService.ts`, `depositLimitService.ts`
- `internalTransfer.ts`, `createTicket.ts`

**Pattern**: Each service calls `/api/*` routes (Next.js API routes), which proxy to Skale API.

---

### 1.7 `src/types/` - TypeScript Interfaces

**Key Types**:

| File | Types Defined |
|------|---------------|
| `user-details.ts` | `User`, `TpAccountSnapshot`, `AccountBillAdsGeneral` |
| `account-details.ts` | `ApiResponse` (MT5 account data) |
| `kyc.ts` | `DocumentKYCRequestBody`, `AMLResponse`, `AddressKYCRequestBody` |
| `cryptocurrency.ts` | (Crypto payment types) |

---

### 1.8 `src/lib/` - Utility Libraries

| File | Purpose |
|------|---------|
| `sidebar-config.ts` | Menu items configuration |
| `sidebar-assets.ts` | Menu icon imports |
| `utils.ts` | `cn()` utility for class merging |
| `axios.ts` | Axios instance configuration |
| `supabase.ts` | Supabase client (if used) |
| `countries.json` | Country list for registration |

---

### 1.9 `src/assets/` - Static Assets

**Structure**:
```
assets/
├── icons/          # UI icons (PNG/SVG)
├── sidebar/        # Sidebar menu icons
├── login/          # Login page images
├── kyc/            # KYC illustration images
├── home/           # Landing page images
└── emails/         # Email template assets
```

---

### 1.10 `src/emails/` - Email Templates

**Purpose**: React Email templates for transactional emails.

**Templates**:
- `WelcomeEmail.tsx` - Sent on registration
- `PasswordChanged.tsx` - Sent on password change

**Tech**: `@react-email/render` for HTML generation

---

## 2. Page-by-Page Analysis

### 2.1 Authentication Pages

#### **`/login`** - Login & Registration Page

**File**: `src/app/login/page.tsx`

**Features**:
- Swiper carousel with login screen images
- Tabs for Login/Register
- Two-step registration:
  1. **Step 1**: Email, password, name, phone, country
  2. **Step 2**: OTP verification
- Form validation with `react-hook-form` + `zod`

**Components**:
- `AuthForm` → `LoginForm` / `RegisterStep1Form` / `RegisterStep2OtpForm`
- `auth-schemas.ts` - Zod validation schemas

**API Calls**:
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/send-otp` - OTP generation

**Data Flow**:
1. User submits form → API call → Skale API
2. On success: Redux stores `token` + `clientId` → Redirect to `/`

---

### 2.2 Dashboard Home

#### **`/`** - Dashboard Overview

**File**: `src/app/(protected)/page.tsx`

**Features**:
- Welcome message with user's name
- Verification status alert (KYC reminder)
- Wallet balance display (total across all accounts)
- Accounts section (Live/Demo tabs)
- Auto-refresh user data every 2 minutes

**Components**:
- `DashboardContent` → `BalanceSection` + `AccountsSection`
- `VerificationAlert` - Shows KYC status banner

**Data Sources**:
- `useFetchUserData()` hook → Fetches user + accounts
- Redux: `state.user.data`, `state.accounts.data`, `state.kyc.verificationStatus`

**Future Integrations**:
- Real-time balance updates via WebSocket
- Open positions/trades summary
- Recent transactions widget

---

### 2.3 Accounts Management

#### **Accounts Section** (Dashboard Component)

**File**: `src/components/dashboard/accounts-section.tsx`

**Features**:
- Live/Demo account tabs
- Account cards with:
  - Account ID, platform (MT5), leverage
  - Balance, equity, margin, free margin
  - Open P&L, closed P&L
- "Open New Account" dialog (4-step flow)

**Account Card Actions**:
- **Trade Now** → Redirects to `/terminal` or external MT5 platform
- **Change Leverage** → API call to update leverage
- **Change Password** → Change MT5 account password
- **Rename Account** → Update account nickname
- **Deposit** → Opens deposit dialog

**New Account Flow** (`new-account/`):
1. Choose account type (Standard/ECN/Zero)
2. Prepare account (loading animation)
3. Account created (success screen)

**API Calls**:
- `POST /api/create-account` - Create new MT5 account
- `POST /api/leverage` - Update leverage
- `POST /api/password/tp-password` - Change MT5 password

---

### 2.4 Deposit Page

#### **`/deposit`** - Deposit Funds

**File**: `src/app/(protected)/deposit/page.tsx`

**Features**:
- Tab filters: All / Crypto / Bank Transfers
- Cryptocurrency cards (USDT-TRC20, USDT-ERC20, etc.)
- Credit/Debit card payment (via ePay gateway)

**Deposit Flow (Crypto)**:
1. **Step 1**: Select crypto, enter amount, select account
2. **Step 2**: Confirmation (review details)
3. **Step 3**: Payment (generate wallet address via Cregis API)
4. **Step 4**: Status (pending/success)

**Deposit Flow (Credit Card)**:
1. **Step 1**: Enter card details
2. **Step 2**: Enter amount + account
3. **Step 3**: Submit to ePay gateway → Redirect to payment page

**Components**:
- `DepositDialog` (crypto flow)
- `CreditCardDialog` (card flow)

**API Calls**:
- `POST /api/crypto-currency` - Fetch supported crypto tokens
- `POST /api/cregis/*` - Cregis payment gateway integration
- `POST /api/epay-deposit` - ePay card payment
- `POST /api/deposit` - Record deposit in CRM

**Future Integrations**:
- Bank wire transfer option
- E-wallets (Skrill, Neteller)
- Real-time deposit tracking

---

### 2.5 Withdrawal Page

#### **`/withdrawal`** - Withdraw Funds

**File**: `src/app/(protected)/withdrawal/page.tsx`

**Features**:
- Locked if KYC not completed
- Cryptocurrency withdrawal
- Internal transfer between accounts

**Withdrawal Flow**:
1. **Step 1**: Enter wallet address, amount, select account
2. **Step 2**: Confirmation
3. **Step 3**: Submit → Pending approval

**Internal Transfer Flow**:
1. Select source account
2. Select destination account
3. Enter amount → Transfer instantly

**Components**:
- `WithdrawPayoutDialog` - Withdrawal flow
- `TransferFundsDialog` - Internal transfer

**API Calls**:
- `POST /api/withdraw` - Submit withdrawal request
- `POST /api/internal-transfer` - Transfer between accounts
- `POST /api/payout` - Cregis payout API

**Pending Withdrawals** (`/withdrawal/pending`):
- Shows list of pending withdrawal requests
- Displays status, amount, wallet address

---

### 2.6 Transactions Page

#### **`/transactions`** - Transaction History

**File**: `src/app/(protected)/transactions/page.tsx`

**Features**:
- Tabs: All / Deposits / Withdrawals
- Account selector dropdown
- Date range filter
- Search by transaction ID or account number
- Transaction table with columns:
  - Type (Deposit/Withdraw)
  - Amount, Date/Time
  - Account ID, Status

**Components**:
- `TransactionsHeader` - Tab switcher
- `TransactionsToolbar` - Filters (account, date, search)
- `TransactionsTable` - Data table with sorting

**Data Flow**:
1. User selects account → API call → Fetch transactions
2. Redux: `transactionsSlice` stores data
3. Table renders filtered/sorted transactions

**API Calls**:
- `POST /api/transactions` - Fetch transaction history

**Future Enhancements**:
- Export to CSV/PDF
- Transaction details modal
- Bonus/credit transactions

---

### 2.7 KYC Verification Pages

#### **`/kyc`** - KYC Hub

**File**: `src/app/(protected)/kyc/page.tsx`

**Features**:
- Two cards: Identity Proof + Address Proof
- Lock address proof until identity verified
- Show checkmark when verified

**Identity Proof Flow** (`/kyc/identity-proof`):
1. **Personal Info**: First name, last name, DOB
2. **Document Upload**: Passport/ID/Driver's license
3. **Verification in Progress**: Shows pending status

**Address Proof Flow** (`/kyc/address-proof`):
1. **Personal Info**: Address details
2. **Document Upload**: Utility bill/bank statement
3. **Verification in Progress**

**Components**:
- `PersonalInfoStep.tsx` - Form for personal details
- `DocumentVerificationStep.tsx` - File upload
- `VerificationInProgressStep.tsx` - Status display

**API Calls**:
- `POST /api/kyc/document` - Submit identity document (Shufti Pro API)
- `POST /api/kyc/address` - Submit address document
- `POST /api/kyc/aml` - AML screening

**Verification Status Updates**:
- `kycSlice` tracks `isDocumentVerified`, `isAddressVerified`
- Updates displayed in `VerificationAlert` banner

---

### 2.8 Settings Page

#### **`/settings`** - Profile Settings

**File**: `src/app/(protected)/settings/page.tsx`

**Features**:
- Tabs: Profile / Verification / Security
- Query param navigation: `/settings?tab=profile`

**Profile Tab**:
- Display user info (name, email, phone, country)
- Edit profile (currently read-only in UI)

**Verification Tab**:
- KYC status overview
- Remaining deposit limit (based on KYC level)
- Links to KYC pages

**Security Tab**:
- Change password
- Email verification
- TP (Trading Platform) password change
- Two-factor authentication (coming soon)

**Components**:
- `Profile.tsx` - User info display
- `VerificationProfile.tsx` - KYC status
- `SecurityTab.tsx` - Password management

**API Calls**:
- `POST /api/password/forget` - Request password reset
- `POST /api/password/reset` - Reset password
- `POST /api/password/tp-password` - Change MT5 password

---

### 2.9 Support Hub

#### **`/support`** - Support Center

**File**: `src/app/(protected)/support/page.tsx`

**Features**:
- Help center with search (placeholder)
- Contact options:
  1. **Open a Ticket** - Submit support ticket
  2. **Live Chat** - Crisp chat integration
  3. **Email** - support@zuperior.com
- My Tickets section (empty state for now)

**Ticket Creation Flow** (`OpenTicketFlow`):
1. Select category (Deposit, Withdrawal, Trading, Technical, etc.)
2. Enter subject + description
3. Select priority (Low/Normal/High)
4. Optionally attach account number
5. Submit → Shows ticket number

**Components**:
- `OpenTicketFlow.tsx` - Multi-step ticket form

**API Calls**:
- `POST /api/ticket/create` - Create support ticket

**Live Chat**:
- **Crisp Chat**: Initialized in `(protected)/layout.tsx`
- Hidden by default, opens via "Start Chat" button

**Future Enhancements**:
- Fetch and display user's tickets
- Ticket detail view with replies
- File attachments

---

### 2.10 Partner Program

#### **`/partner`** - IB Program

**File**: `src/app/(protected)/partner/page.tsx`

**Features**:
- Introducing Broker (IB) program overview
- "Apply Now" button → Redirects to external IB portal
- Revenue share model (up to 40%)

**Future Enhancements**:
- IB dashboard (referrals, commissions, downline)
- Referral link generator
- Commission reports
- Sub-IB management

**Expected Backend Routes** (to be added):
- `GET /api/ib/stats` - IB statistics
- `GET /api/ib/commissions` - Commission history
- `GET /api/ib/referrals` - Referral list

---

### 2.11 Trading Platforms

#### **`/trading-platforms`** - Platform Downloads

**File**: `src/app/(protected)/trading-platforms/page