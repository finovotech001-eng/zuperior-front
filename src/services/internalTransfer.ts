import axios from 'axios';

// Create axios instance with token interceptor
const transferApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Add token interceptor
transferApi.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface InternalTransferParams {
    fromAccount: string;
    toAccount: string;
    amount: number;
    comment?: string;
}

interface InternalTransferResponse {
    success: boolean;
    message: string;
    data?: {
        transferId: string;
        fromAccount: string;
        toAccount: string;
        amount: number;
        fromBalance?: number;
        toBalance?: number;
        sourceTransactionId: string;
        destTransactionId: string;
    };
    error?: string;
}

export async function InternalTransfer(params: InternalTransferParams): Promise<InternalTransferResponse> {
    try {
        const response = await transferApi.post<InternalTransferResponse>('/internal-transfer', {
            fromAccount: params.fromAccount,
            toAccount: params.toAccount,
            amount: params.amount,
            comment: params.comment || 'Internal transfer',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
