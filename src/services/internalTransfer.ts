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
    status: string;
    status_code: string;
    from_account?: string;
    to_account?: string;
    balanceFrom?: string;
    balanceTo?: string;
    error?: string;
    // Add other fields as needed based on your API response
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
