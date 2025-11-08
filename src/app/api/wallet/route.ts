import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET(req: Request) {
  const token = req.headers.get('authorization');
  const headers: Record<string, string> = token ? { Authorization: token } : {};
  const r = await fetch(`${API_URL}/wallet`, { headers, cache: 'no-store' });
  const j = await r.json();
  return NextResponse.json(j, { status: r.status });
}

