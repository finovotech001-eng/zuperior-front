// // app/api/epay/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const {
//       countrycode,
//       mobilenumber,
//       orderAmount,
//       user_name,
//       orderCurrency,
//     } = body;

//     // ✅ Generate alphanumeric-only orderID
//     const orderID = "ORD" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);
//     const customerId = "CUS" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);

//     const payload = {
//       channelId : "WEB",
//       customerId,
//       merchantId :process.env.EPAY_SERVICES_MERCHANT_ID,
//       merchantType :"ECOMMERCE",
//       orderID,
//       email : process.env.EPAY_SERVICES_EMAIL,
//       countrycode,
//       mobilenumber,
//       orderDescription: "Adding Funds to Zuperior Account",
//       orderAmount,
//       user_name,
//       orderCurrency,
//       success_url: process.env.EPAY_SERVICES_SUCCESS_URL,
//       failure_url: process.env.EPAY_SERVICES_FAILED_URL,
//       callback_url: process.env.EPAY_SERVICES_CALLBACK_URL,
//     };

//     const response = await axios.post(
//       "https://api.paymentservice.me/v1/stage/create-new-order",
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     return NextResponse.json(response.data, { status: 200 });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("EPAY Create Order Error:", error.response?.data || error.message);
//     return NextResponse.json(
//       { error: error.response?.data || "Failed to create order" },
//       { status: error.response?.status || 500 }
//     );
//   }
// }


// app/api/epay/route.ts - Updated to use Cregis Payment Gateway
import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/cregis-payment.service";

const config = {
  SUCCESS_URL: process.env.CREGIS_SUCCESS_URL || "",
  CANCEL_URL: process.env.CREGIS_CANCEL_URL || "",
  VALID_TIME: process.env.CREGIS_VALID_TIME || "",
  PAYER_ID: process.env.CREGIS_PAYER_ID || "",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('💳 Received card payment request:', body);

    const {
      orderAmount,
      success_url,
      failure_url,
      account_number,
      account_type,
    } = body;

    console.log('📊 Request body received:', {
      orderAmount,
      account_number,
      account_type,
      has_success_url: !!success_url,
      has_failure_url: !!failure_url,
    });

    // Validate and format orderAmount
    if (!orderAmount) {
      console.error('❌ Missing orderAmount in request');
      return NextResponse.json(
        { error: "Missing required field: orderAmount" },
        { status: 400 }
      );
    }

    // Convert to string and ensure proper format
    const formattedAmount = String(orderAmount).trim();
    if (!formattedAmount || formattedAmount === '0' || formattedAmount === '') {
      console.error('❌ Invalid orderAmount:', orderAmount);
      return NextResponse.json(
        { error: "Invalid amount: must be greater than 0" },
        { status: 400 }
      );
    }

    // Use provided URLs or fallback to config
    let successUrl = success_url || config.SUCCESS_URL;
    let cancelUrl = failure_url || config.CANCEL_URL;

    // If URLs are still empty, set defaults
    if (!successUrl) {
      successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/deposit/success`;
      console.warn('⚠️ Using default success URL');
    }
    if (!cancelUrl) {
      cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/deposit/cancel`;
      console.warn('⚠️ Using default cancel URL');
    }

    console.log('📋 Payment URLs configured:', { successUrl, cancelUrl });

    // Generate callback URL
    const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cregis/payment-callback`);
    if (account_number) callbackUrl.searchParams.set('account', account_number);
    if (account_type) callbackUrl.searchParams.set('type', account_type);

    console.log('💳 Creating Cregis payment order for card deposit:', {
      orderAmount,
      account_number,
      account_type,
      callbackUrl: callbackUrl.toString(),
    });

    // Create payment order using Cregis for card payments
    // Note: Cregis may require payer_id for card payments, using account number as unique ID
    const payerId = account_number || `${Date.now()}`;
    
    console.log('📝 Using payer_id:', payerId);
    
    const result = await createPaymentOrder({
      orderAmount: formattedAmount,
      orderCurrency: "USD", // Card payments in USD
      callbackUrl: callbackUrl.toString(),
      successUrl,
      cancelUrl,
      payerId: payerId,
      validTime: Number(config.VALID_TIME) || 600,
    });

    if (!result.success) {
      console.error("❌ Cregis payment order failed:", result.error);
      console.error("❌ Full result:", JSON.stringify(result, null, 2));
      return NextResponse.json(
        {
          error: "Payment initiation failed",
          details: result.error,
          code: "CREGIS_ERROR",
        },
        { status: 400 }
      );
    }

    console.log("✅ Cregis payment order created successfully for card deposit");
    console.log("📋 Payment data:", JSON.stringify(result.data, null, 2));

    // Return data in format expected by frontend
    return NextResponse.json({
      orderId: result.data?.orderId,
      transactionId: result.data?.cregisId,
      redirectUrl: result.data?.paymentUrl,
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Credit card deposit error:", error.message);
    return NextResponse.json(
      {
        error: "Payment initiation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}