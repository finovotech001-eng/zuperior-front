/**
 * Create Cregis Payment Order
 * POST /api/cregis/create-payment
 */

import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/cregis-payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      orderAmount,
      orderCurrency,
      callbackUrl,
      successUrl,
      cancelUrl,
      payerId,
      validTime,
    } = body;

    // Validate required fields
    if (!orderAmount || !orderCurrency || !callbackUrl || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: orderAmount, orderCurrency, callbackUrl, successUrl, cancelUrl" 
        },
        { status: 400 }
      );
    }

    // Create payment order using Cregis service
    const result = await createPaymentOrder({
      orderAmount,
      orderCurrency,
      callbackUrl,
      successUrl,
      cancelUrl,
      payerId,
      validTime: validTime || 600, // Default 10 minutes
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: unknown) {
    console.error("❌ Error in create-payment API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
