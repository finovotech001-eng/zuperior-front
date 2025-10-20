// app/api/payout-callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Payout callback received:", body);
    
    // Handle the callback - update your database, send notifications, etc.
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error in payout callback:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}