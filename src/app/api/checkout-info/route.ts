import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET || "",
  BASE_URL: process.env.CREGIS_BASE_URL || "",
  MERCHANT_ID: process.env.CREGIS_MERCHANT_ID || "",
};

function generateSignature(params: Record<string, unknown>, secretKey: string): string {
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

    const { cregis_id } = body;
    if (!cregis_id) {
      return NextResponse.json({ error: "Missing cregis_id" }, { status: 400 });
    }

    const pid = Number(config.MERCHANT_ID);
    const nonce = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();

    const payload: Record<string, string | number> = {
      pid,
      nonce,
      timestamp,
      cregis_id,
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await axios.post(`${config.BASE_URL}/api/v2/order/info`, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(response.data);
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
