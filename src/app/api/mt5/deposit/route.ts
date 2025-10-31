// client/src/app/api/mt5/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { login, balance, comment } = body;

    // Validate required fields
    if (!login || !balance || balance <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing or invalid fields: login, balance (must be > 0)'
        },
        { status: 400 }
      );
    }

    // Use backend server endpoint that uses depositMt5Balance service
    const response = await fetch(`${API_URL}/mt5/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login,
        balance: balance,
        comment: comment || 'Top up via CRM'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to deposit to MT5 account'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return in consistent format
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error depositing to MT5 account:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}