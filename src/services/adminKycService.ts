// Admin KYC Service - Handles admin KYC operations

import axios from "axios";

// Create axios instance for admin KYC operations
const adminKycApi = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token interceptor
adminKycApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface KycRequest {
  id: string;
  userId: string;
  isDocumentVerified: boolean;
  isAddressVerified: boolean;
  verificationStatus: string;
  documentReference?: string;
  addressReference?: string;
  amlReference?: string;
  documentSubmittedAt?: string;
  addressSubmittedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    clientId: string;
    phone?: string;
    country?: string;
    createdAt: string;
  };
}

export interface KycListResponse {
  success: boolean;
  data: {
    kycRequests: KycRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface KycDetailResponse {
  success: boolean;
  data: KycRequest;
}

// Get all KYC requests with filtering
export async function getAllKycRequests(params?: {
  page?: number;
  limit?: number;
  verificationStatus?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<KycListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.verificationStatus) queryParams.append('verificationStatus', params.verificationStatus);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await adminKycApi.get<KycListResponse>(
      `/api/admin/kyc?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching KYC requests:", error?.response?.data || error.message);
    throw error;
  }
}

// Get single KYC request by ID
export async function getKycById(id: string): Promise<KycDetailResponse> {
  try {
    const response = await adminKycApi.get<KycDetailResponse>(`/api/admin/kyc/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching KYC request:", error?.response?.data || error.message);
    throw error;
  }
}

// Approve KYC request
export async function approveKyc(id: string): Promise<KycDetailResponse> {
  try {
    const response = await adminKycApi.put<KycDetailResponse>(
      `/api/admin/kyc/${id}/approve`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error approving KYC:", error?.response?.data || error.message);
    throw error;
  }
}

// Reject KYC request
export async function rejectKyc(id: string, rejectionReason: string): Promise<KycDetailResponse> {
  try {
    const response = await adminKycApi.put<KycDetailResponse>(
      `/api/admin/kyc/${id}/reject`,
      { rejectionReason }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error rejecting KYC:", error?.response?.data || error.message);
    throw error;
  }
}

// Update KYC status
export async function updateKycStatus(
  id: string,
  data: {
    verificationStatus?: string;
    rejectionReason?: string;
    isDocumentVerified?: boolean;
    isAddressVerified?: boolean;
  }
): Promise<KycDetailResponse> {
  try {
    const response = await adminKycApi.put<KycDetailResponse>(
      `/api/admin/kyc/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating KYC status:", error?.response?.data || error.message);
    throw error;
  }
}

// Get KYC stats
export async function getKycStats(days: number = 30) {
  try {
    const response = await adminKycApi.get(`/api/admin/kyc/stats?days=${days}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching KYC stats:", error?.response?.data || error.message);
    throw error;
  }
}



