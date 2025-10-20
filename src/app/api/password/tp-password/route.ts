import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const request = "ChangeTpPassword";
  const account_number = body.accountNumber;
  const access_token = body.accessToken;
  const new_password = body.newPassword;
  const old_password = body.oldPassword ?? ""; // default to empty string if not provided

  if (
    !request ||
    !account_number ||
    !access_token ||
    !new_password
    // remove !old_password from here
  ) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append("access_token", access_token);
    urlencoded.append("request", request);
    urlencoded.append("account_number", account_number);
    urlencoded.append("old_password", old_password);
    urlencoded.append("new_password", new_password);
    const response = await axios.post(
      "https://client.api.skaleapps.io/api/v-2/",
      urlencoded.toString(),
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
