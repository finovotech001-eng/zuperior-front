# Cregis IP Whitelist Configuration Guide

## Overview

Cregis Payment Gateway requires that all API requests come from whitelisted IP addresses for security purposes. If you encounter an "IP whitelist error", you need to add your server's IP address to the Cregis whitelist.

## Error Message Example

```
IP whitelist error: Your server IP needs to be added to Cregis whitelist. 
IP: 45.248.24.156. Please contact Cregis support to add this IP to the whitelist.
```

## Your Current Server IP

**Detected IP:** `45.248.24.156`

This is the IP address that Cregis detected when your server made the API request.

---

## Solution 1: Add IP to Cregis Dashboard (Production)

### Step 1: Log into Cregis Dashboard

1. Go to your Cregis account dashboard
2. Navigate to **Project Settings** or **API Configuration**

### Step 2: Add IP Whitelist

1. Look for **IP Whitelist** or **Security Settings** section
2. Click **Add IP Address**
3. Enter your server IP: `45.248.24.156`
4. Save the configuration

### Step 3: Wait for Propagation

- Changes may take 5-15 minutes to propagate
- Test your payment integration after waiting

---

## Solution 2: Contact Cregis Support

If you cannot access the dashboard IP whitelist settings:

### Email Cregis Support

**To:** support@cregis.com (or your assigned account manager)

**Subject:** IP Whitelist Request - Project ID [YOUR_PROJECT_ID]

**Message Template:**

```
Hello Cregis Support Team,

I need to add the following IP address to the whitelist for my project:

- Project ID: [YOUR_PROJECT_ID]
- Project Name: Zuperior Trading Platform
- IP Address to Whitelist: 45.248.24.156
- Environment: [Production/Testing]

Please add this IP to our account's whitelist so we can process payments.

Thank you,
[Your Name]
[Your Company]
```

### Expected Response Time

- Typical response: 1-2 business days
- Urgent requests: Contact your account manager directly

---

## Solution 3: Development/Testing Environment

If you're in a development environment and need to test immediately:

### Option A: Use Cregis Test Environment

1. Ensure you're using Cregis **test/sandbox** credentials
2. Test environments typically have more relaxed IP restrictions
3. Check your `.env` file:

```bash
# Should point to test environment
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io

# Use test credentials
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
```

### Option B: Use a Static IP

If your server IP changes frequently (like on cloud development environments):

1. **Set up a proxy server** with a static IP
2. **Use a VPN** with a dedicated IP
3. **Deploy to a cloud service** with static IP (AWS Elastic IP, Google Cloud Static IP)

### Option C: Request Multiple IPs

If you have multiple servers or environments, provide Cregis with all IPs:

- Production server IP
- Staging server IP  
- Development server IP (if static)
- Backup server IP

---

## Troubleshooting

### My IP changed after whitelisting

**Cloud platforms** (AWS, Azure, GCP, Vercel, Netlify) often change IPs:

- **AWS**: Use Elastic IP address
- **Vercel**: Use Vercel's static IP ranges (if available) or deploy behind a proxy
- **Azure**: Configure static public IP
- **GCP**: Reserve a static external IP

### Still getting whitelist errors after adding IP

1. **Wait 15 minutes** for propagation
2. **Clear your browser cache** and cookies
3. **Verify the IP** matches exactly (check with `curl ifconfig.me` from your server)
4. **Check for load balancers** - you may need to whitelist your load balancer IP, not your server IP

### How to find my server's public IP

From your server terminal:

```bash
# Method 1
curl ifconfig.me

# Method 2
curl icanhazip.com

# Method 3
dig +short myip.opendns.com @resolver1.opendns.com
```

### IPv4 vs IPv6

- Cregis may see either your **IPv4** or **IPv6** address
- Whitelist **both** if you have both configured
- Example: `45.248.24.156` (IPv4) and `2001:db8::1` (IPv6)

---

## Environment Variables

Ensure your `.env` file has the correct Cregis configuration:

```bash
# Cregis Payment Gateway Configuration
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io
CREGIS_PAYMENT_PROJECT_ID=your_project_id
CREGIS_PAYMENT_API_KEY=your_api_key

# URLs for payment callbacks
CREGIS_SUCCESS_URL=https://yourdomain.com/deposit/success
CREGIS_CANCEL_URL=https://yourdomain.com/deposit/cancel

# Payment session validity (in MINUTES, range: 10-60)
# Default: 30 minutes if not specified
CREGIS_VALID_TIME=30

# Card payment currency code (check Cregis dashboard for supported currencies)
# Common values: USD, USDT, EUR, GBP
# Default: USD if not specified
CREGIS_CARD_CURRENCY=USD

# WaaS (Withdrawal) Configuration
CREGIS_WAAS_PROJECT_ID=your_waas_project_id
CREGIS_WAAS_API_KEY=your_waas_api_key
```

### Important: CREGIS_VALID_TIME

The `CREGIS_VALID_TIME` parameter controls how long a payment session remains valid:

- **Unit:** Minutes (not seconds!)
- **Minimum:** 10 minutes
- **Maximum:** 60 minutes
- **Default:** 30 minutes
- **Purpose:** After this time, the payment URL expires and users cannot complete the payment

Example:
- `CREGIS_VALID_TIME=30` → Payment link valid for 30 minutes
- `CREGIS_VALID_TIME=15` → Payment link valid for 15 minutes
- `CREGIS_VALID_TIME=60` → Payment link valid for 1 hour (maximum)

---

## Additional Resources

- [Cregis API Documentation](https://developer.cregis.com)
- [Cregis Support Portal](https://support.cregis.com)
- [Cregis Dashboard](https://dashboard.cregis.com)

---

## Quick Checklist

- [ ] Identify your server's public IP address
- [ ] Log into Cregis dashboard
- [ ] Add IP to whitelist in project settings
- [ ] OR email Cregis support with IP whitelist request
- [ ] Wait 15 minutes for changes to propagate
- [ ] Test payment integration
- [ ] Document the whitelisted IP for your team

---

## Need Help?

If you continue experiencing issues:

1. Check the browser console for detailed error messages
2. Check server logs: `src/lib/cregis-payment.service.ts` logs all API responses
3. Contact your DevOps team to verify server IP configuration
4. Reach out to Cregis support with your project ID and error details

---

**Last Updated:** 2025-11-04  
**Detected Server IP:** 45.248.24.156


