import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nodemailer from "nodemailer";
import { renderPasswordChangedEmail } from "@/utils/sendPasswordChangedEmail";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const request = "ResetPassword";
  const email = body.email;
  const access_token = body.accessToken;
  const new_password = body.newPassword;
  const confirm_password = body.confirmPassword;
  const old_password = body.oldPassword;

  if (!request || !email || !access_token) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append("access_token", access_token);
    urlencoded.append("request", request);
    urlencoded.append("email", email);
    urlencoded.append("new_password", new_password);
    urlencoded.append("confirm_password", confirm_password);
    urlencoded.append("old_password", old_password);
    const response = await axios.post(
      "https://client.api.skaleapps.io/api/v-2/",
      urlencoded.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // If password change is successful, send the email
    if (response.data.status === "Success" || response.data.status_code === "1") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const html = await renderPasswordChangedEmail();

      try {
        console.log("Attempting to send email to:", email);
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Your Password Has Been Changed",
          html,
        });
        console.log("Email sent! Message ID:", info.messageId);
      } catch (mailErr) {
        console.error("Mail send error:", mailErr);
      }
    }

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