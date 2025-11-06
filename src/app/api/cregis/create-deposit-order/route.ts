/**
 * Create Cregis Deposit Order with Dynamic Address
 * POST /api/cregis/create-deposit-order
 */

import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/cregis-payment.service";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      mt5AccountId,
      amount,
      currency = "USD",
      payerId,
      payerName,
      payerEmail,
    } = body;

    // Validate required fields
    if (!mt5AccountId || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: mt5AccountId, amount" 
        },
        { status: 400 }
      );
    }

    // Get valid time from env (in minutes, default 30)
    const validTimeMinutes = parseInt(process.env.CREGIS_VALID_TIME || "30");

    // Create payment order using Cregis Checkout API
    const result = await createPaymentOrder({
      orderAmount: amount.toString(),
      orderCurrency: currency,
      callbackUrl: `${BASE_URL}/api/cregis/payment-callback`,
      successUrl: `${BASE_URL}/deposit/success`,
      cancelUrl: `${BASE_URL}/deposit/cancel`,
      payerId: payerId || mt5AccountId,
      validTime: validTimeMinutes,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        cregisId: result.data?.cregis_id,
        checkoutUrl: result.data?.checkout_url,
        paymentInfo: result.data?.payment_info,
        expireTime: result.data?.expire_time,
        orderId: result.data?.orderId,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error creating deposit order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
