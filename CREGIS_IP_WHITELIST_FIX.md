# Fix: Cregis IP Whitelist Error

## Error Message
```
Cregis API error: The IP is not added to the whitelist list 45.248.24.156
```

## What This Means
Cregis has IP whitelisting enabled for security. Your server IP `45.248.24.156` is not on the whitelist, so Cregis is blocking your requests.

## Solution: Add IP to Cregis Whitelist

### Step 1: Login to Cregis Dashboard
1. Go to https://dashboard.cregis.com (or your Cregis dashboard URL)
2. Login with your Cregis credentials

### Step 2: Add IP to Whitelist
1. Navigate to **Settings** or **Security Settings**
2. Find **IP Whitelist** section
3. Add your IP address: `45.248.24.156`
4. Save changes

### Step 3: For Local Development
If you're testing locally, you may also need to add:
- `127.0.0.1` (localhost)
- `0.0.0.0` (all IPs - less secure, only for testing)

## Alternative Solution: Disable IP Whitelisting (Not Recommended)

If you can't access whitelist settings:
1. Contact Cregis support
2. Ask them to add `45.248.24.156` to your whitelist
3. Or temporarily disable IP whitelisting for your account (testing only)

## How to Find Your Server IP

The error shows your server IP is: `45.248.24.156`

If this changes, you can find your current IP by:
1. Check the error message (it will show the IP being blocked)
2. Or run this in your terminal: `curl ifconfig.me`

## Alternative: Use Cregis Development Mode

Some Cregis accounts have a "development mode" that bypasses IP restrictions:
1. Check Cregis dashboard for "Development Mode" or "Test Mode"
2. Enable it if available
3. This allows requests from any IP address

## Contact Cregis Support

If you need help:
1. Email: support@cregis.com
2. Mention:
   - Your Project ID: `1435226128711680` (Payment Engine)
   - IP to whitelist: `45.248.24.156`
   - Reason: Local development and testing

## Temporary Workaround

While waiting for IP whitelist update, you can:
1. Deploy to a server with a static IP
2. Add that IP to Cregis whitelist
3. Test from the deployed environment

## Verification

Once IP is whitelisted:
1. Restart your dev server
2. Try the card payment again
3. Error should be resolved
