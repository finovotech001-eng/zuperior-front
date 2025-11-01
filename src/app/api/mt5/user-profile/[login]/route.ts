// client/src/app/api/mt5/user-profile/[login]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Prefer a server-only var if provided, else fall back to NEXT_PUBLIC_*
const API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ login: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { login } = await params;

    if (!login || login === '0' || !/^\d+$/.test(String(login))) {
      return NextResponse.json(
        { success: false, message: 'Valid login parameter is required' },
        { status: 400 }
      );
    }

    // Add a short timeout to fail fast if backend is unreachable
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Get cache-busting param from query string
    const { searchParams } = new URL(request.url);
    const cacheBuster = searchParams.get('_t') || Date.now().toString();
    
    let response = await fetch(`${API_URL}/Users/${login}/getClientProfile?_t=${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      signal: controller.signal,
      cache: 'no-store',
    }).catch((err) => {
      return null as any;
    });

    // If the primary route failed to connect (ECONNREFUSED/aborted), try the alternate backend path once
    if (!response) {
      try {
        response = await fetch(`${API_URL}/mt5/user-profile/${login}?_t=${cacheBuster}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
          signal: controller.signal,
          cache: 'no-store',
        });
      } catch (e) {
        // ignore here; handled below
      }
    }

    clearTimeout(timeout);

    if (!response || !response.ok) {
      const errorData = response ? (await response.json().catch(() => ({}))) : {};
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || (!response ? 'Backend unavailable' : 'Failed to fetch MT5 user profile')
        },
        { status: response ? response.status : 503 }
      );
    }

    const data = await response.json();
    
    // Log the response to debug
    console.log(`[Next.js API] 📥 Response from backend for account ${login}:`, JSON.stringify(data, null, 2));

    // The backend returns: { success: true, data: { Balance: 22556, ... } }
    // We need to ensure this structure is preserved
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching MT5 user profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
