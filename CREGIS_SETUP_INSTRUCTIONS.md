# Cregis Payment Setup - Complete Instructions

## Issue Fixed

The "Payment initiation failed" and "Cannot read properties of undefined" errors have been fixed. The issues were:
1. API response format mismatch
2. Missing error handling for undefined values
3. Cregis credentials not properly configured

## Setup Steps

### 1. Add Environment Variables

Create or edit the file: `zuperior-front/.env.local`

Add these credentials:

```bash
# Cregis Payment Engine (Deposits)
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io

# Cregis WaaS (Withdrawals)
CREGIS_WAAS_PROJECT_ID=1435226266132480
CREGIS_WAAS_API_KEY=f2ce7723128e4fdb88daf9461fce9562

# Payment URLs
CREGIS_SUCCESS_URL=http://localhost:3000/deposit/success
CREGIS_CANCEL_URL=http://localhost:3000/deposit/cancel
CREGIS_VALID_TIME=600

# Base URL (update for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Restart Your Server

After adding the environment variables, restart your development server:

```bash
cd zuperior-front
npm run dev
```

### 3. Test the Integration

1. Go to the deposit page
2. Select "USDT-TRC20" 
3. Enter an amount
4. Select an MT5 account
5. Click "Continue" through the steps

The payment order will be created with Cregis and you'll see the payment URL or QR code.

## How It Works

### Payment Flow

1. **User initiates deposit** → Selects crypto and account
2. **Frontend calls `/api/checkout`** → Creates payment order with Cregis
3. **Cregis returns payment details** → Payment URL, QR code, expiry time
4. **User pays via Cregis** → Scans QR or visits payment URL
5. **Cregis sends callback** → `/api/cregis/payment-callback` receives payment status
6. **System processes payment** → Updates deposit status and MT5 balance

### Files Involved

- **Service**: `src/lib/cregis-payment.service.ts` - Handles Cregis API calls
- **API**: `src/app/api/checkout/route.ts` - Creates payment orders
- **Callback**: `src/app/api/cregis/payment-callback/route.ts` - Handles payment notifications
- **Dialog**: `src/components/deposit/DepositDialog.tsx` - User interface

## Troubleshooting

### If you still see "Payment initiation failed":

1. Check `.env.local` exists and has all credentials
2. Restart the dev server after adding env variables
3. Check browser console for detailed error messages
4. Verify Cregis API credentials are correct

### Common Issues

**Error: "Missing environment variables"**
- Solution: Add all variables to `.env.local`

**Error: "Invalid signature"**
- Solution: Check API keys match the Project IDs

**Error: "Cannot read properties of undefined"**
- Solution: Fixed in latest code update

## Production Deployment

For production, update these URLs in `.env.local`:

```bash
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Next Steps

1. Add credentials to `.env.local` ✅
2. Test deposit flow ✅
3. Implement callback database updates (marked as TODO in code)
4. Test withdrawal flow when ready

## Support

- Cregis Documentation: https://developer.cregis.com/api-reference/request
- Check console logs for detailed error messages
- All payment API calls are logged with 📤 and ✅ emojis
