// services/tokenService.ts
import axios from "axios";

export interface AccessTokenResponse {
  access_token?: string;
  error?: string;
}

export async function getAccessToken(): Promise<AccessTokenResponse> {
  const response = await axios.post<AccessTokenResponse>("/api/access-token");

  return response.data?.access_token
    ? { access_token: response.data.access_token }
    : { error: response.data.error || "Failed to retrieve access token" };
}
