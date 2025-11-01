// client/src/app/api/mt5/accounts-with-balance/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Prefer a server-only var if provided, else fall back to NEXT_PUBLIC_*
const API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // CRITICAL: Short timeout for rapid polling (300ms) - fail fast if backend is unreachable
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 seconds max - fail fast

    // Get cache-busting param from query string
    const { searchParams } = new URL(request.url);
    const cacheBuster = searchParams.get('_t') || Date.now().toString();
    
    // Aggressive cache busting - multiple query params
    const cacheBuster2 = Date.now();
    const url = `${API_URL}/mt5/accounts-with-balance?_t=${cacheBuster}&_nocache=${cacheBuster2}&_fresh=${Date.now()}`;
    
    console.log(`[Next.js API] 🚀 Fetching accounts with balance from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-ID': `fresh-${Date.now()}-${Math.random()}`, // Additional cache busting header
      },
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 }, // Next.js: never cache
    });

    clearTimeout(timeout);

    if (!response || !response.ok) {
      const errorData = response ? (await response.json().catch(() => ({}))) : {};
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || (!response ? 'Backend unavailable' : 'Failed to fetch accounts with balance')
        },
        { status: response ? response.status : 503 }
      );
    }

    const data = await response.json();
    
    // Log the response to debug
    console.log(`[Next.js API] 📥 Accounts with balance response:`, {
      accountCount: data?.data?.accounts?.length || 0,
      totalBalance: data?.data?.totalBalance || 0
    });

    // The backend returns: { success: true, data: { accounts: [...], totalBalance: ... } }
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error fetching accounts with balance:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

