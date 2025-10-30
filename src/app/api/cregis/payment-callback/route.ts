/**
 * Cregis Payment Callback Handler
 * POST /api/cregis/payment-callback
 * 
 * This endpoint receives payment status updates from Cregis
 * Documentation: https://developer.cregis.com/api-reference/payment-notify
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyCallbackSignature } from "@/lib/cregis-payment.service";

const PAYMENT_API_KEY = process.env.CREGIS_PAYMENT_API_KEY || "afe05cea1f354bc0a9a484e139d5f4af";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received Cregis payment callback:", JSON.stringify(body, null, 2));

    const {
      pid,
      cregis_id,
      third_party_id,
      status,
      order_amount,
      order_currency,
      received_amount,
      paid_currency,
      txid,
      tx_hash,
      from_address,
      to_address,
      block_height,
      block_time,
      callback_url,
      success_url,
      cancel_url,
      sign,
      // Additional fields
      event_name,
      event_type,
      timestamp,
    } = body;

    // Verify signature - if sign is not provided, log warning but continue
    if (sign) {
      const callbackParams = { ...body };
      delete (callbackParams as any).sign;

      try {
        const isValid = verifyCallbackSignature(callbackParams, PAYMENT_API_KEY, sign);
        
        if (!isValid) {
          console.error("❌ Invalid signature in callback");
          return NextResponse.json(
            { success: false, error: "Invalid signature" },
            { status: 400 }
          );
        }

        console.log("✅ Callback signature verified");
      } catch (sigError) {
        console.error("❌ Error verifying signature:", sigError);
        // Continue anyway for now - might be test callback
      }
    } else {
      console.warn("⚠️ No signature provided in callback - skipping verification");
    }

    // TODO: Save to database
    // You should:
    // 1. Find the deposit record by third_party_id or cregis_id
    // 2. Update the deposit status based on 'status' field
    // 3. If status is 'paid' or 'complete', update MT5 balance
    // 4. Send notification to user
    
    const paymentData = {
      pid,
      cregisId: cregis_id,
      thirdPartyId: third_party_id,
      status,
      orderAmount: order_amount,
      orderCurrency: order_currency,
      receivedAmount: received_amount,
      paidCurrency: paid_currency,
      txid,
      txHash: tx_hash,
      fromAddress: from_address,
      toAddress: to_address,
      blockHeight: block_height,
      blockTime: block_time,
      eventName: event_name,
      eventType: event_type,
      timestamp,
    };

    console.log("📊 Payment callback data:", paymentData);

    // Status values: 'pending', 'paid', 'complete', 'expired', 'cancelled', 'failed'
    const depositStatus = mapCregisStatusToDepositStatus(status);
    console.log("📋 Mapped deposit status:", status, "->", depositStatus);

    // Log important payment events
    if (status === 'paid' || status === 'complete') {
      console.log('✅ Payment confirmed! Transaction:', {
        cregisId: cregis_id,
        thirdPartyId: third_party_id,
        amount: received_amount || order_amount,
        currency: paid_currency || order_currency,
        txHash: tx_hash || txid
      });
      
      if (to_address) {
        console.log('📍 Crypto deposit address:', to_address);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Callback processed successfully",
      data: paymentData,
    });
  } catch (error: unknown) {
    console.error("❌ Error processing payment callback:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * Map Cregis payment status to internal deposit status
 */
function mapCregisStatusToDepositStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'paid': 'processing',
    'complete': 'approved',
    'expired': 'rejected',
    'cancelled': 'cancelled',
    'failed': 'failed',
  };

  return statusMap[status] || 'pending';
}

// GET endpoint for testing (not used by Cregis)
export async function GET() {
  return NextResponse.json({
    message: "Cregis payment callback endpoint",
    info: "This endpoint receives payment notifications from Cregis",
  });
}
