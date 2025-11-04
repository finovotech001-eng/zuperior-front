# Cregis Payment Gateway - Troubleshooting Guide

## Common Errors and Solutions

### Error 1: IP Whitelist Error

**Error Message:**
```
IP whitelist error: Your server IP needs to be added to Cregis whitelist. 
IP: 45.248.24.156. Please contact Cregis support to add this IP to the whitelist.
```

**Cause:** Cregis requires all API requests to come from whitelisted IP addresses for security.

**Solution:** See [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md) for detailed instructions.

**Quick Fix:**
1. Log into Cregis Dashboard
2. Navigate to Project Settings → IP Whitelist
3. Add your server IP: `45.248.24.156`
4. Wait 5-15 minutes for propagation

---

### Error 2: Valid Time Parameter Error

**Error Message:**
```
Cregis API error: Please input in minutes. Minimum is 10 minutes, maximum 60 minutes
```

**Cause:** The `validTime` parameter was set incorrectly (in seconds instead of minutes, or outside the 10-60 minute range).

**Solution:** ✅ **FIXED** - The code now correctly uses minutes with a default of 30 minutes.

**What was changed:**
- Default `validTime` changed from `600` (incorrectly interpreted as 600 minutes) to `30` (30 minutes)
- Added validation to clamp values to the 10-60 minute range
- Updated documentation to clarify the unit is MINUTES, not seconds

**Configuration:**
Set in your `.env` file:
```bash
CREGIS_VALID_TIME=30  # Payment link valid for 30 minutes
```

**Valid Range:**
- Minimum: 10 minutes
- Maximum: 60 minutes
- Default: 30 minutes (if not set)

---

### Error 3: Missing or Invalid Amount

**Error Message:**
```
Invalid amount: must be greater than 0
```

**Cause:** The `orderAmount` field is missing, empty, or set to zero.

**Solution:**
Ensure you're passing a valid amount when initiating payment:

```typescript
const response = await fetch("/api/epay", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderAmount: "100.00",  // Must be > 0
    // ... other fields
  }),
});
```

---

### Error 4: Invalid Callback URLs

**Error Message:**
```
callbackUrl must not be empty
successUrl must not be empty
cancelUrl must not be empty
```

**Cause:** Required URL parameters are missing or empty.

**Solution:**
Set these environment variables:

```bash
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

The system will auto-generate callback URLs, but success and cancel URLs should be explicitly set.

---

### Error 5: Signature Verification Failed

**Error Message:**
```
Cregis API error: Sign verification failed
```

**Cause:** API key mismatch or incorrect signature generation.

**Solution:**
1. Verify your API credentials in `.env`:
```bash
CREGIS_PAYMENT_PROJECT_ID=your_project_id
CREGIS_PAYMENT_API_KEY=your_api_key
```

2. Ensure you're using the correct credentials for your environment:
   - **Test/Sandbox:** Use test credentials
   - **Production:** Use production credentials

3. Check that credentials haven't been regenerated in Cregis dashboard

---

### Error 6: Payment Method Not Available

**Error Message:**
```
Cregis API error: Order currency not available
```

**Cause:** The requested payment currency/method is not enabled for your project.

**Solution:**
1. Log into Cregis Dashboard
2. Go to Payment Methods settings
3. Enable the required payment methods (e.g., USD, USDT, card payments)
4. Contact Cregis support if you need additional payment methods enabled

---

### Error 7: No Payment URL Received

**Error Message:**
```
No payment URL received from server
Cregis API did not return a payment URL. Currency 'USD' may not be enabled for your project.
```

**Cause:** Cregis API returned a success response but didn't include a `payment_url`. This typically means:
- The currency is not supported/enabled for your project
- Card payments are not enabled in Cregis dashboard
- Test environment limitations
- Project configuration is incomplete

**Diagnosis:**

Check your console logs for:
```
📋 [EPAY] Available payment currencies: [...]
```

This will show which currencies are actually enabled for your project.

**Solutions:**

#### Solution 1: Check Available Currencies

The API now automatically fetches and logs available currencies. Look for this in your server logs:

```
✅ [EPAY] Available payment currencies: { ... }
```

Find the correct currency code from this list and update your configuration.

#### Solution 2: Configure Currency

Add to your `.env` file:

```bash
# Try different currency codes based on what Cregis returns
CREGIS_CARD_CURRENCY=USD    # Try this first
# OR
CREGIS_CARD_CURRENCY=USDT   # If USD doesn't work
# OR  
CREGIS_CARD_CURRENCY=TRX    # Or other supported currency
```

#### Solution 3: Enable Card Payments in Cregis

1. Log into Cregis Dashboard
2. Navigate to **Project Settings** → **Payment Methods**
3. Look for **Card Payment** or **Fiat Payment** options
4. Enable the payment methods you need
5. **Configure currencies**: Enable USD or your preferred fiat currency
6. Save changes and wait 5-10 minutes for propagation

#### Solution 4: Contact Cregis Support

If card payments aren't showing in your dashboard:

**Email Template:**

```
Subject: Enable Card Payments - Project ID [YOUR_PROJECT_ID]

Hello Cregis Support,

I need to enable card/fiat payments for my project:

