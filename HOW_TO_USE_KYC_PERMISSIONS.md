# How to Use KYC Upload Permissions

## ✅ What Changed

1. **Pending shows "Pending"** (not "Failed")
2. **Can upload document** when status is "Not Verified"
3. **Can upload address** when document is "Pending" OR "Verified"

## 🔧 Use the Hook in Your Upload Forms

### Import the Hook

```tsx
import { useKYCPermissions } from '@/hooks/useKYCPermissions';
```

### Example: Document Upload Form

```tsx
"use client";

import { useState } from 'react';
import { useKYCPermissions } from '@/hooks/useKYCPermissions';
import { Button } from '@/components/ui/button';
import { documentVerification } from '@/services/documentVerification';

export default function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Get permissions
  const { canUploadDocument, documentStatus, loading } = useKYCPermissions();

  const handleSubmit = async () => {
    if (!file || !canUploadDocument) return;
    
    setUploading(true);
    try {
      await documentVerification({
        file,
        firstName: 'John',
        lastName: 'Doe',
        documentType: 'passport'
      });
      
      alert('Document submitted successfully!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2>Upload Identity Document</h2>
      
      {/* Status Message */}
      {documentStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          ⏳ Your document is being verified. This usually takes 1-5 minutes.
        </div>
      )}
      
      {documentStatus === 'verified' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          ✅ Your identity document has been verified!
        </div>
      )}
      
      {/* Upload Form - Only show if can upload */}
      {canUploadDocument && (
        <>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!file || uploading || loading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </>
      )}
      
      {/* Show message if cannot upload */}
      {!canUploadDocument && documentStatus === 'pending' && (
        <p className="text-sm text-gray-600">
          Please wait for verification to complete before uploading again.
        </p>
      )}
    </div>
  );
}
```

### Example: Address Upload Form

```tsx
"use client";

import { useState } from 'react';
import { useKYCPermissions } from '@/hooks/useKYCPermissions';
import { Button } from '@/components/ui/button';
import { addressVerification } from '@/services/addressVerification';

export default function AddressUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Get permissions
  const { canUploadAddress, addressStatus, documentStatus, loading } = useKYCPermissions();

  const handleSubmit = async () => {
    if (!file || !canUploadAddress) return;
    
    setUploading(true);
    try {
      await addressVerification({
        file,
        first_name: 'John',
        last_name: 'Doe',
        full_address: '123 Main St, City',
        selected_document_type: 'utility_bill'
      });
      
      alert('Address proof submitted successfully!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2>Upload Address Proof</h2>
      
      {/* Status Messages */}
      {addressStatus === 'locked' && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          🔒 Complete identity document verification first.
          {documentStatus === 'pending' && (
            <p className="mt-2 text-sm">
              Your identity document is being verified. You'll be able to upload 
              address proof once it's submitted (you don't need to wait for approval).
            </p>
          )}
        </div>
      )}
      
      {addressStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          ⏳ Your address proof is being verified. This usually takes 1-5 minutes.
        </div>
      )}
      
      {addressStatus === 'verified' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          ✅ Your address has been verified!
        </div>
      )}
      
      {/* Upload Form - Only show if can upload */}
      {canUploadAddress && (
        <>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!file || uploading || loading}
          >
            {uploading ? 'Uploading...' : 'Upload Address Proof'}
          </Button>
        </>
      )}
      
      {/* Show message if cannot upload */}
      {!canUploadAddress && addressStatus === 'pending' && (
        <p className="text-sm text-gray-600">
          Please wait for verification to complete.
        </p>
      )}
    </div>
  );
}
```

### Example: Combined Form with Both

