import axios from 'axios';

interface InternalTransferParams {
    fromAccount: string;
    toAccount: string;
    accessToken: string;
    platformFrom: string;
    platformTo: string;
    ticketAmount: string;
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
        const response = await axios.post<InternalTransferResponse>('/api/internal-transfer', {
            fromAccount: params.fromAccount,
            toAccount: params.toAccount,
            ticketAmount: params.ticketAmount,
            accessToken: params.accessToken,
            platformFrom: params.platformFrom,
            platformTo: params.platformTo,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
