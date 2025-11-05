/**
 * Test WaaS API connectivity and credentials
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
  const results: any = {
    config: {
      PROJECT_ID: WAAS_CONFIG.PROJECT_ID,
      API_KEY_PREFIX: WAAS_CONFIG.API_KEY.substring(0, 8) + "...",
      GATEWAY_URL: WAAS_CONFIG.GATEWAY_URL,
    },
    tests: [],
  };

  // Test 1: Get project coins (read-only, should work)
  try {
    console.log('🧪 [TEST-WAAS] Testing /api/v1/coins (read-only)...');
    
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

    const response = await fetch(`${WAAS_CONFIG.GATEWAY_URL}/api/v1/coins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    
    results.tests.push({
      endpoint: '/api/v1/coins',
      status: response.status,
      success: response.ok && data.code === "00000",
      code: data.code,
      msg: data.msg,
      hasData: !!data.data,
    });

    console.log('✅ [TEST-WAAS] /api/v1/coins result:', {
      status: response.status,
      code: data.code,
    });
  } catch (error) {
    results.tests.push({
      endpoint: '/api/v1/coins',
      error: error instanceof Error ? error.message : String(error),
    });
    console.error('❌ [TEST-WAAS] /api/v1/coins failed:', error);
  }

  // Test 2: Generate address (write, might fail with 403)
  try {
    console.log('🧪 [TEST-WAAS] Testing /api/v1/address (write)...');
    
    const pid = Number(WAAS_CONFIG.PROJECT_ID);
    const nonce = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const testThirdPartyId = `TEST_${Date.now()}`;

    const payload: Record<string, string | number> = {
      pid,
      currency: "195@TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      third_party_id: testThirdPartyId,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cregis/deposit-callback`,
      nonce,
      timestamp,
    };

    const sign = generateSignature(payload, WAAS_CONFIG.API_KEY);
    const requestData = { ...payload, sign };

    console.log('📋 [TEST-WAAS] Request payload:', JSON.stringify(requestData, null, 2));

    const response = await fetch(`${WAAS_CONFIG.GATEWAY_URL}/api/v1/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { rawResponse: responseText };
    }
    
    results.tests.push({
      endpoint: '/api/v1/address',
      status: response.status,
      success: response.ok && data.code === "00000",
      code: data.code,
      msg: data.msg,
      hasAddress: !!data.data?.address,
      rawResponse: response.status === 403 ? responseText : undefined,
    });

    console.log('📥 [TEST-WAAS] /api/v1/address result:', {
      status: response.status,
      statusText: response.statusText,
      code: data.code,
      response: responseText,
    });
  } catch (error) {
    results.tests.push({
      endpoint: '/api/v1/address',
      error: error instanceof Error ? error.message : String(error),
    });
    console.error('❌ [TEST-WAAS] /api/v1/address failed:', error);
  }

  return NextResponse.json(results);
}

