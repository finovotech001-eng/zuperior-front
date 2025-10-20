import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON body from frontend
    const body = await req.json();

    // Mandatory fields
    const { title, parent_id, status, access_token } = body;

    if (!title || !parent_id || !status || !access_token) {
      return NextResponse.json(
        { message: "Missing required fields: title, parent_id, status, or access_token." },
        { status: 400 }
      );
    }

    // Convert JSON -> URLSearchParams
    const params = new URLSearchParams();
    params.append("request", "CreateTicket");
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    // Send to Skale API
    const response = await axios.post(
      "https://client.api.skaleapps.io/api/v-2/",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Skale API AxiosError:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          message: "Failed to call Skale API",
          error: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    } else if (error instanceof Error) {
      console.error("Skale API Error:", error.message);
      return NextResponse.json(
        {
          message: "Unexpected error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during Skale API call");
      return NextResponse.json(
        {
          message: "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
