# Cregis Payment Engine Integration

This document describes the Cregis payment integration for handling deposits and withdrawals.

## Configuration

Add the following environment variables to your `.env.local` file:

```bash
# Cregis Payment Engine Configuration (Deposits)
CREGIS_PAYMENT_PROJECT_ID=1435226128711680
CREGIS_PAYMENT_API_KEY=afe05cea1f354bc0a9a484e139d5f4af
CREGIS_GATEWAY_URL=https://t-rwwagnvw.cregis.io

# Cregis WaaS Configuration (Withdrawals)
CREGIS_WAAS_PROJECT_ID=1435226266132480
CREGIS_WAAS_API_KEY=f2ce7723128e4fdb88daf9461fce9562

# Payment URLs
CREGIS_SUCCESS_URL=http://localhost:3000/deposit/success
CREGIS_CANCEL_URL=http://localhost:3000/deposit/cancel
CREGIS_VALID_TIME=600

# Application Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Overview

### Payment Engine (Deposits)
- **Service**: `src/lib/cregis-payment.service.ts`
- **API Routes**:
  - `POST /api/cregis/create-payment` - Create payment order
  - `POST /api/cregis/query-payment` - Query payment status
  - `POST /api/cregis/payment-callback` - Handle payment callbacks

### WaaS (Withdrawals)
- **Function**: `createWithdrawalOrder()` in service
- Use when implementing withdrawal functionality

## API Flow

### Creating a Payment Order

```typescript
POST /api/cregis/create-payment
Body: {
  orderAmount: "100",
  orderCurrency: "USDT",
  callbackUrl: "https://yourapp.com/api/cregis/payment-callback",
  successUrl: "https://yourapp.com/deposit/success",
  cancelUrl: "https://yourapp.com/deposit/cancel",
  payerId?: "optional",
  validTime?: 600 // seconds
}

Response: {
  success: true,
  data: {
    cregisId: "...",
    paymentUrl: "...",
    qrCode: "...",
    expireTime: "...",
    orderId: "..."
  }
}
```

### Payment Callback

When Cregis processes a payment, it sends a POST request to your callback URL with the following structure:

```typescript
POST /api/cregis/payment-callback
Body: {
  pid: "1435226128711680",
  cregis_id: "...",
  third_party_id: "...",
  status: "paid" | "complete" | "pending" | "expired" | "cancelled" | "failed",
  order_amount: "100",
  order_currency: "USDT",
  received_amount: "100.5",
  paid_currency: "USDT",
  txid: "...",
  tx_hash: "...",
  from_address: "...",
  to_address: "...",
  block_height: 12345,
  block_time: 1234567890,
  sign: "...", // signature for verification
  // ... other fields
}
```

The callback handler will:
1. Verify the signature
2. Update the deposit status in your database
3. Process the payment if status is 'paid' or 'complete'
4. Return success response

## Status Mapping

Cregis statuses are mapped to internal deposit statuses:

| Cregis Status | Internal Status |
|--------------|----------------|
| pending | pending |
| paid | processing |
| complete | approved |
| expired | rejected |
| cancelled | cancelled |
| failed | failed |

## Documentation

Full API documentation: https://developer.cregis.com/api-reference/request

## Security

- All API requests are signed using MD5 hash
- Callback signatures are verified to ensure authenticity
- API keys should be kept secure and never exposed to frontend

## Testing

To test the integration:

1. Ensure environment variables are set
2. Create a payment order via `/api/cregis/create-payment`
3. Use the returned `paymentUrl` or `qrCode` to make a payment
4. Cregis will send a callback to your callback URL
5. Check the callback was received and processed correctly
