# Credit/Debit Card with Cregis Payment Gateway

## Integration Complete ✅

The credit/debit card deposit flow now uses **Cregis Payment Gateway** instead of the old epay service.

## What Changed

### 1. Updated `/api/epay` Route
- **Location**: `src/app/api/epay/route.ts`
- **Changes**:
  - Removed old epay integration
  - Integrated with Cregis Payment Gateway
  - Uses the same Cregis credentials as crypto deposits
  - Returns payment URL for card checkout

### 2. Updated Credit Card Dialog
- **Location**: `src/components/deposit/Epay/CreditCardDialog.tsx`
- **Changes**:
  - Updated to use new API response format
  - Properly handles Cregis payment URLs
  - Fixed account selection logic for MT5 accounts
  - Improved error handling

## How It Works

### Payment Flow

1. **User clicks "Credit / Debit Cards"** → Opens credit card dialog
2. **Selects MT5 account and enters amount** → Step 1
3. **Reviews details** → Step 2
4. **Clicks "Continue"** → Calls `/api/epay` with Cregis
5. **Cregis creates payment order** → Returns payment URL
6. **User redirects to Cregis payment page** → Step 3
7. **Enters card details on Cregis** → Secure payment
8. **Cregis sends callback** → `/api/cregis/payment-callback`
9. **System processes payment** → Updates MT5 balance

## Environment Variables

The same Cregis credentials are used for both crypto and card payments:

```bash
# In zuperior-front/.env.local

# Cregis Payment Engine (Deposits - Crypto & Cards)
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io

# Payment URLs
CREGIS_SUCCESS_URL=http://localhost:3000/deposit/success
CREGIS_CANCEL_URL=http://localhost:3000/deposit/cancel
CREGIS_VALID_TIME=600

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Key Features

### ✅ Unified Payment System
- Both crypto and card deposits use Cregis
- Same credentials and API endpoints
- Consistent callback handling

### ✅ Secure Card Processing
- Cregis handles all card payment processing
- PCI DSS compliant
- No card data stored on your server

### ✅ Multiple Payment Methods
- **Crypto**: TRC20 (with QR)
- **Cards**: Credit/Debit via Cregis payment gateway

## API Endpoints

### Create Card Payment
```
POST /api/epay
Body: {
  orderAmount: "100",
  success_url: "...",
  failure_url: "...",
  account_number: "...",
  account_type: "..."
}

Response: {
  orderId: "...",
  transactionId: "...",
  redirectUrl: "https://cregis.io/pay/..."
}
```

### Payment Callback
```
POST /api/cregis/payment-callback
```
Same callback handler for both crypto and card payments.

## Testing

### To Test Card Deposits:

1. **Add Cregis credentials** to `.env.local` (see above)
2. **Restart dev server**: `npm run dev`
3. **Go to deposit page**
4. **Click "Credit / Debit Cards"**
5. **Select account and enter amount**
6. **Click Continue**
7. **You'll be redirected to Cregis payment page**
8. **Use test card details** (provided by Cregis)
9. **Complete payment**
10. **Redirects back with success/failure status**

## Success/Failure URLs

Currently configured for:
- Success: `/deposit/success`
- Cancel: `/deposit/cancel`

These pages need to be created or you can use existing ones like `/creditCardSuccess` and `/creditCardFailed`.

## Migration Notes

### Old vs New

| Feature | Old (epay) | New (Cregis) |
|---------|-----------|--------------|
| Provider | epay | Cregis |
| Currency | USD | USD |
| Integration | Separate | Unified with crypto |
| Callback | `/api/epay/callback` | `/api/cregis/payment-callback` |
| Credentials | epay credentials | Cregis credentials |

### Benefits of Cregis

1. **Unified system** - One payment provider for all methods
2. **Better reporting** - Single dashboard for all transactions
3. **More currencies** - Cregis supports more payment methods
4. **Better security** - PCI DSS compliant
5. **Lower fees** - Potentially better rates than multiple providers

## Production Deployment

Update these in `.env.local` for production:

```bash
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Support

- Cregis Documentation: https://developer.cregis.com/api-reference/request
- Check console logs for payment flow (emoji indicators: 💳 📤 ✅ ❌)
- All payment operations are logged for debugging
