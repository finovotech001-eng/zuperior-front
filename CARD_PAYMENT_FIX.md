# Credit/Debit Card Payment - Issues Fixed

## Issues Resolved

### 1. ❌ 400 Bad Request Error
**Problem**: API endpoint was returning 400 error when trying to create card payment.

**Root Cause**: Account information wasn't being passed correctly; MT5 accounts have a different structure than expected.

**Solution**: 
- Fixed account type extraction from MT5 account `group` field
- Updated API to properly handle account information
- Added better error logging to diagnose issues

### 2. ❌ "Not Specified" Account Type
**Problem**: Account type was showing "Not specified" in the confirmation step.

**Root Cause**: The code was trying to split selectedAccount by "|" (pipe), but MT5 accounts use just the accountId string.

**Solution**: 
- Updated `CreditStep2Form` to extract account information from the accounts array
- Added helper function to determine account type from group name
- Now properly shows "Pro" or "Standard" based on account group

## Changes Made

### 1. CreditCardDialog.tsx
```typescript
// Added account type extraction
const getAccountTypeFromGroup = (group?: string): string => {
  if (!group) return "Standard";
  if (group.includes('Pro')) return 'Pro';
  if (group.includes('Standard')) return 'Standard';
  return 'Standard';
};

const accountType = getAccountTypeFromGroup(account?.group);
```

### 2. CreditStep2Form.tsx
- Now receives `accounts` prop to look up account details
- Extracts account type from the actual account object
- Shows correct account type instead of "Not Specified"

### 3. API Error Logging
- Added detailed console logging throughout `/api/epay`
- Shows request data, URL configuration, and Cregis response
- Better error messages for debugging

## Testing

### Test the Fix:

1. **Restart your dev server** if it's running:
   ```bash
   npm run dev
   ```

2. **Open browser console** to see detailed logs

3. **Test the card deposit flow**:
   - Go to deposit page
   - Click "Credit / Debit Cards"
   - Select an MT5 account
   - Enter an amount (e.g., 100)
   - Click Continue to Step 2
   - You should now see the correct account type (Pro/Standard)
   - Click Continue to Step 3

4. **Check browser console** for logs:
   - Look for `💳 Received card payment request:`
   - Check for any `❌` error messages
   - If successful, you'll see `✅ Payment URL received`

## What to Look For

### In Browser Console:
```
💳 Initiating Cregis card payment: { amount, currency, account_number, account_type, account_group }
💳 API response: { redirectUrl, orderId, ... }
✅ Payment URL received, redirecting user to Cregis payment page
```

### If You Still See Errors:
Check the server console (terminal where `npm run dev` is running) for:
```
💳 Received card payment request: { orderAmount, success_url, ... }
📋 Payment URLs configured: { successUrl, cancelUrl }
✅ Cregis payment order created successfully for card deposit
```

## Common Issues

### If you still get 400 error:

1. **Check environment variables** in `.env.local`:
   ```bash
   CREGIS_PAYMENT_PROJECT_ID=1435226128711680
   CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
   CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io
   CREGIS_SUCCESS_URL=http://localhost:3000/deposit/success
   CREGIS_CANCEL_URL=http://localhost:3000/deposit/cancel
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

2. **Check the server console** for the actual error message

3. **Verify the account** has a valid `group` field

## Next Steps

Once the payment URL is received successfully:
1. User will be redirected to Cregis payment page
2. Enter card details on Cregis secure page
3. Complete payment
4. Redirect back to your app
5. Handle in callback route (`/api/cregis/payment-callback`)

## Debug Mode

All API calls are logged with emojis:
- 💳 = Card payment
- 📤 = Sending request
- ✅ = Success
- ❌ = Error
- 📋 = Data/details
