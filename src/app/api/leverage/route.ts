import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: NextRequest) {
  const bodyText = await req.text();
  const inputParams = new URLSearchParams(bodyText);

  const access_token = inputParams.get("access_token");
  const account_number = inputParams.get("account_number");
  const currency = inputParams.get("currency");
  const requested_leverage = inputParams.get("requested_leverage");

  if (!access_token || !account_number || !currency || !requested_leverage) {
    return NextResponse.json(
      {
        message:
          "Missing required fields: access_token, account_number, currency, requested_leverage.",
      },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.append("request", "ChangeLeverageOnTicket");
  params.append("access_token", access_token);
  params.append("account_number", account_number);
  params.append("platform", "MT5");
  params.append("currency", currency);
  params.append("requested_leverage", requested_leverage);
  params.append("title", "Request Change leverage");
  params.append("ticket_type", "Change leverage");

  try {
    const response = await axios.post(
      "http://client.api.skaleapps.io/api/v-2",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
        { message: "Unexpected error occurred", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during Skale API call");
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const access_token = searchParams.get("access_token");
  const account_number = searchParams.get("account_number");
  const currency = searchParams.get("currency");

  if (!access_token || !account_number || !currency) {
    return NextResponse.json(
      {
        message:
          "Missing required fields: access_token, account_number, currency.",
      },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.append("request", "GetAvailableLeverages");
  params.append("access_token", access_token);
  params.append("account_number", account_number);
  params.append("platform", "MT5");
  params.append("currency", currency);

  try {
    const response = await axios.post(
      "http://client.api.skaleapps.io/api/v-2",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
        { message: "Unexpected error occurred", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during Skale API call");
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
