// app/api/kyc/document/route.ts
// Updated to use backend API instead of calling Shufti Pro directly
import { DocumentKYCRequestBody, DocumentKYCResponse } from "@/types/kyc";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(request: Request) {
  let body: DocumentKYCRequestBody;
  
  try {
    body = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log('📝 Document Verification Request (forwarding to backend):', {
      reference: body.reference,
      documentType: body.document?.supported_types,
      hasToken: !!token
    });

    // Forward request to backend API
    const response = await fetch(`${BACKEND_API_URL}/kyc/submit-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      console.error('❌ Backend API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        {
          error: errorData.message || errorData.error || 'Failed to submit document for verification',
          success: false,
          details: errorData.details || errorData.error
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('✅ Document submitted successfully:', {
      reference: body.reference,
      status: data.data?.kyc?.verificationStatus
    });

    // Transform backend response to match expected frontend format
    const kycResponse: DocumentKYCResponse = {
      reference: body.reference,
      event: data.data?.event || 'request.pending',
      error: '',
      verification_url: data.data?.verification_url || '',
      verification_result: {
        document: {
          status: data.data?.kyc?.verificationStatus === 'Pending' ? 'pending' : 'accepted',
          message: data.message || 'Document submitted for verification'
        }
      },
      additional_data: {
        document: {
          proof: {
            dob: '',
            full_name: `${body.document.name.first_name} ${body.document.name.last_name}`,
            document_number: ''
          }
        }
      },
      declined_reason: null
    };

    return NextResponse.json(kycResponse);

  } catch (error: any) {
    console.error("❌ KYC verification error:", error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        success: false,
        status: 500
      },
      { status: 500 }
    );
  }
}
