import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ login: string }> }
) {
  try {
    const { login } = await params;
    // Use MT5 Manager endpoint that returns the client profile
    const targetUrl = `http://18.130.5.209:5003/api/Users/${login}/getClientProfile`;

    console.log('Proxying user profile request to:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      data = responseText;
    }

    // Add CORS headers to the response
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log('User profile proxy response status:', response.status);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error('User profile proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Proxy error', message: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle preflight requests to avoid 405 in some environments
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Provide a minimal HEAD handler
export async function HEAD() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

