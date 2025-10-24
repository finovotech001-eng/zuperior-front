# Frontend Updates - KYC & Email System

## 🎯 What Was Changed

### 1. KYC Document Verification Route
**File:** `src/app/api/kyc/document/route.ts`

**Before:** Called Shufti Pro API directly from Next.js  
**After:** Forwards requests to backend API

**Changes:**
- Now calls `POST /api/kyc/submit-document` on backend
- Backend handles Shufti Pro integration
- Simplified error handling
- Better authentication flow

### 2. KYC Address Verification Route
**File:** `src/app/api/kyc/address/route.ts`

**Before:** Called Shufti Pro API directly from Next.js  
**After:** Forwards requests to backend API

**Changes:**
- Now calls `POST /api/kyc/submit-address` on backend
- Backend handles Shufti Pro integration
- Consistent with document verification flow

### 3. New KYC Status Display Component ✨
**File:** `src/components/kyc/KYCStatusDisplay.tsx`

**Features:**
- ✅ Shows **GREEN** only when BOTH document and address are verified
- 🟡 Shows **YELLOW** for pending or partially verified
- 🔴 Shows **RED** for declined verification
- ⚫ Shows **GREY** for not started
- 🔄 Auto-refreshes every 30 seconds
- 📧 Shows rejection reasons
- 💡 Provides helpful next steps

**Usage:**
```tsx
import { KYCStatusDisplay } from '@/components/kyc/KYCStatusDisplay';

function MyPage() {
  return (
    <div>
      <KYCStatusDisplay />
    </div>
  );
}
```

## 🔄 How the New Flow Works

### Document Submission Flow:

```
User uploads document
        ↓
Frontend → /api/kyc/document (Next.js)
        ↓
Next.js → http://localhost:5000/api/kyc/submit-document (Backend)
        ↓
Backend → Shufti Pro API
        ↓
Backend → Stores status in database
        ↓
Shufti Pro → Webhook callback to backend
        ↓
Backend → Updates status
        ↓
Frontend polls /api/kyc/status every 30s
        ↓
Shows green ONLY when fully verified
```

## ✅ Status Display Logic

The new component uses this logic:

```typescript
// ONLY show green when BOTH are verified
if (
  kycData.verificationStatus === 'Verified' &&
  kycData.isDocumentVerified === true &&
  kycData.isAddressVerified === true
) {
  // Show GREEN ✅
}

// Show yellow for pending or partial
else if (
  kycData.verificationStatus === 'Pending' ||
  kycData.verificationStatus === 'Partially Verified'
) {
  // Show YELLOW ⏳
}

// Show red for declined
else if (kycData.verificationStatus === 'Declined') {
  // Show RED ❌
}

// Default - not started
else {
  // Show GREY
}
```

## 📦 How to Use

### Option 1: Use the New Component (Recommended)

Replace your existing KYC status display with:

```tsx
import { KYCStatusDisplay } from '@/components/kyc/KYCStatusDisplay';

export default function KYCPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Verification</h1>
      
      {/* This component handles everything */}
      <KYCStatusDisplay />
      
      {/* Your upload forms below */}
      {/* ... */}
    </div>
  );
}
```

### Option 2: Update Your Existing Components

If you want to keep your existing components, update them with the correct status logic:

```tsx
// In your existing KYC status component
const isFullyVerified = (kyc: KYCData) => {
  return kyc.verificationStatus === 'Verified' &&
         kyc.isDocumentVerified === true &&
         kyc.isAddressVerified === true;
};

// Use in your JSX
{isFullyVerified(kycData) ? (
  <Badge className="bg-green-500">✅ Fully Verified</Badge>
) : kycData.verificationStatus === 'Declined' ? (
  <Badge className="bg-red-500">❌ Declined</Badge>
) : (
  <Badge className="bg-yellow-500">⏳ Pending</Badge>
)}
```

### Add Polling for Real-time Updates

```tsx
import { useEffect, useState } from 'react';

function YourComponent() {
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/kyc/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setKycStatus(data.data);
      }
    };

    // Fetch immediately
    fetchStatus();
    
    // Then poll every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // ... rest of your component
}
```

## 🎨 Visual Changes

The new component provides:

1. **Clear Status Cards**
   - Overall status badge (green/yellow/red/grey)
   - Individual status for document and address
   - Icons for better visual feedback

2. **Real-time Updates**
   - Automatically checks status every 30 seconds
   - No page refresh needed

3. **Helpful Messages**
   - Shows rejection reasons
   - Provides next steps
   - Success message when fully verified

4. **Loading States**
   - Spinner while loading
   - Error messages if something fails

## 🔧 Configuration

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Issue: Status not updating
**Solution:** Check if backend is running and webhook callback URL is configured

### Issue: Shows "Authentication required"
**Solution:** Make sure user is logged in and token is in localStorage

### Issue: Status stays yellow forever
**Solution:** 
- Check Shufti Pro credentials in backend
- Verify webhook URL is publicly accessible
- Check backend logs for webhook errors

## 📊 Testing

### Test Document Submission
```javascript
// Should now work through backend
const response = await documentVerification({
  file: uploadedFile,
  firstName: "John",
  lastName: "Doe",
  documentType: "passport"
});

// Backend handles Shufti Pro API call
// Status stored in database
```

### Check Status
```javascript
const token = localStorage.getItem('userToken');
const response = await fetch('/api/kyc/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
console.log('KYC Status:', data.data);
```

## 📝 Migration Guide

If you have existing KYC pages:

1. **Keep your upload forms** - they don't need changes
2. **Replace status display** - use new `<KYCStatusDisplay />` component
3. **Update status checks** - use the new logic (green only when both verified)
4. **Add polling** - copy the useEffect hook above

## ✨ Benefits

1. **Centralized Logic** - Shufti Pro API calls in one place (backend)
2. **Better Security** - Credentials not exposed in frontend
3. **Accurate Status** - Green shown only when fully verified
4. **Real-time Updates** - Auto-polling every 30 seconds
5. **Better UX** - Clear status indicators and helpful messages

## 🆘 Need Help?

- Check backend documentation: `zuperior-server/KYC_VERIFICATION_GUIDE.md`
- Review backend implementation: `zuperior-server/KYC_IMPLEMENTATION_SUMMARY.md`
- Complete setup guide: `zuperior-server/COMPLETE_IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** October 23, 2024  
**Status:** ✅ Ready to Use

