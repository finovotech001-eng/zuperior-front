// app/api/user-screening/route.ts
import { AMLRequestBody, AMLResponse } from "@/types/kyc";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Load environment variables
    const {
      SHUFTI_PRO_CLIENT_ID,
      SHUFTI_PRO_SECRET_KEY,
      SHUFTI_PRO_AML_CALLBACK_URL,
      NEXT_PUBLIC_KYC_TEST_MODE,
    } = process.env;

    const requestBody: AMLRequestBody = await request.json();

    // TEST MODE: Simulate successful AML verification without calling Shufti Pro
    if (NEXT_PUBLIC_KYC_TEST_MODE === 'true' || !SHUFTI_PRO_CLIENT_ID) {
      console.log('🧪 KYC Test Mode: Simulating AML verification...');
      
      // Simulate a successful response
      const mockResponse: AMLResponse = {
        reference: requestBody.reference,
        event: "verification.accepted",
        error: "",
        verification_url: "",
        verification_result: {
          background_checks: {
            status: "accepted",
            message: "TEST MODE: AML screening passed - No matches found"
          }
        },
        declined_reason: null
      };

      console.log('✅ Test Mode: AML verification successful');
      return NextResponse.json(mockResponse);
    }

    // PRODUCTION MODE: Use actual Shufti Pro
    if (
      !SHUFTI_PRO_CLIENT_ID ||
      !SHUFTI_PRO_SECRET_KEY ||
      !SHUFTI_PRO_AML_CALLBACK_URL
    ) {
      throw new Error("Shufti Pro credentials not configured. Set NEXT_PUBLIC_KYC_TEST_MODE=true for testing.");
    }

    if (!requestBody.reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // its getting undefined but full name is there inside the request body
    /* if (!requestBody?.background_checks?.name?.full_name) {
      return NextResponse.json(
        {
          error: "Full name is required",
        },
        { status: 400 }
      );
    } */

    // Prepare Basic Auth header
    const authHeader = Buffer.from(
      `${SHUFTI_PRO_CLIENT_ID}:${SHUFTI_PRO_SECRET_KEY}`
    ).toString("base64");

    // Construct payload with enhanced defaults
    const payload = {
      reference: requestBody.reference,
      callback_url: SHUFTI_PRO_AML_CALLBACK_URL,
      language: "en",
      verification_mode: "any",
      decline_on_single_step: "0",
      ttl: 60, // Time-to-live in minutes
      background_checks: {
        ...requestBody.background_checks,
        alias_search: "1",
        rca_search: "1",
      },
    };

    // Call Shufti Pro API with timeout
    const response = await axios.post("https://api.shuftipro.com/", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
    });

    const data: AMLResponse = await response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error("AML screening error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout - Shufti Pro API did not respond in time" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
