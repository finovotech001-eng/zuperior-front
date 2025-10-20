// app/api/shufti/aml-callback/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get the webhook data
    const data = await request.json();
    
    // 2. Basic validation
    if (!data.reference || !data.event) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Log what happened (replace with your actual logic)
    console.log('AML Webhook Received:', {
      reference: data.reference,
      event: data.event,
      status: data.verification_data?.aml_status,
      matches: data.verification_data?.matches
    });

    // 4. Always respond successfully to prevent retries
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('AML Callback Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}