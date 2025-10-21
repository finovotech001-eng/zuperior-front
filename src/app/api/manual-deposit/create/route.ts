import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🚀 MANUAL DEPOSIT API ROUTE (Next.js - Proxying)        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Get authentication token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      console.error('❌ No authentication token provided');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('🔑 Token found, forwarding to backend...');

    // Parse form data from frontend
    const formData = await request.formData();
    
    const mt5AccountId = formData.get('mt5AccountId');
    const amount = formData.get('amount');
    const transactionHash = formData.get('transactionHash');
    const proofFile = formData.get('proofFile') as File;

    console.log('📊 Received deposit data:');
    console.log('   - MT5 Account ID:', mt5AccountId);
    console.log('   - Amount:', amount);
    console.log('   - Transaction Hash:', transactionHash || '(not provided)');
    console.log('   - Proof File:', proofFile ? proofFile.name : '(not provided)');
    console.log('');
    console.log('📡 Forwarding to backend:', `${BACKEND_API_URL}/manual-deposit/create`);

    // Forward request to Express backend
    const backendFormData = new FormData();
    backendFormData.append('mt5AccountId', mt5AccountId as string);
    backendFormData.append('amount', amount as string);
    if (transactionHash) {
      backendFormData.append('transactionHash', transactionHash as string);
    }
    if (proofFile && proofFile.size > 0) {
      backendFormData.append('proofFile', proofFile);
    }

    const response = await fetch(`${BACKEND_API_URL}/manual-deposit/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const result = await response.json();

    console.log('📥 Backend response:');
    console.log('   - Success:', result.success);
    console.log('   - Message:', result.message);
    if (result.data) {
      console.log('   - Deposit ID:', result.data.id);
    }
    console.log('');

    if (result.success) {
      console.log('✅✅✅ DEPOSIT REQUEST SUCCESSFUL! ✅✅✅');
      console.log('');
      console.log('🔍 Check backend console for detailed MT5Transaction logs');
      console.log('');
    } else {
      console.error('❌ Backend returned error:', result.message);
    }

    return NextResponse.json(result, { status: response.status });

  } catch (error: any) {
    console.error('');
    console.error('❌❌❌ ERROR IN NEXT.JS API ROUTE! ❌❌❌');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('');

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to forward request to backend',
        error: 'PROXY_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/manual-deposit/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error: any) {
    console.error('Error fetching manual deposits:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
