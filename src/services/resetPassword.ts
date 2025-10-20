import axios from 'axios';

interface ResetPasswordParams {
    email: string;
    accessToken: string;
    newPassword: string;
    confirmPassword: string;
    oldPassword: string;
}

interface ResetPasswordResponse {
    status: string;
    status_code: string;
    account_email?: string;
    error?: string;
    // Add other fields as needed based on your API response
}

export async function resetPassword(params: ResetPasswordParams): Promise<ResetPasswordResponse> {    
    try {
        const response = await axios.post<ResetPasswordResponse>('/api/password/reset', {
            email: params.email,
            accessToken: params.accessToken,
            newPassword: params.newPassword,
            confirmPassword: params.confirmPassword,
            oldPassword: params.oldPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}