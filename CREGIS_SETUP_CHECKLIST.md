# Cregis Payment Gateway - Complete Setup Checklist

## 🎯 Quick Start Guide

Follow this checklist to get Cregis payment integration working from start to finish.

---

## ✅ Step 1: Cregis Account Setup

- [ ] **Sign up for Cregis account** at https://dashboard.cregis.com
- [ ] **Verify your email** and complete account setup
- [ ] **Create a project** in the dashboard
  - Note down your **Project ID**
  - Note down your **API Key**
- [ ] **Choose environment:**
  - Use **Test/Sandbox** for development
  - Use **Production** for live transactions

---

## ✅ Step 2: Enable Payment Methods

- [ ] **Log into Cregis Dashboard**
- [ ] **Navigate to Project Settings** → **Payment Methods**
- [ ] **Enable payment methods you need:**
  - [ ] Card Payments (for credit/debit cards)
  - [ ] Crypto Payments (USDT, TRX, BTC, ETH, etc.)
- [ ] **Configure currencies:**
  - [ ] USD (for card payments)
  - [ ] USDT (for crypto payments)
  - [ ] Other currencies as needed
- [ ] **Save configuration** and wait 5-10 minutes for activation

**Note:** If you don't see Card Payment options, contact Cregis support to enable them.

---

## ✅ Step 3: Whitelist Your Server IP

### Find Your Server IP

```bash
# From your server, run:
curl ifconfig.me
```

Example output: `45.248.24.156`

### Add IP to Cregis

**Option A: Self-Service (if available)**
- [ ] Log into Cregis Dashboard
- [ ] Go to **Project Settings** → **Security** → **IP Whitelist**
- [ ] Click **Add IP Address**
- [ ] Enter your server IP: `45.248.24.156`
- [ ] Save and wait 5-15 minutes

**Option B: Contact Support**
- [ ] Email support@cregis.com
- [ ] Subject: "IP Whitelist Request - Project [YOUR_PROJECT_ID]"
- [ ] Include: Project ID, Server IP, Environment
- [ ] Wait for confirmation (usually 1-2 business days)

**📖 Detailed guide:** [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md)

---

## ✅ Step 4: Configure Environment Variables

Create or update your `.env` file:

```bash
# ===========================================
# CREGIS PAYMENT GATEWAY CONFIGURATION
# ===========================================

# Gateway URL (use test URL for development)
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io  # Test environment
# CREGIS_GATEWAY_URL=https://gateway.cregis.io   # Production (commented out)

# Project credentials (get from Cregis dashboard)
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af

# Payment flow URLs
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel

# Payment session settings
CREGIS_VALID_TIME=30              # Payment link valid for 30 minutes (10-60 range)
CREGIS_CARD_CURRENCY=USD          # Currency for card payments

# WaaS Configuration (for crypto withdrawals)
CREGIS_WAAS_PROJECT_ID=1435226266132480
CREGIS_WAAS_API_KEY=f2ce7723128e4fdb88daf9461fce9562

# Your app's base URL (for callback generation)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Backend API URL (if separate backend)
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
```

### Variables Checklist

- [ ] `CREGIS_GATEWAY_URL` - Set to test or production URL
- [ ] `CREGIS_PAYMENT_PROJECT_ID` - Your project ID from dashboard
- [ ] `CREGIS_PAYMENT_API_KEY` - Your API key from dashboard
- [ ] `CREGIS_SUCCESS_URL` - Where to redirect after successful payment
- [ ] `CREGIS_CANCEL_URL` - Where to redirect after cancelled payment
- [ ] `CREGIS_VALID_TIME` - Payment expiration (10-60 minutes)
- [ ] `CREGIS_CARD_CURRENCY` - Currency code (USD, EUR, GBP, etc.)
- [ ] `NEXT_PUBLIC_BASE_URL` - Your application URL

---

## ✅ Step 5: Test the Integration

### Test Card Payment Flow

1. **Start your application:**
   ```bash
   npm run dev
   ```

2. **Initiate a test payment:**
   - Navigate to deposit page
   - Select "Credit/Debit Card"
   - Enter test amount (e.g., $100)
   - Click "Continue"

3. **Check console logs:**
   ```
   🚀 [EPAY] Starting card payment request processing
   📋 [EPAY] Fetching available payment currencies from Cregis...
   ✅ [EPAY] Available payment currencies: [...]
   📝 [EPAY] Using card currency: USD
   📤 Creating Cregis payment order
   📥 Cregis API response: {...}
   ✅ Payment order created successfully
   ✅ Payment URL received
   ```

4. **Verify payment URL:**
   - Should redirect to Cregis payment page
   - Payment page should load without errors
   - Should show payment options

### Test Crypto Payment Flow

Use the `/api/checkout` endpoint instead of `/api/epay` for crypto payments.

---

