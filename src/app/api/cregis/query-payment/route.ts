/**
 * Query Cregis Payment Status
 * POST /api/cregis/query-payment
 */

import { NextRequest, NextResponse } from "next/server";
import { queryPaymentOrder } from "@/lib/cregis-payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { cregisId } = body;

    if (!cregisId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: cregisId" },
        { status: 400 }
      );
    }

    // Query payment order status
    const result = await queryPaymentOrder(cregisId);

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
    console.error("❌ Error in query-payment API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
