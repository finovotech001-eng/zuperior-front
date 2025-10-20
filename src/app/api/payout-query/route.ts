import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

interface PayoutQueryResponse {
  code: string;
  msg: string;
  data?: {
    pid: number;
    chain_id: string;
    token_id: string;
    currency: string;
    address: string;
    amount: string;
    status: number;
    third_party_id: string;
    remark: string;
    memo: string;
    txid: string;
    block_height: string;
    block_time: number;
  };
  details?: unknown;
  [key: string]: unknown;
}

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYOUT_PAYMENT_SECRET || "",
  BASE_URL: process.env.CREGIS_PAYOUT_BASE_URL || "",
  MERCHANT_ID: process.env.CREGIS_PAYOUT_MERCHANT_ID || "",
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

  return crypto
    .createHash("md5")
    .update(stringToSign)
    .digest("hex")
    .toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const { cid } = (await req.json()) as { cid: number };

    if (!cid) {
      return NextResponse.json(
        { error: "Missing required field: cid" },
        { status: 400 }
      );
    }
    if (!config.MERCHANT_ID) {
      return NextResponse.json(
        { error: "Missing environment variable: MERCHANT_ID" },
        { status: 500 }
      );
    }

    const payload = {
      pid: config.MERCHANT_ID,
      cid,
      nonce: Math.random().toString(36).substring(2, 8),
      timestamp: Date.now(),
    };

    const requestData = {
      ...payload,
      sign: generateSignature(payload, config.PAYMENT_ENGINE_KEY),
    };

    const response = await axios.post<PayoutQueryResponse>(
      `${config.BASE_URL}/api/v1/payout/query`,
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;

    if (data.code !== "00000") {
      return NextResponse.json(
        {
          error: "Failed to query payout order",
          message: data.msg,
          code: data.code,
          details: data.details || null,
            debug_payload: requestData,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err as AxiosError;

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.response?.data || error.message || String(err),
      },
      { status: 500 }
    );
  }
}
