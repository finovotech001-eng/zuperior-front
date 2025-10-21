import { AddressKYCRequestBody, AddressKYCResponse } from "@/types/kyc";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let requestBody: AddressKYCRequestBody;
  
  try {
    const {
      SHUFTI_PRO_CLIENT_ID,
      SHUFTI_PRO_SECRET_KEY,
      SHUFTI_PRO_CALLBACK_URL,
      NEXT_PUBLIC_KYC_TEST_MODE,
    } = process.env;

    requestBody = await request.json();

    console.log('📍 Address Verification Request:', {
      reference: requestBody.reference,
      documentTypes: requestBody.address?.supported_types,
      testMode: NEXT_PUBLIC_KYC_TEST_MODE === 'true'
    });

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
    if (!SHUFTI_PRO_CLIENT_ID || !SHUFTI_PRO_SECRET_KEY) {
      console.error('❌ Shufti Pro credentials not configured');
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

    // Build payload for Address Verification
    const payload = {
      reference: requestBody.reference,
      callback_url: SHUFTI_PRO_CALLBACK_URL || 'http://localhost:3000/api/kyc/callback',
      language: "EN",
      verification_mode: "image_only",
      address: {
        proof: requestBody.address.proof,
        supported_types: requestBody.address.supported_types || ["utility_bill", "bank_statement", "rent_agreement"],
        full_address: requestBody.address.full_address,
        name: requestBody.address.name,
        fuzzy_match: requestBody.address.fuzzy_match || "1"
      },
    };

    console.log("🚀 Calling Shufti Pro Address Verification API:", {
      reference: payload.reference,
      callback_url: payload.callback_url,
      document_types: payload.address.supported_types,
      verification_mode: payload.verification_mode
    });

    // Send request to Shufti Pro API
    const response = await axios.post("https://api.shuftipro.com/", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      timeout: 30000, // 30 second timeout
    });

    console.log("✅ Shufti Pro Address Verification Response:", {
      reference: requestBody.reference,
      event: response.data.event,
      message: response.data.message || response.data.verification_result?.address?.message
    });

    const data: AddressKYCResponse = response.data;
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Address verification error:", error);
    
    // Log more details for debugging
    if (error.response) {
      console.error("Shufti Pro API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    // If Shufti Pro fails, fall back to test mode for development
    if (process.env.NODE_ENV === 'development' && requestBody) {
      console.log("🔄 Falling back to test mode due to Shufti Pro error");
      
      const mockResponse: AddressKYCResponse = {
        reference: requestBody.reference,
        event: "verification.accepted",
        error: "",
        verification_url: "",
        verification_result: {
          address: {
            status: "accepted",
            message: "FALLBACK MODE: Address verified (Shufti Pro error)"
          }
        },
        declined_reason: null
      };

      return NextResponse.json(mockResponse);
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: error.response?.data || "No additional details",
        status: error.response?.status || 500
      },
      { status: 500 }
    );
  }
}
