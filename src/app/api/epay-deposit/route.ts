import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const inputParams = new URLSearchParams(bodyText);

  const account_number = inputParams.get("account_number");
  const amount = inputParams.get("amount");
  const access_token = inputParams.get("access_token");

  if (!account_number || !amount || !access_token) {
    return NextResponse.json(
      { message: "Missing required fields: account_number, amount, or access_token." },
      { status: 400 }
    );
  }

  // Final body to be sent to Skale API
  const params = new URLSearchParams();
  params.append("request", "CreateFinancesToTradingPlatform");
  params.append("account_number", account_number);
  params.append("amount", amount);
  params.append("access_token", access_token);
  params.append("platform", "MT5");
  params.append("currency", "USD");
  params.append("psp", "Epay");
  params.append("type", "Deposit");
  params.append("crm_comment", "Deposit by Epay");

  try {
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
      console.error("Skale API AxiosError:", error.response?.data || error.message);
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
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
