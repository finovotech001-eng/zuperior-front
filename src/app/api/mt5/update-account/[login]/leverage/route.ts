// client/src/app/api/mt5/update-account/[login]/leverage/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ login: string }> }
) {
  try {
    const { login } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leverage } = body;

    if (!leverage) {
      return NextResponse.json(
        { success: false, message: 'Leverage is required' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const response = await fetch(`${API_URL}/mt5/update-account/${login}/leverage`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leverage }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to update leverage'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error updating leverage:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

