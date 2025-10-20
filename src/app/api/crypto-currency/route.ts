/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/crypto-currency/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const config = {
  PAYMENT_ENGINE_KEY: process.env.CREGIS_PAYMENT_SECRET || "",
  BASE_URL: process.env.CREGIS_BASE_URL || "",
  MERCHANT_ID: process.env.CREGIS_MERCHANT_ID || "",
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

export async function GET() {
  try {
    // Check if required environment variables are present
    if (!config.PAYMENT_ENGINE_KEY || !config.BASE_URL || !config.MERCHANT_ID) {
      console.warn("CreGIS API credentials not configured, returning mock data for development");
      
      // Return mock data for development
      const mockCryptoRates = [
        {
          symbol: "USDT",
          name: "USDT-TRC20",
          exchangeRate: 1.0,
          network: "195@TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          blockchain: "TRC20",
          logoUrl: "/trc20.png",
          decimals: "6",
        },
        {
          symbol: "USDT",
          name: "USDT-ERC20",
          exchangeRate: 1.0,
          network: "60@0xdac17f958d2ee523a2206206994597c13d831ec7",
          blockchain: "ERC20",
          logoUrl: "/erc20.png",
          decimals: "6",
        },
        {
          symbol: "USDT",
          name: "USDT-BEP20",
          exchangeRate: 1.0,
          network: "2510@0x55d398326f99059ff775485246999027b3197955",
          blockchain: "BEP20",
          logoUrl: "/bep20.png",
          decimals: "18",
        },
        {
          symbol: "USDT",
          name: "USDT TRC20 QRl",
          exchangeRate: 1.0,
          network: "Manual@Twinxa7902309skjhfsdlhflksjdhlkLL",
          blockchain: "Manual",
          logoUrl: "/trc20.png",
          decimals: "6",
        },
      ];

      return NextResponse.json({ success: true, data: mockCryptoRates });
    }

    const pid = Number(config.MERCHANT_ID);
    const nonce = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();

    const payload: Record<string, string | number> = {
      pid,
      nonce,
      timestamp,
    };

    const sign = generateSignature(payload, config.PAYMENT_ENGINE_KEY);
    const requestData = { ...payload, sign };

    const response = await fetch(
      `${config.BASE_URL}/api/v1/order_crypto_currency`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const blockchainMap: Record<string, string> = {
      "USDT-ERC20": "60@0xdac17f958d2ee523a2206206994597c13d831ec7",
      "USDT-TRC20": "195@TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "USDT-BEP20": "2510@0x55d398326f99059ff775485246999027b3197955",
    };

    // Transform response to match your frontend needs
    const cryptoRates = data.data
      .filter(
        (token: any) =>
          token.token_symbol === "USDT" &&
          ["USDT-ERC20", "USDT-TRC20", "USDT-BEP20"].includes(token.token_name)
      )
      .map((token: any) => ({
        symbol: token.token_symbol,
        name: token.token_name,
        exchangeRate: token.exchange_rate,
        network: blockchainMap[token.token_name],
        blockchain: token.blockchain,
        logoUrl: token.logo_url,
        decimals: token.token_decimals,
      }));

    return NextResponse.json({ success: true, data: cryptoRates });
  } catch (err: unknown) {
    console.error("Crypto currency API error:", err);
    
    // Fallback to mock data if API fails
    const fallbackCryptoRates = [
      {
        symbol: "USDT",
        name: "USDT-TRC20",
        exchangeRate: 1.0,
        network: "195@TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        blockchain: "TRC20",
        logoUrl: "/trc20.png",
        decimals: "6",
      },
      {
        symbol: "USDT",
        name: "USDT-ERC20",
        exchangeRate: 1.0,
        network: "60@0xdac17f958d2ee523a2206206994597c13d831ec7",
        blockchain: "ERC20",
        logoUrl: "/erc20.png",
        decimals: "6",
      },
      {
        symbol: "USDT",
        name: "USDT-BEP20",
        exchangeRate: 1.0,
        network: "2510@0x55d398326f99059ff775485246999027b3197955",
        blockchain: "BEP20",
        logoUrl: "/bep20.png",
        decimals: "18",
      },
      {
        symbol: "USDT",
        name: "USDT TRC20 QR",
        exchangeRate: 1.0,
        network: "Manual@Twinxa7902309skjhfsdlhflksjdhlkLL",
        blockchain: "Manual",
        logoUrl: "/trc20.png",
        decimals: "6",
      },
    ];

    return NextResponse.json({ success: true, data: fallbackCryptoRates });
  }
}
