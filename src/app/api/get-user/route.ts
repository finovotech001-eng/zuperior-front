import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const request = params.get("request");
  const email = params.get("email");
  const access_token = params.get("access_token");

  if (!request || !email || !access_token) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://client.api.skaleapps.io/api/v-2/",
      bodyText,
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
