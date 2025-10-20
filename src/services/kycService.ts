// KYC Service - Handles KYC verification operations
import axios from "axios";

// Create axios instance for KYC operations
const kycApi = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token interceptor
kycApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface UpdateKycResponse {
  status: string;
  status_code: string;
}

interface KycStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    isDocumentVerified: boolean;
    isAddressVerified: boolean;
    verificationStatus: string;
    documentReference?: string;
    addressReference?: string;
    amlReference?: string;
    documentSubmittedAt?: string;
    addressSubmittedAt?: string;
    rejectionReason?: string;
  };
}

// Create KYC record
export async function createKycRecord() {
  try {
    const response = await kycApi.post('/api/kyc/create-record');
    return response.data;
  } catch (error: any) {
    // If KYC record already exists, that's fine - return success
    if (error.response?.status === 200 && error.response?.data?.success) {
      return error.response.data;
    }
    console.error("Error creating KYC record:", error?.response?.data || error.message);
    throw error;
  }
}

// Update document verification status
export async function updateDocumentStatus(data: {
  documentReference: string;
  isDocumentVerified: boolean;
  amlReference?: string;
}) {
  try {
    const response = await kycApi.put('/api/kyc/update-document', data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating document status:", error?.response?.data || error.message);
    throw error;
  }
}

// Update address verification status
export async function updateAddressStatus(data: {
  addressReference: string;
  isAddressVerified: boolean;
}) {
  try {
    const response = await kycApi.put('/api/kyc/update-address', data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating address status:", error?.response?.data || error.message);
    throw error;
  }
}

// Get KYC status
export async function getKycStatus(): Promise<KycStatusResponse> {
  try {
    const response = await kycApi.get<KycStatusResponse>('/api/kyc/status');
    return response.data;
  } catch (error: any) {
    console.error("Error fetching KYC status:", error?.response?.data || error.message);
    throw error;
  }
}

// Legacy function - kept for backward compatibility
export async function updateKycStatus(
  email: string,
  accessToken: string,
  verificationStatus: "Partially Verified" | "Verified"
): Promise<UpdateKycResponse | null> {
  try {
    const response = await axios.post<UpdateKycResponse>("/api/kyc", {
      email,
      accessToken,
      verificationStatus,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating KYC status:", error?.response?.data || error.message);
    return null;
  }
}
