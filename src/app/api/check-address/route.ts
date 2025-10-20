// // app/api/address/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import axios from "axios";

// const config = {
//   BASE_URL: process.env.CREGIS_BASE_URL,
//   PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET,
//   MERCHANT_ID: process.env.CREGIS_MERCHANT_ID,
// };

// function generateSignature(
//   params: Record<string, any>,
//   secretKey: string
// ): string {
//   const filtered = Object.entries(params).filter(
//     ([, value]) => value !== null && value !== undefined && value !== ""
//   );

//   const sorted = filtered.sort(([a], [b]) => a.localeCompare(b));
//   const stringToSign = secretKey + sorted.map(([k, v]) => `${k}${v}`).join("");

//   return crypto
//     .createHash("md5")
//     .update(stringToSign)
//     .digest("hex")
//     .toLowerCase();
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { address, chain_id } = body;

//     if (!address) {
//       return NextResponse.json(
//         { error: "Missing required field: address" },
//         { status: 400 }
//       );
//     }

//     const payload: Record<string, string | number> = {
//       pid: Number(config.MERCHANT_ID),
//       address,
//       chain_id,
//       nonce: Math.random().toString(36).substring(2, 8),
//       timestamp: Date.now(),
//     };

//     const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY || "");
//     const requestData = { ...payload, sign };

//     const response = await axios.post(
//       `${config.BASE_URL}/api/v1/address/inner`,
//       requestData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const data = response.data;

//     return NextResponse.json({
//       success: data.code === "00000",
//       result: data.data?.result,
//       msg: data.msg,
//       raw: data,
//       debug_payload: requestData,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//         details: err?.response?.data || err?.message || String(err),
//       },
//       { status: 500 }
//     );
//   }
// }
// app/api/address/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

interface Config {
  BASE_URL: string;
  PAYMENT_ENGINE_KEY: string;
  MERCHANT_ID: string;
}

const config: Config = {
  BASE_URL: process.env.CREGIS_BASE_URL || '',
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET || '',
  MERCHANT_ID: process.env.CREGIS_MERCHANT_ID || '',
};

interface RequestBody {
  address: string;
  chain_id?: string | number;
}

interface Payload {
  pid: number;
  address: string;
  chain_id?: string | number;
  nonce: string;
  timestamp: number;
  [key: string]: string | number | undefined; // Index signature
}

interface ApiResponseData {
  result?: unknown;
  [key: string]: unknown;
}

interface ApiResponse {
  code: string;
  data?: ApiResponseData;
  msg?: string;
}

function generateSignature(
  params: Record<string, string | number | undefined>,
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
    // Validate configuration
    if (!config.BASE_URL || !config.PAYMENT_ENGINE_KEY || !config.MERCHANT_ID) {
      throw new Error("Missing required configuration");
    }

    const body: RequestBody = await req.json();
    const { address, chain_id } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Missing required field: address" },
        { status: 400 }
      );
    }

    const payload: Payload = {
      pid: Number(config.MERCHANT_ID),
      address,
      chain_id,
      nonce: Math.random().toString(36).substring(2, 8),
      timestamp: Date.now(),
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await axios.post<ApiResponse>(
      `${config.BASE_URL}/api/v1/address/inner`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return NextResponse.json({
      success: data.code === "00000",
      result: data.data?.result,
      msg: data.msg,
      raw: data,
      debug_payload: requestData,
    });
  } catch (err: unknown) {
    const error = err as Error | AxiosError;
    
    const errorDetails = error instanceof AxiosError
      ? error.response?.data || error.message
      : error.message;

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: errorDetails || String(error),
      },
      { status: 500 }
    );
  }
}