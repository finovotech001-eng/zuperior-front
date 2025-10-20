import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYOUT_PAYMENT_SECRET || "",
  BASE_URL: process.env.CREGIS_PAYOUT_BASE_URL || "",
  MERCHANT_ID: process.env.CREGIS_PAYOUT_MERCHANT_ID || "",
  SUCCESS_URL: process.env.CREGIS_SUCCESS_URL || "",
  CANCEL_URL: process.env.CREGIS_CANCEL_URL || "",
  VALID_TIME: process.env.CREGIS_VALID_TIME || "",
  PAYER_ID: process.env.CREGIS_PAYER_ID || "",
  CALLBACK_URL: process.env.CREGIS_PAYOUT_CALLBACK_URL || "",
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
    const body = (await req.json()) as {
      currency: string;
      address: string;
      amount: string;
      remark?: string;
      memo?: string;
    };

    const { currency, address, amount, remark, memo } = body;

    if (!currency || !address || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: currency, address, amount" },
        { status: 400 }
      );
    }

    if (!config.MERCHANT_ID) {
      return NextResponse.json(
        { error: "Missing environment variable: MERCHANT_ID" },
        { status: 500 }
      );
    }

    if (!config.CALLBACK_URL) {
      return NextResponse.json(
        { error: "Missing environment variable: CALLBACK_URL" },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2, 8);
    const third_party_id = Math.random().toString(36).substring(2, 8);

    const payload: Record<string, string | number> = {
      pid: Number(config.MERCHANT_ID),
      currency,
      address,
      amount,
      callback_url: config.CALLBACK_URL, // ✅ always from env
      third_party_id,
      nonce,
      timestamp,
    };

    // Add optional fields if provided
    if (remark) payload.remark = remark;
    if (memo) payload.memo = memo;

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await axios.post(`${config.BASE_URL}/api/v1/payout`, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data as {
      code: string;
      msg: string;
      data?: {
        cid: number;
      };
      details?: unknown;
      [key: string]: unknown;
    };

    if (data.code !== "00000") {
      return NextResponse.json(
        {
          error: "Failed to create payout order",
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
        details:
          error?.response?.data ||
          error?.message ||
          (typeof err === "object" ? JSON.stringify(err) : String(err)),
      },
      { status: 500 }
    );
  }
}
