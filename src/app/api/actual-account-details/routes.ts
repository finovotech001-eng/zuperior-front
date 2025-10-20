import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { request, access_token, account_number, platform_name } = req.body;

  if (!request || !access_token || !account_number || !platform_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("request", request);
    formData.append("access_token", access_token);
    formData.append("account_number", account_number);
    formData.append("platform_name", platform_name);

    const response = await axios.post(
      "https://client.api.skaleapps.io/api/v-2/",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.status(200).json(response.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch data",
    });
  }
}
