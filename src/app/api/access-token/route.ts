import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { env } from "process";

export async function POST() {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", env.CLIENT_API_GRANT_TYPE || "");
    formData.append("client_id", env.CLIENT_API_CLIENT_ID || "");
    formData.append("client_secret", env.CLIENT_API_CLIENT_SECRET || "");

    const response = await axios.post(
      "https://client.api.skaleapps.io/api/authorisation",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: (status) => status < 500,
      }
    );

    // Return the access token in a consistent format
    return NextResponse.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type,
    });
    
  } catch (error: unknown) {
    const err = error as AxiosError;
    let errorData: unknown = err.response?.data;

    if (typeof errorData === "string") {
      try {
        errorData = JSON.parse(errorData);
      } catch {
        // keep errorData as string if JSON.parse fails
      }
    }

    console.error("Access Token Error:", errorData ?? err.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch access token",
        error: errorData ?? err.message,
      },
      { status: err.response?.status || 500 }
    );
  }
}