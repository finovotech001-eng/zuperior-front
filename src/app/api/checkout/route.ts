import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const config = {
  SUCCESS_URL: process.env.CREGIS_SUCCESS_URL || "",
  CANCEL_URL: process.env.CREGIS_CANCEL_URL || "",
  VALID_TIME: process.env.CREGIS_VALID_TIME || "",
  PAYER_ID: process.env.CREGIS_PAYER_ID || "",
  // Static USDT TRC20 deposit address from Cregis WaaS
  USDT_DEPOSIT_ADDRESS: process.env.CREGIS_USDT_DEPOSIT_ADDRESS || "",
  // QR code for the deposit address (optional)
  USDT_QR_CODE: process.env.CREGIS_USDT_QR_CODE || "",
};

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 [CHECKOUT] ========== NEW CHECKOUT REQUEST ==========');
    
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

    console.log('📦 [CHECKOUT] Raw body received:', JSON.stringify(body, null, 2));

    const { order_amount, order_currency, payer_id, valid_time, account_number, account_type, network, crypto_symbol } = body;

    console.log('💳 [CHECKOUT] Parsed checkout request:', {
      order_amount,
      order_currency,
      account_number,
      network,
      crypto_symbol,
      order_amount_type: typeof order_amount,
      order_amount_length: order_amount?.length,
      order_currency_type: typeof order_currency,
      order_currency_length: order_currency?.length,
    });

    // Validate required fields
    if (!order_amount || !order_currency) {
      console.error('❌ [CHECKOUT] Missing required fields');
      return NextResponse.json(
        { 
          code: "10000",
          msg: "Payment initiation failed",
          error: "Missing required fields: order_amount, order_currency" 
        },
        { status: 400 }
      );
    }

    // Validate amount is not empty string
    if (order_amount.trim() === '' || order_amount === '0') {
      console.error('❌ [CHECKOUT] Invalid amount:', order_amount);
      return NextResponse.json(
        { 
          code: "10000",
          msg: "Payment initiation failed",
          error: "Invalid amount: must be greater than 0" 
        },
        { status: 400 }
      );
    }

    // Use fallback URLs if not configured
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = config.SUCCESS_URL || `${baseUrl}/deposit/success`;
    const cancelUrl = config.CANCEL_URL || `${baseUrl}/deposit/cancel`;
    
    console.log('📋 [CHECKOUT] Using URLs:', { 
      baseUrl,
      successUrl, 
      cancelUrl,
      hasSuccessUrl: !!successUrl,
      hasCancelUrl: !!cancelUrl,
    });

    // Validate URLs are not empty
    if (!successUrl || !cancelUrl) {
      console.error('❌ [CHECKOUT] Empty URLs detected!');
      return NextResponse.json(
        { 
          code: "10000",
          msg: "Payment initiation failed",
          error: "Server configuration error: Missing callback URLs" 
        },
        { status: 500 }
      );
    }

    // Generate callback URL with additional parameters
    const callbackUrl = new URL(`${baseUrl}/api/cregis/payment-callback`);
    if (account_number) callbackUrl.searchParams.set('account', account_number);
    if (account_type) callbackUrl.searchParams.set('type', account_type);

    console.log('📝 [CHECKOUT] Callback URL:', callbackUrl.toString());

    // Call Cregis Checkout API to get dynamic payment address
    console.log('🔄 [CHECKOUT] Calling Cregis Checkout API...');
    
    const { createPaymentOrder } = await import('@/lib/cregis-payment.service');
    
    const cregisResult = await createPaymentOrder({
      orderAmount: order_amount,
      orderCurrency: order_currency,
      callbackUrl: callbackUrl.toString(),
      successUrl,
      cancelUrl,
      payerId: payer_id || account_number,
      validTime: valid_time || parseInt(config.VALID_TIME) || 30,
    });

    if (!cregisResult.success || !cregisResult.data) {
      console.error('❌ [CHECKOUT] Cregis API failed:', cregisResult.error);
      return NextResponse.json(
        {
          code: "10000",
          msg: "Failed to create payment order",
          error: cregisResult.error || "Cregis API error",
        },
        { status: 500 }
      );
    }

    const thirdPartyId = cregisResult.data.orderId;
    
    console.log('✅ [CHECKOUT] Cregis payment order created:', {
      cregisId: cregisResult.data.cregis_id,
      thirdPartyId,
      hasPaymentInfo: !!cregisResult.data.payment_info,
    });

    // Try to call backend to create crypto deposit record (optional for now)
    // If backend fails, we'll still return the address so user can deposit
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;

      if (token && account_number) {
        console.log('📞 [CHECKOUT] Attempting to call backend to create deposit record...');
        
        const backendResponse = await fetch(`${BACKEND_API_URL}/deposit/cregis-crypto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            mt5AccountId: account_number,
            amount: order_amount,
            currency: order_currency,
            network: network || 'TRC20',
            cregisOrderId: thirdPartyId,
            cregisId: cregisResult.data.cregis_id,
            paymentUrl: cregisResult.data.checkout_url || cregisResult.data.paymentUrl,
          }),
        });

        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          console.log('✅ [CHECKOUT] Deposit record created in backend:', backendData);
        } else {
          const errorText = await backendResponse.text();
          console.warn('⚠️ [CHECKOUT] Backend call failed (continuing anyway):', errorText);
          console.warn('⚠️ [CHECKOUT] Backend might not be running or route not found');
          console.warn('💡 [CHECKOUT] User can still deposit - address will be shown');
        }
      } else {
        console.warn('⚠️ [CHECKOUT] No auth token or account - skipping backend call');
      }
    } catch (backendError) {
      console.warn('⚠️ [CHECKOUT] Backend error (continuing anyway):', backendError);
      console.warn('💡 [CHECKOUT] User can still deposit - address will be shown');
      // Don't return error - continue to show address even if backend fails
    }

    // Return Cregis checkout data to frontend
    return NextResponse.json({
      code: "00000",
      msg: "Success",
      data: {
        cregis_id: cregisResult.data.cregis_id,
        order_currency: order_currency,
        expire_time: cregisResult.data.expire_time,
        checkout_url: cregisResult.data.checkout_url,
        payment_info: cregisResult.data.payment_info,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    
    console.error("❌ Checkout API error:", error);
    console.error("❌ Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "Unknown error",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}