- Project ID: 1435226128711680
- Project Name: Zuperior Trading Platform  
- Environment: [Test/Production]
- Required Payment Methods: Card payments (USD)
- Issue: payment_url not returned in API response

Current situation:
- API calls succeed (code: "00000")
- But no payment_url is included in the response
- Need to enable card payment processing

Please enable card payments and confirm which currency codes I should use.

Thank you!
```

#### Solution 5: Use Crypto Payments Instead

If card payments aren't available in your environment, you can use the crypto payment endpoint instead:

- **Endpoint:** `/api/checkout` (instead of `/api/epay`)
- **Currencies:** USDT, TRX, BTC, ETH, etc.
- **More widely supported** in Cregis projects

---

## Testing Your Integration

### 1. Test with Cregis Sandbox

Always test in sandbox/test environment first:

```bash
# .env for testing
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io  # Test environment
CREGIS_PAYMENT_PROJECT_ID=1435226128711680       # Test project ID
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af  # Test API key
```

### 2. Check Console Logs

The integration logs detailed information at each step:

```bash
# Look for these log patterns
🚀 [EPAY] Starting card payment request processing
💳 [EPAY] Received card payment request
📝 [EPAY] Calling createPaymentOrder with
📤 Creating Cregis payment order
✅ [EPAY] Cregis payment order created successfully
```

### 3. Verify Payment Flow

1. **Initiate Payment** → Should receive payment URL
2. **Redirect User** → User sees Cregis payment page
3. **Complete Payment** → User completes payment on Cregis
4. **Callback** → Cregis calls your callback URL
5. **Redirect** → User redirected to success/cancel URL

---

## Environment Configuration Checklist

- [ ] `CREGIS_GATEWAY_URL` - Set to correct environment (test/production)
- [ ] `CREGIS_PAYMENT_PROJECT_ID` - Valid project ID
- [ ] `CREGIS_PAYMENT_API_KEY` - Valid API key matching project
- [ ] `CREGIS_SUCCESS_URL` - Where to redirect on successful payment
- [ ] `CREGIS_CANCEL_URL` - Where to redirect on cancelled payment
- [ ] `CREGIS_VALID_TIME` - Set between 10-60 minutes (optional, defaults to 30)
- [ ] `CREGIS_CARD_CURRENCY` - Currency code for card payments (optional, defaults to USD)
- [ ] `CREGIS_WAAS_PROJECT_ID` - For withdrawals (if using WaaS)
- [ ] `CREGIS_WAAS_API_KEY` - For withdrawals (if using WaaS)
- [ ] `NEXT_PUBLIC_BASE_URL` - Your application's base URL
- [ ] Server IP whitelisted in Cregis dashboard
- [ ] Card payments enabled in Cregis dashboard

---

## Quick Debug Steps

1. **Check Environment Variables**
   ```bash
   # Print all Cregis-related env vars (be careful not to expose in logs)
   echo $CREGIS_GATEWAY_URL
   echo $CREGIS_PAYMENT_PROJECT_ID
   ```

2. **Test API Connectivity**
   ```bash
   # Check if you can reach Cregis API
   curl https://t-rwwagnvw.cregis.io/api/v2/checkout/order_currency/list
   ```

3. **Verify Server IP**
   ```bash
   # Check your server's public IP
   curl ifconfig.me
   ```

4. **Check Browser Console**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for error messages with emoji prefixes (🚀 💳 ❌ ✅)

5. **Check Network Tab**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Look for `/api/epay` request
   - Check request payload and response

---

## Getting Help

### From Cregis

- **Email:** support@cregis.com
- **Documentation:** https://developer.cregis.com
- **Dashboard:** https://dashboard.cregis.com

### Include in Support Request

When contacting Cregis support, include:

1. **Project ID:** `[your project ID]`
2. **Environment:** Test/Production
3. **Error Message:** Copy full error from console
4. **Request ID:** If available from API response
5. **Timestamp:** When the error occurred
6. **Server IP:** Your server's public IP address

### From Your Development Team

Check these files for implementation details:

- `src/app/api/epay/route.ts` - Payment API endpoint
- `src/lib/cregis-payment.service.ts` - Cregis integration service
- `src/components/deposit/Epay/CreditCardDialog.tsx` - Frontend payment dialog

---

## Code Changes Summary (Nov 4, 2025)

### Fixed: Valid Time Parameter

**Before:**
```typescript
validTime: 600  // Incorrectly treated as 600 minutes (exceeds 60 min max)
```

**After:**
```typescript
validTime: 30  // Correctly set to 30 minutes (within 10-60 range)
```

**Files Modified:**
- `src/app/api/epay/route.ts` - Changed default from 600 to 30
- `src/lib/cregis-payment.service.ts` - Updated JSDoc, default value, and added validation

**Validation Added:**
```typescript
// Validate validTime is within Cregis acceptable range (10-60 minutes)
if (validTime < 10 || validTime > 60) {
  console.warn(`⚠️ validTime ${validTime} is outside Cregis range (10-60 minutes). Clamping to valid range.`);
  validTime = Math.max(10, Math.min(60, validTime));
}
```

---

**Last Updated:** 2025-11-04  
**Version:** 1.0  
**Status:** Validated & Tested

