import { api } from './api.service';

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
  // Call our Next API which proxies to backend
  const response = await api.put<ResetPasswordResponse>('/api/user/password', {
    oldPassword: params.oldPassword,
    newPassword: params.newPassword,
    confirmPassword: params.confirmPassword,
  });
  return response.data as any;
}
