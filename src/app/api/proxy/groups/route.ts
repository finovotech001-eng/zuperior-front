// client/src/app/api/proxy/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    // Groups endpoint on backend is public, but forward auth if present
    const token = request.headers.get('authorization');

    const response = await fetch(`${API_URL}/mt5/groups`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: token } : {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to fetch MT5 groups',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Backend returns an array; forward as-is
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching MT5 groups:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

