/**
 * Check available currencies for Payment Engine API
 * Reference: https://developer.cregis.com/api-reference/request-apis/payment-engine/order-currency-list
 */

import { NextResponse } from "next/server";
import crypto from "crypto";

const PAYMENT_CONFIG = {
  PROJECT_ID: process.env.CREGIS_PAYMENT_PROJECT_ID || "1435226128711680",
  API_KEY: process.env.CREGIS_PAYMENT_API_KEY || "afe05cea1f354bc0a9a484e139d5f4af",
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
    console.log('🔍 [PAYMENT-CURRENCIES] Checking Payment Engine available currencies...');
    
    const pid = Number(PAYMENT_CONFIG.PROJECT_ID);
    const nonce = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();

    const payload: Record<string, string | number> = {
      pid,
      nonce,
      timestamp,
    };

    const sign = generateSignature(payload, PAYMENT_CONFIG.API_KEY);
    const requestData = { ...payload, sign };

    console.log('📤 [PAYMENT-CURRENCIES] Requesting from:', `${PAYMENT_CONFIG.GATEWAY_URL}/api/v2/checkout/order_currency/list`);

    const response = await fetch(`${PAYMENT_CONFIG.GATEWAY_URL}/api/v2/checkout/order_currency/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [PAYMENT-CURRENCIES] HTTP error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `HTTP ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📥 [PAYMENT-CURRENCIES] Response:', JSON.stringify(data, null, 2));

    if (data.code !== "00000") {
      console.error('❌ [PAYMENT-CURRENCIES] API error:', data);
      return NextResponse.json(
        { 
          error: `Cregis error: ${data.msg}`,
          code: data.code,
          details: data
        },
        { status: 400 }
      );
    }

    // Format response
    const currencies = data.data?.list || [];
    
    console.log('✅ [PAYMENT-CURRENCIES] Payment Engine currencies:', currencies.length);
    
    return NextResponse.json({
      success: true,
      message: "Successfully retrieved Payment Engine currency list",
      data: {
        currencies: currencies,
        summary: {
          total_currencies: currencies.length,
          currency_names: currencies.map((c: any) => c.currency || c.name || c),
          has_usdt: currencies.some((c: any) => 
            (c.currency || c.name || '').toUpperCase().includes('USDT')
          ),
        }
      }
    });

  } catch (error: unknown) {
    console.error("❌ [PAYMENT-CURRENCIES] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to check Payment Engine currencies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

