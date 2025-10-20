import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface CregisCallback {
  receiver: string;
  callback_url?: string; // Add this field
  status?: number;
  amount?: string;
  currency?: string;
  txid?: string;
  update_time?: string;
  failure_reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CregisCallback = await request.json();
    console.log('📥 Received:', JSON.stringify(data, null, 2));

    // 1. Validate address format
    if (!data.receiver || !/^0x[a-fA-F0-9]{40}$/.test(data.receiver)) {
      return NextResponse.json(
        {
          success: false,
          error: 'invalid_address',
          message: 'Invalid Ethereum address format'
        },
        { status: 400 }
      );
    }

    // 2. Handle initial registration request
    if (data.callback_url && !data.status) {
      return NextResponse.json(
        {
          success: true,
          registered: true,
          receiver: data.receiver,
          callback_url: data.callback_url,
          message: 'Address successfully registered with Cregis',
          next_steps: 'Cregis will now send deposit notifications to this endpoint'
        },
        { status: 200 }
      );
    }

    // 3. Handle test request (just receiver)
    if (!data.callback_url && !data.status) {
      return NextResponse.json(
        {
          success: true,
          receiver: data.receiver,
          message: 'Test request received - address is valid',
          note: 'To receive real callbacks, include callback_url in your registration'
        },
        { status: 200 }
      );
    }

    // 4. Handle actual deposit callback
    if (data.status && data.txid) {
      return NextResponse.json(
        {
          success: true,
          processed: true,
          receiver: data.receiver,
          amount: data.amount,
          currency: data.currency,
          txid: data.txid,
          status: data.status === 1 ? 'SUCCESS' : 'FAILED',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    // Fallback for unexpected requests
    return NextResponse.json(
      {
        success: false,
        error: 'unexpected_request_format',
        received_data: data
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'processing_error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}