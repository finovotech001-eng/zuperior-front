import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

    // Parse form data
    const formData = await request.formData();

    // Forward the form data directly to the backend
    const response = await axios.post(`${API_URL}/manual-deposit/create`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let axios set it with boundary for FormData
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating manual deposit:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Internal server error'
      },
      { status: error.response?.status || 500 }
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

    const response = await axios.get(`${API_URL}/manual-deposit/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching manual deposits:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Internal server error'
      },
      { status: error.response?.status || 500 }
    );
  }
}
