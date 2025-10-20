// app/api/address/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET,
  BASE_URL: process.env.CREGIS_BASE_URL,
  MERCHANT_ID: process.env.CREGIS_MERCHANT_ID,
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
    const body = await req.json();
    const {
      chain_id = process.env.CREGIS_CHAIN_ID || "",
      alias = process.env.CREGIS_ALIAS || "",
      callback_url = process.env.CREGIS_ADDRESS_CALLBACK_URL || "",
    }: {
      chain_id?: string;
      alias?: string;
      callback_url: string;
    } = body;

    if (!callback_url) {
      return NextResponse.json(
        { error: "Missing required field: callback_url" },
        { status: 400 }
      );
    }

    const payload: Record<string, string | number> = {
      pid: Number(config.MERCHANT_ID),
      chain_id,
      alias,
      callback_url,
      nonce: Math.random().toString(36).substring(2, 8),
      timestamp: Date.now(),
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY || "");
    const requestData = { ...payload, sign };

    const response = await axios.post(
      `${config.BASE_URL}/api/v1/address/create`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.code !== "00000") {
      return NextResponse.json(
        {
          error: "Failed to create address",
          message: data.msg,
          code: data.code,
          details: data.details || null,
          debug_payload: requestData,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        // details: err?.response?.data || err?.message || String(err),
      },
      { status: 500 }
    );
  }
}