import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const targetUrl = 'http://18.130.5.209:5003/api/Users';

    console.log('Proxying users request to:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    // Add CORS headers to the response
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log('Users proxy response status:', response.status);
    console.log('Users proxy response data length:', JSON.stringify(data).length);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error('Users proxy error:', error);
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

export async function POST(request: NextRequest) {
  try {
    const targetUrl = 'http://18.130.5.209:5003/api/Users';

    let body;
    let rawBodyText = '';
    const contentType = request.headers.get('content-type') || '';

    // Read the body as text first to avoid consumption issues
    rawBodyText = await request.text();
    console.log('Raw body text received:', rawBodyText);
    console.log('Content-Type:', contentType);

    if (contentType.includes('application/json')) {
      try {
        body = JSON.parse(rawBodyText);
        console.log('Successfully parsed JSON body:', body);
      } catch (jsonError) {
        console.error('Failed to parse request body as JSON:', jsonError);
        console.error('Raw request body:', rawBodyText);
        return new NextResponse(
          JSON.stringify({
            error: 'Invalid JSON in request body',
            details: jsonError instanceof Error ? jsonError.message : String(jsonError),
            rawBody: rawBodyText
          }),
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data
      try {
        const params = new URLSearchParams(rawBodyText);
        body = Object.fromEntries(params.entries());
        console.log('Successfully parsed form body:', body);
      } catch (formError) {
        console.error('Failed to parse form data:', formError);
        return new NextResponse(
          JSON.stringify({
            error: 'Invalid form data in request body',
            details: formError instanceof Error ? formError.message : String(formError),
            rawBody: rawBodyText
          }),
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      // Handle other content types as text
      body = rawBodyText;
      console.log('Treating as raw text body:', body);
    }

    console.log('Proxying users POST request to:', targetUrl);
    console.log('Request body:', body);
    console.log('Content-Type:', contentType);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Add CORS headers to the response
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log('Users POST proxy response status:', response.status);
    console.log('Users POST proxy response data:', data);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error('Users POST proxy error:', error);
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