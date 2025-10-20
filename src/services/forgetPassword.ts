import axios from 'axios';

interface ForgotPasswordParams {
    email: string;
    accessToken: string;
}

interface ForgotPasswordResponse {
    status: string;
    status_code: string;
    mt4_account?: string;
    error?: string;
    // Add other fields as needed based on your API response
}

export async function forgetPassword(params: ForgotPasswordParams): Promise<ForgotPasswordResponse> {    
    try {
        const response = await axios.post<ForgotPasswordResponse>('/api/password/forget', {
            email: params.email,
            accessToken: params.accessToken,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}