## ✅ Step 6: Common Issues & Solutions

### Issue 1: IP Whitelist Error

**Error:** `IP whitelist error: Your server IP needs to be added to Cregis whitelist`

**Solution:** 
- [ ] Add your server IP to Cregis dashboard (see Step 3)
- [ ] Wait 15 minutes for propagation
- [ ] Retry payment

**📖 Guide:** [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md)

### Issue 2: Valid Time Error

**Error:** `Please input in minutes. Minimum is 10 minutes, maximum 60 minutes`

**Solution:**
- [ ] Set `CREGIS_VALID_TIME=30` in `.env` file
- [ ] Restart your application
- [ ] Verify value is between 10-60

### Issue 3: No Payment URL

**Error:** `No payment URL received from server`

**Solution:**
- [ ] Check console for available currencies
- [ ] Verify `CREGIS_CARD_CURRENCY` matches available options
- [ ] Enable card payments in Cregis dashboard
- [ ] Contact Cregis support if needed

**📖 Full guide:** [CREGIS_TROUBLESHOOTING.md](./CREGIS_TROUBLESHOOTING.md)

### Issue 4: Signature Verification Failed

**Error:** `Sign verification failed`

**Solution:**
- [ ] Verify `CREGIS_PAYMENT_API_KEY` is correct
- [ ] Ensure no extra spaces in `.env` values
- [ ] Check you're using correct credentials for your environment
- [ ] Regenerate API key in Cregis dashboard if needed

---

## ✅ Step 7: Monitor & Debug

### Enable Debug Logging

The integration automatically logs detailed information. Check:

1. **Browser Console** (F12 → Console tab)
   - Look for `💳 [EPAY]` prefixed logs
   - Check for error messages with `❌`

2. **Server Logs**
   - Check terminal where your app is running
   - Look for Cregis API request/response logs

3. **Network Tab** (F12 → Network tab)
   - Filter by `/api/epay`
   - Inspect request payload and response

### Key Log Messages

✅ **Success indicators:**
```
✅ [EPAY] Available payment currencies
✅ [EPAY] Cregis payment order created successfully
✅ Payment URL received
```

❌ **Error indicators:**
```
❌ Cregis API HTTP error
❌ Missing payment_url in Cregis response
❌ IP whitelist error
```

---

## ✅ Step 8: Production Deployment

### Before Going Live

- [ ] **Update environment variables** to production values:
  - [ ] Change `CREGIS_GATEWAY_URL` to production URL
  - [ ] Use **production** Project ID and API Key
  - [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
  
- [ ] **Whitelist production server IP:**
  - [ ] Get production server IP
  - [ ] Add to Cregis dashboard
  - [ ] Wait for confirmation

- [ ] **Test in production:**
  - [ ] Make a small test payment
  - [ ] Verify webhook callbacks work
  - [ ] Test success and cancel flows
  
- [ ] **Enable production payment methods:**
  - [ ] Verify card payments are enabled in production
  - [ ] Test with real card (small amount)
  - [ ] Verify funds are received

- [ ] **Set up monitoring:**
  - [ ] Monitor payment success rates
  - [ ] Set up alerts for failed payments
  - [ ] Track webhook delivery

---

## 📚 Documentation Reference

- **Setup Guide:** This file (CREGIS_SETUP_CHECKLIST.md)
- **IP Whitelisting:** [CREGIS_WHITELIST_SETUP.md](./CREGIS_WHITELIST_SETUP.md)
- **Troubleshooting:** [CREGIS_TROUBLESHOOTING.md](./CREGIS_TROUBLESHOOTING.md)
- **Cregis API Docs:** https://developer.cregis.com
- **Cregis Dashboard:** https://dashboard.cregis.com

---

## 🆘 Getting Help

### From Cregis

- **Email:** support@cregis.com
- **Documentation:** https://developer.cregis.com
- **Dashboard:** https://dashboard.cregis.com

### When Requesting Support

Include this information:

1. **Project ID:** [your project ID]
2. **Environment:** Test/Production
3. **Error message:** Copy full error from console
4. **Server IP:** Your server's public IP
5. **Timestamp:** When error occurred
6. **Request ID:** From API response (if available)
7. **What you've tried:** Steps you've already taken

---

## ✨ Success Criteria

Your Cregis integration is working correctly when:

- ✅ Payment initiation succeeds without errors
- ✅ User is redirected to Cregis payment page
- ✅ Payment page loads and shows payment options
- ✅ Test payments complete successfully
- ✅ Webhooks are received and processed
- ✅ User is redirected back to your app
- ✅ Payment status is updated in your database

---

**Last Updated:** 2025-11-04  
**Version:** 1.0  
**Status:** Production Ready

**Need help?** See [CREGIS_TROUBLESHOOTING.md](./CREGIS_TROUBLESHOOTING.md) for detailed error solutions.

