import axios from 'axios';

interface ChangePasswordParams {
    accountNumber: string;
    oldPassword?: string; // make optional
    newPassword: string;
    accessToken: string;
}

interface ChangePasswordResponse {
    status: string;
    status_code: string;
    mt4_account?: string;
    error?: string;
    // Add other fields as needed based on your API response
}

export async function changeTpPassword(params: ChangePasswordParams): Promise<ChangePasswordResponse> {    
    try {
        const response = await axios.post<ChangePasswordResponse>('/api/password/tp-password', {
            accountNumber: params.accountNumber,
            oldPassword: params.oldPassword ?? "", // default to empty string
            newPassword: params.newPassword,
            accessToken: params.accessToken,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}