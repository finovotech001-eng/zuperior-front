/**
 * Diagnostic endpoint to check which currencies are enabled in Cregis project
 * Reference: https://developer.cregis.com/api-reference/request-apis/global/currency-query
 */

import { NextResponse } from "next/server";
import crypto from "crypto";

const WAAS_CONFIG = {
  PROJECT_ID: process.env.CREGIS_WAAS_PROJECT_ID || "1435226266132480",
  API_KEY: process.env.CREGIS_WAAS_API_KEY || "f2ce7723128e4fdb88daf9461fce9562",
  GATEWAY_URL: process.env.CREGIS_GATEWAY_URL || "https://t-rwwagnvw.cregis.io",
};

function generateSignature(
  params: Record<string, unknown>,
  secretKey: string
): string {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );
  const sorted = filtered.sort(([a], [b]) => a.localeCompare(b));
  const stringToSign = secretKey + sorted.map(([k, v]) => `${k}${v}`).join("");
  return crypto.createHash("md5").update(stringToSign).digest("hex").toLowerCase();
}

export async function GET() {
  try {
    console.log('🔍 [CHECK-CURRENCIES] Checking available currencies in Cregis project...');
    
    const pid = Number(WAAS_CONFIG.PROJECT_ID);
    const nonce = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();

    const payload: Record<string, string | number> = {
      pid,
      nonce,
      timestamp,
    };

    const sign = generateSignature(payload, WAAS_CONFIG.API_KEY);
    const requestData = { ...payload, sign };

    console.log('📤 [CHECK-CURRENCIES] Requesting from:', `${WAAS_CONFIG.GATEWAY_URL}/api/v1/coins`);
    console.log('📤 [CHECK-CURRENCIES] Request payload:', requestData);

    const response = await fetch(`${WAAS_CONFIG.GATEWAY_URL}/api/v1/coins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CHECK-CURRENCIES] HTTP error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `HTTP ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📥 [CHECK-CURRENCIES] Response:', JSON.stringify(data, null, 2));

    if (data.code !== "00000") {
      console.error('❌ [CHECK-CURRENCIES] API error:', data);
      return NextResponse.json(
        { 
          error: `Cregis error: ${data.msg}`,
          code: data.code,
          details: data
        },
        { status: 400 }
      );
    }

    // Format the response for easy reading
    const payoutCoins = data.data?.payout_coins || [];
    const addressCoins = data.data?.address_coins || [];

    console.log('✅ [CHECK-CURRENCIES] Found currencies:');
    console.log('  Payout coins:', payoutCoins.length);
    console.log('  Address coins:', addressCoins.length);

    return NextResponse.json({
      success: true,
      message: "Successfully retrieved currency list",
      data: {
        payout_coins: payoutCoins,
        address_coins: addressCoins,
        summary: {
          total_payout_currencies: payoutCoins.length,
          total_address_currencies: addressCoins.length,
          payout_coin_names: payoutCoins.map((c: any) => c.coin_name),
          address_coin_names: addressCoins.map((c: any) => c.coin_name),
        }
      }
    });

  } catch (error: unknown) {
    console.error("❌ [CHECK-CURRENCIES] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to check currencies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

