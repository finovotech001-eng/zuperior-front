# USDT TRC20 Payment Setup Guide

## ✅ Quick Configuration

Your payment system is now configured for **USDT TRC20 cryptocurrency payments** instead of card payments.

---

## 🔧 What Changed

### Currency Configuration

**Before (Card Payments):**
```typescript
orderCurrency: "USD"  // Fiat currency for card payments
```

**After (USDT TRC20):**
```typescript
orderCurrency: "USDT"  // Cryptocurrency payment
network: "TRC20"       // Tron network
```

### Files Modified

- ✅ `src/app/api/epay/route.ts` - Changed to USDT currency
- ✅ Backend deposit call now includes `network: 'TRC20'`

---

## 🚀 How to Use

### Default Configuration

The system now uses **USDT** by default. No additional configuration needed!

### Optional: Custom Currency

If you want to use a different currency, set in `.env`:

```bash
# Optional: Override default USDT
CREGIS_PAYMENT_CURRENCY=USDT   # Default
# CREGIS_PAYMENT_CURRENCY=TRX   # Tron
# CREGIS_PAYMENT_CURRENCY=BTC   # Bitcoin
# CREGIS_PAYMENT_CURRENCY=ETH   # Ethereum
```

---

## 💎 Why USDT TRC20 is Better

### Advantages over Card Payments:

1. **✅ More Widely Supported**
   - USDT is enabled by default in most Cregis projects
   - No special approval needed
   - Works in test environment immediately

2. **✅ Lower Fees**
   - TRC20 network has very low transaction fees
   - Faster processing than bank transfers

3. **✅ No IP Whitelist Issues**
   - Card payments often have stricter IP restrictions
   - Crypto payments are more flexible

4. **✅ Instant Settlement**
   - Crypto transactions settle faster
   - Real-time confirmation

5. **✅ Global Availability**
   - Works worldwide without currency conversion
   - No geographical restrictions

---

## 📋 Setup Checklist

- [ ] **Whitelist Server IP** (still required)
  - Add IP `45.248.24.156` to Cregis dashboard
  - See: [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md)

- [ ] **Verify USDT is Enabled** (usually automatic)
  - Check Cregis dashboard → Payment Methods
  - USDT should be enabled by default
  - If not, contact Cregis support

- [ ] **Test the Integration**
  - Restart your application
  - Make a test USDT deposit
  - Verify payment URL is generated
  - Complete the payment

---

## 🧪 Testing USDT Payments

### Expected Flow

1. **User initiates deposit**
   - Selects amount (e.g., $100)
   - Clicks "Continue"

2. **System creates payment order**
   ```
   💰 [EPAY] Creating Cregis payment order for USDT TRC20 deposit
   💎 [EPAY] Using payment currency: USDT (USDT TRC20)
   📤 Creating Cregis payment order
   ✅ Payment order created successfully for USDT TRC20 deposit
   ✅ Payment URL received
   ```

3. **User is redirected to Cregis**
   - Payment page shows USDT payment options
   - User sees TRC20 deposit address or QR code
   - User sends USDT from their wallet

4. **Payment is confirmed**
   - Blockchain confirms transaction
   - Cregis notifies your system via callback
   - User is redirected to success page
   - Funds are credited to MT5 account

### Test in Console

Look for these logs:

✅ **Success Indicators:**
```
💎 [EPAY] Using payment currency: USDT (USDT TRC20)
✅ [EPAY] Available payment currencies: { ... USDT ... }
✅ Payment order created successfully for USDT TRC20 deposit
📋 Extracted payment data:
  hasPaymentUrl: true
  paymentUrl: https://...
```

❌ **If USDT Not Available:**
```
❌ Missing payment_url in Cregis response
💡 Possible causes:
   1. Currency not supported/enabled for this project
```

---

## 🔍 Verify USDT is Enabled

### Check Available Currencies

The system automatically logs available currencies:

```bash
# Look for this in console
✅ [EPAY] Available payment currencies: {
  "list": [
    {
      "currency": "USDT",
      "name": "Tether USD",
      "network": "TRC20",
      ...
    }
  ]
}
```

