import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET || "",
  BASE_URL: process.env.CREGIS_BASE_URL || "",
  MERCHANT_ID: process.env.CREGIS_MERCHANT_ID || "",
  SUCCESS_URL: process.env.CREGIS_SUCCESS_URL || "",
  CANCEL_URL: process.env.CREGIS_CANCEL_URL || "",
  VALID_TIME: process.env.CREGIS_VALID_TIME || "",
  PAYER_ID: process.env.CREGIS_PAYER_ID || "",
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
      order_amount: string;
      order_currency: string;
      payer_id?: string;
      valid_time?: number;
    };

    const { order_amount, order_currency, payer_id, valid_time } = body;

    if (!order_amount || !order_currency) {
      return NextResponse.json(
        { error: "Missing required fields: order_amount, order_currency" },
        { status: 400 }
      );
    }

    if (!config.SUCCESS_URL || !config.CANCEL_URL) {
      return NextResponse.json(
        { error: "Missing environment variables: SUCCESS_URL or CANCEL_URL" },
        { status: 500 }
      );
    }

    const order_id = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.random().toString(36).substring(2, 8);

    const payload: Record<string, string | number> = {
      pid: Number(config.MERCHANT_ID),
      nonce,
      timestamp,
      order_id,
      order_amount,
      order_currency,
      payer_id: payer_id || config.PAYER_ID,
      valid_time: valid_time || Number(config.VALID_TIME),
      success_url: config.SUCCESS_URL,
      cancel_url: config.CANCEL_URL,
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await axios.post(`${config.BASE_URL}/api/v2/checkout`, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data as {
      code: string;
      msg: string;
      details?: unknown;
      [key: string]: unknown;
    };

    if (data.code !== "00000") {
      return NextResponse.json(
        {
          error: "Failed to create payment order",
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
