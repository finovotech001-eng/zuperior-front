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
    const body = (await req.json()) as {
      order_amount: string;
      order_currency: string;
      payer_id?: string;
      valid_time?: number;
      account_number?: string;
      account_type?: string;
      network?: string;
      crypto_symbol?: string;
    };

    const { order_amount, order_currency, payer_id, valid_time, account_number, account_type, network, crypto_symbol } = body;

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

    // Generate callback URL with additional parameters
    const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cregis/payment-callback`);
    if (account_number) callbackUrl.searchParams.set('account', account_number);
    if (account_type) callbackUrl.searchParams.set('type', account_type);

    // Create payment order using Cregis service
    const result = await createPaymentOrder({
      orderAmount: order_amount,
      orderCurrency: order_currency,
      callbackUrl: callbackUrl.toString(),
      successUrl: config.SUCCESS_URL,
      cancelUrl: config.CANCEL_URL,
      payerId: payer_id || config.PAYER_ID,
      validTime: valid_time || Number(config.VALID_TIME),
    });

    if (!result.success) {
      console.error("❌ Cregis payment order failed:", result.error);
      return NextResponse.json(
        {
          code: "10000",
          msg: "Payment initiation failed",
          error: result.error,
        },
        { status: 400 }
      );
    }

    // Transform Cregis response to match expected CheckoutData format
    const checkoutDataResponse = {
      cregis_id: result.data?.cregisId || "",
      order_currency: order_currency,
      expire_time: result.data?.expireTime || new Date(Date.now() + 600000).toISOString(),
      payment_url: result.data?.paymentUrl || "",
      qr_code: result.data?.qrCode || "",
      // For backward compatibility with old dialog that expects payment_info
      payment_info: result.data?.paymentUrl ? [
        {
          payment_address: result.data.paymentUrl,
          receive_currency: order_currency,
          blockchain: network || crypto_symbol || order_currency,
          token_symbol: crypto_symbol || order_currency,
        }
      ] : [],
    };

    // Return data in format expected by frontend
    return NextResponse.json({
      code: "00000",
      msg: "Success",
      data: checkoutDataResponse,
    });
  } catch (err: unknown) {
    const error = err as Error;

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