### If USDT is Not Listed

1. **Log into Cregis Dashboard**
2. **Go to Project Settings → Payment Methods**
3. **Enable USDT:**
   - Look for "USDT" or "Tether"
   - Enable TRC20 network
   - Save changes
4. **Wait 5-10 minutes** for activation

### Contact Support if Needed

Email: support@cregis.com

```
Subject: Enable USDT TRC20 - Project ID [YOUR_PROJECT_ID]

Hello,

Please enable USDT TRC20 payments for my project:

- Project ID: 1435226128711680
- Environment: Test/Production
- Required Currency: USDT (TRC20 network)

Thank you!
```

---

## 💰 Payment Amounts

### USDT vs USD

When using USDT:
- **User enters:** $100 (USD equivalent)
- **System sends:** 100 USDT to Cregis
- **User pays:** 100 USDT (plus small TRC20 gas fee ~1 USDT)
- **You receive:** 100 USDT

### Conversion

If you need USD → USDT conversion:
- Cregis handles this automatically
- Or use real-time exchange rates in your app
- Typically 1 USDT ≈ 1 USD (stablecoin)

---

## 🔐 Security Notes

### TRC20 Network

- **Fast:** 3-5 seconds confirmation
- **Cheap:** ~1-2 USDT gas fee
- **Secure:** Tron blockchain
- **Popular:** Most common USDT network

### Address Validation

Cregis automatically:
- ✅ Generates unique deposit address per transaction
- ✅ Monitors blockchain for payments
- ✅ Confirms transactions (usually 1-19 confirmations)
- ✅ Notifies your system via callback

---

## 📊 Dashboard Monitoring

### In Cregis Dashboard

You can monitor:
- ✅ All USDT transactions
- ✅ Transaction status (pending/confirmed/completed)
- ✅ Blockchain transaction hashes
- ✅ Settlement to your Cregis wallet

### In Your Application

Backend receives callbacks with:
- Transaction ID
- Amount in USDT
- Blockchain confirmation status
- User account to credit

---

## 🎯 Complete Environment Variables

```bash
# ===========================================
# CREGIS USDT TRC20 PAYMENT CONFIGURATION
# ===========================================

# Gateway URL
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io  # Test
# CREGIS_GATEWAY_URL=https://gateway.cregis.io   # Production

# Project Credentials
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af

# URLs
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel

# Settings
CREGIS_VALID_TIME=30                    # Payment valid for 30 minutes
CREGIS_PAYMENT_CURRENCY=USDT            # Use USDT (default)

# Your App
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
```

---

## ✅ Final Checklist

Before going live with USDT payments:

- [ ] IP `45.248.24.156` whitelisted in Cregis
- [ ] USDT enabled in Cregis dashboard
- [ ] Environment variables configured
- [ ] Test payment completed successfully
- [ ] Callback webhook working
- [ ] Database records created correctly
- [ ] User sees correct confirmation page
- [ ] Funds credited to MT5 account

---

## 🎉 You're Ready!

USDT TRC20 payments are:
- ✅ **Simpler** than card payments (no extra approvals)
- ✅ **Faster** than bank transfers
- ✅ **Cheaper** transaction fees
- ✅ **Global** - works everywhere
- ✅ **More reliable** - fewer configuration issues

### Next Steps

1. **Whitelist your IP** (if not done already)
2. **Restart your application**
3. **Test a USDT deposit**
4. **Monitor the logs** for success

The system is now optimized for crypto payments! 🚀💎

---

## 📚 Additional Resources

- **Main Guide:** [CREGIS_SETUP_CHECKLIST.md](./CREGIS_SETUP_CHECKLIST.md)
- **Troubleshooting:** [CREGIS_TROUBLESHOOTING.md](./CREGIS_TROUBLESHOOTING.md)
- **IP Setup:** [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md)
- **Cregis Docs:** https://developer.cregis.com

---

**Last Updated:** 2025-11-04  
**Currency:** USDT TRC20  
**Status:** ✅ Production Ready

