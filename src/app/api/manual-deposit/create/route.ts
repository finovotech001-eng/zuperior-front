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
    const mt5AccountId = formData.get('mt5AccountId') as string;
    const amount = formData.get('amount') as string;
    const transactionHash = formData.get('transactionHash') as string;
    const proofFile = formData.get('proofFile') as File;

    // Validate required fields
    if (!mt5AccountId || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: mt5AccountId, amount' },
        { status: 400 }
      );
    }

    // Prepare request data
    const requestData: any = {
      mt5AccountId,
      amount: parseFloat(amount),
    };

    if (transactionHash) {
      requestData.transactionHash = transactionHash;
    }

    // Handle file upload if present
    if (proofFile) {
      // For now, we'll store the file name and type
      // In production, you'd upload to cloud storage and get URL
      requestData.proofFileUrl = `manual_deposit_${Date.now()}_${proofFile.name}`;
    }

    const response = await axios.post(`${API_URL}/manual-deposit/create`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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
