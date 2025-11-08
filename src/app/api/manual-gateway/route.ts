import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'wire';
    const token = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${API_URL}/manual-gateway?type=${encodeURIComponent(type)}`, {
      headers,
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch manual gateway' }, { status: 500 });
  }
}