```tsx
"use client";

import { useKYCPermissions } from '@/hooks/useKYCPermissions';
import { KYCStatusDisplay } from '@/components/kyc/KYCStatusDisplay';

export default function KYCVerificationPage() {
  const { 
    canUploadDocument, 
    canUploadAddress, 
    documentStatus,
    addressStatus,
    isFullyVerified,
    loading 
  } = useKYCPermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isFullyVerified) {
    return (
      <div className="container p-6">
        <h1>Account Verification</h1>
        <KYCStatusDisplay />
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            🎉 Verification Complete!
          </h2>
          <p className="text-green-600">
            Your account is fully verified. You can now access all features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-6">
      <h1 className="text-2xl font-bold">Account Verification</h1>
      
      {/* Status Display Component */}
      <KYCStatusDisplay />
      
      {/* Document Upload Section */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Step 1: Identity Document</h2>
        
        {canUploadDocument ? (
          <div>
            {/* Your document upload form */}
            <p className="text-blue-600 mb-4">
              ✓ You can now upload your identity document
            </p>
            {/* Upload form here */}
          </div>
        ) : documentStatus === 'pending' ? (
          <div className="p-4 bg-yellow-50 rounded">
            ⏳ Your document is being verified...
          </div>
        ) : documentStatus === 'verified' ? (
          <div className="p-4 bg-green-50 rounded">
            ✅ Identity document verified!
          </div>
        ) : null}
      </div>
      
      {/* Address Upload Section */}
      <div className={`border rounded-lg p-6 ${!canUploadAddress ? 'opacity-60' : ''}`}>
        <h2 className="text-xl font-semibold mb-4">Step 2: Address Proof</h2>
        
        {canUploadAddress ? (
          <div>
            {/* Your address upload form */}
            <p className="text-blue-600 mb-4">
              ✓ You can now upload your address proof
            </p>
            {/* Upload form here */}
          </div>
        ) : addressStatus === 'locked' ? (
          <div className="p-4 bg-gray-50 rounded">
            🔒 Complete Step 1 first
          </div>
        ) : addressStatus === 'pending' ? (
          <div className="p-4 bg-yellow-50 rounded">
            ⏳ Your address proof is being verified...
          </div>
        ) : addressStatus === 'verified' ? (
          <div className="p-4 bg-green-50 rounded">
            ✅ Address verified!
          </div>
        ) : null}
      </div>
    </div>
  );
}
```

## 📊 Hook Return Values

The `useKYCPermissions()` hook returns:

```typescript
{
  canUploadDocument: boolean;  // true if user can upload document now
  canUploadAddress: boolean;   // true if user can upload address now
  documentStatus: 'not-submitted' | 'pending' | 'verified' | 'declined';
  addressStatus: 'not-submitted' | 'pending' | 'verified' | 'declined' | 'locked';
  isFullyVerified: boolean;    // true only when BOTH verified
  loading: boolean;            // true while fetching initial data
}
```

## 🎯 Logic Flow

```
User State → Can Upload Document → Can Upload Address

Not Verified     ✅ YES                 ❌ NO (locked)
Document Pending ❌ NO (wait)          ✅ YES (can upload)
Document Verified ❌ NO (done)         ✅ YES (if not done)
Address Pending   N/A                   ❌ NO (wait)
Both Verified     ❌ NO (done)          ❌ NO (done)
```

## ✅ Status Display

| Status | Badge Color | Text | Meaning |
|--------|-------------|------|---------|
| Not Submitted | Grey | Required | Can upload |
| Pending | Yellow | Pending | Being verified (1-5 min) |
| Verified | Green | Verified | Complete ✅ |
| Declined | Red | Declined | Rejected, can reupload |
| Locked | Grey | Locked | Need to complete previous step |

## 🔄 Auto-Refresh

The hook automatically:
- Fetches KYC status on mount
- Polls for updates every 30 seconds
- Updates permissions in real-time

No manual refresh needed!

## 🐛 Common Scenarios

### Scenario 1: Brand New User
```
Document: not-submitted → canUploadDocument = true
Address: locked → canUploadAddress = false
```

### Scenario 2: Document Uploaded (Pending)
```
Document: pending → canUploadDocument = false
Address: not-submitted → canUploadAddress = true ✅
```

### Scenario 3: Document Verified
```
Document: verified → canUploadDocument = false
Address: not-submitted → canUploadAddress = true ✅
```

### Scenario 4: Both Pending
```
Document: verified
Address: pending → canUploadAddress = false
```

### Scenario 5: Fully Verified
```
Document: verified
Address: verified
isFullyVerified = true ✅
```

## 📝 Best Practices

1. **Always check `loading`** before showing upload buttons
2. **Show helpful status messages** based on status
3. **Disable buttons** when cannot upload
4. **Use the `<KYCStatusDisplay />` component** for consistent UI
5. **Don't ask user to refresh** - it auto-updates

---

**Status:** ✅ Updated with correct logic!

