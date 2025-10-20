import { AddressKYCRequestBody, AddressKYCResponse } from "@/types/kyc";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      SHUFTI_PRO_CLIENT_ID,
      SHUFTI_PRO_SECRET_KEY,
      SHUFTI_PRO_CALLBACK_URL,
      NEXT_PUBLIC_KYC_TEST_MODE,
    } = process.env;

    const requestBody: AddressKYCRequestBody = await request.json();

    // TEST MODE: Simulate successful verification without calling Shufti Pro
    if (NEXT_PUBLIC_KYC_TEST_MODE === 'true' || !SHUFTI_PRO_CLIENT_ID) {
      console.log('🧪 KYC Test Mode: Simulating address verification...');
      
      // Simulate a successful response
      const mockResponse: AddressKYCResponse = {
        reference: requestBody.reference,
        event: "verification.accepted",
        error: "",
        verification_url: "",
        verification_result: {
          address: {
            status: "accepted",
            message: "TEST MODE: Address verified successfully"
          }
        },
        declined_reason: null
      };

      console.log('✅ Test Mode: Address verification successful');
      return NextResponse.json(mockResponse);
    }

    // PRODUCTION MODE: Use actual Shufti Pro
    if (
      !SHUFTI_PRO_CLIENT_ID ||
      !SHUFTI_PRO_SECRET_KEY ||
      !SHUFTI_PRO_CALLBACK_URL
    ) {
      throw new Error("Shufti Pro environment variables not configured. Set NEXT_PUBLIC_KYC_TEST_MODE=true for testing.");
    }

    if (!requestBody.reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    if (!requestBody.address?.full_address) {
      return NextResponse.json(
        { error: "Missing full_address" },
        { status: 400 }
      );
    }

    // Build Authorization header for Basic Auth
    const authHeader = Buffer.from(
      `${SHUFTI_PRO_CLIENT_ID}:${SHUFTI_PRO_SECRET_KEY}`
    ).toString("base64");

    // Build payload for Address Verification Standard Offsite
    const payload = {
      reference: requestBody.reference,
      callback_url: SHUFTI_PRO_CALLBACK_URL,
      ttl: 60,
      decline_on_single_step: "0",
      verification_mode: "any",
      address: {
        ...requestBody.address,
      },
    };

    // Send request to Shufti Pro API
    const response = await axios.post("https://api.shuftipro.com/", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
    });

    const data: AddressKYCResponse = response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error("KYC address verification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
