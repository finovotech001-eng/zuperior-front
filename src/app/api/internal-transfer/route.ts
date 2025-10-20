import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const request = "InternalTransfer";
  const access_token = body.accessToken;
  const from_account = body.fromAccount;
  const to_account = body.toAccount;
  const platform_from = body.platformFrom;
  const platform_to = body.platformTo;
  const ticket_amount = body.ticketAmount;

  if (
    !request ||
    !from_account ||
    !access_token ||
    !to_account ||
    !platform_from ||
    !platform_to ||
    !ticket_amount
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
    urlencoded.append("from_account", from_account);
    urlencoded.append("to_account", to_account);
    urlencoded.append("platform_from", platform_from);
    urlencoded.append("platform_to", platform_to);
    urlencoded.append("ticket_amount", ticket_amount);

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
