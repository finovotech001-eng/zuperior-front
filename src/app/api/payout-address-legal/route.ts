import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

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
    const body = (await req.json()) as {
      address: string;
      chain_id: string;
    };

    const { address, chain_id } = body;

    if (!address || !chain_id) {
      return NextResponse.json(
        { error: "Missing required fields: address and chain_id" },
        { status: 400 }
      );
    }

    if (!config.MERCHANT_ID) {
      return NextResponse.json(
        { error: "Missing environment variable: MERCHANT_ID" },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2, 8);

    const payload: Record<string, string | number> = {
      pid: Number(config.MERCHANT_ID),
      address,
      chain_id,
      nonce,
      timestamp,
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await axios.post(`${config.BASE_URL}/api/v1/address/legal`, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data as {
      code: string;
      msg: string;
      data?: {
        result: boolean;
      };
      details?: unknown;
      [key: string]: unknown;
    };

    if (data.code !== "00000") {
      return NextResponse.json(
        {
          error: "Failed to validate address",
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