// app/api/cregis/deposit/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      pid,
      cid,
      currency,
      amount,
      address,
      txid,
      status,
      block_height,
      block_time,
    } = body;

    // 🟢 TODO: Save this data to your DB (for audit or wallet balance)
    console.log("✅ Deposit received:", {
      pid,
      cid,
      address,
      amount,
      currency,
      txid,
      status,
      block_height,
      block_time,
    });

    return NextResponse.json({ success: true, message: "Callback processed" });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Callback error", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
