import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/cregis-payment.service";
import { cookies } from "next/headers";

const config = {
  SUCCESS_URL: process.env.CREGIS_SUCCESS_URL || "",
  CANCEL_URL: process.env.CREGIS_CANCEL_URL || "",
  VALID_TIME: process.env.CREGIS_VALID_TIME || "",
  PAYER_ID: process.env.CREGIS_PAYER_ID || "",
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

    // Map currency to Cregis Payment Engine format
    // Payment Engine might use different format than WaaS API
    let cregisOrderCurrency = order_currency.trim();
    
    // Try different currency formats for Payment Engine
    // Format 1: Simple name (e.g., "USDT")
    // Format 2: With network (e.g., "USDT-TRC20") 
    // Format 3: Full identifier (e.g., "195@TR7...")
    
    const currencyMappings: Record<string, string[]> = {
      'USDT': [
        'USDT',           // Try simple format first
        'USDT-TRC20',     // Try with network
        '195@TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // Full identifier
      ],
      'TRX': ['TRX', 'TRON', '195'],
    };

    // For now, try the simple format first
    if (order_currency.toUpperCase() === 'USDT' || order_currency.toUpperCase() === 'USDT-TRC20') {
      // Try simple "USDT" format for Payment Engine
      cregisOrderCurrency = 'USDT';
      console.log(`📝 [CHECKOUT] Using simple format: ${order_currency} → ${cregisOrderCurrency}`);
    } else {
      console.log(`⚠️ [CHECKOUT] Using original currency format: ${cregisOrderCurrency}`);
    }
    
    console.log(`💡 [CHECKOUT] Available alternatives if this fails:`, currencyMappings[order_currency.toUpperCase()] || []);

    // Prepare payment order parameters
    const paymentParams = {
      orderAmount: order_amount.trim(),
      orderCurrency: cregisOrderCurrency,
      callbackUrl: callbackUrl.toString(),
      successUrl: successUrl,
      cancelUrl: cancelUrl,
      payerId: payer_id || config.PAYER_ID || `${Date.now()}`,
      validTime: valid_time || Number(config.VALID_TIME) || 30, // FIXED: 30 minutes instead of 600
    };

    console.log('📤 [CHECKOUT] Creating Cregis payment order with:', {
      originalCurrency: order_currency,
      mappedCurrency: cregisOrderCurrency,
      orderAmount: paymentParams.orderAmount,
      validTime: paymentParams.validTime,
      hasCallbackUrl: !!paymentParams.callbackUrl,
      hasSuccessUrl: !!paymentParams.successUrl,
      hasCancelUrl: !!paymentParams.cancelUrl,
    });

    // Create payment order using Cregis service
    const result = await createPaymentOrder(paymentParams);

    if (!result.success) {
      console.error("❌ [CHECKOUT] Cregis payment order failed:", result.error);
      return NextResponse.json(
        {
          code: "10000",
          msg: "Payment initiation failed",
          error: result.error,
        },
        { status: 400 }
      );
    }

    console.log('✅ [CHECKOUT] Cregis payment order created successfully');
    console.log('📋 [CHECKOUT] Payment data:', {
      hasCregisId: !!result.data?.cregisId,
      hasPaymentUrl: !!result.data?.paymentUrl,
      hasQrCode: !!result.data?.qrCode,
      orderId: result.data?.orderId,
    });

    // Call backend to create crypto deposit record
    if (account_number) {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (token) {
          console.log('📞 Calling backend to create crypto deposit record...');
          
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
              cregisOrderId: result.data?.orderId,
              paymentUrl: result.data?.paymentUrl,
            }),
          });

          if (backendResponse.ok) {
            const backendData = await backendResponse.json();
            console.log('✅ Crypto deposit record created in backend:', backendData);
          } else {
            console.warn('⚠️ Failed to create crypto deposit record in backend:', await backendResponse.text());
          }
        } else {
          console.warn('⚠️ No auth token found in cookies, skipping backend call');
        }
      } catch (backendError) {
        console.error('❌ Error calling backend:', backendError);
        // Continue even if backend call fails
      }
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
