# Environment Variables Setup

## Add to `.env.local`

Copy and paste these credentials into your `.env.local` file:

```bash
# ===== Cregis Payment Engine (Deposits) =====
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io

# ===== Cregis WaaS (Withdrawals) =====
CREGIS_WAAS_PROJECT_ID=1435226266132480
CREGIS_WAAS_API_KEY=f2ce7723128e4fdb88daf9461fce9562

# ===== Payment URLs =====
CREGIS_SUCCESS_URL=http://localhost:3000/deposit/success
CREGIS_CANCEL_URL=http://localhost:3000/deposit/cancel
CREGIS_VALID_TIME=600

# ===== Application Base URL =====
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Production URLs

Update these URLs when deploying to production:

```bash
CREGIS_SUCCESS_URL=https://yourapp.com/deposit/success
CREGIS_CANCEL_URL=https://yourapp.com/deposit/cancel
NEXT_PUBLIC_BASE_URL=https://yourapp.com
```

## Verification

After adding the credentials, restart your development server:

```bash
npm run dev
```

The integration will automatically use these credentials when processing payments.
