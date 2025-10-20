import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nodemailer from "nodemailer";
import { renderWelcomeEmail } from "@/utils/renderEmailTemplate";

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data
    const body = await request.json();
    const { first_name, last_name, email, password, country } = body;

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { message: "First name, last name, email, and password are required." },
        { status: 400 }
      );
    }

    // Prepare data for local server
    const name = `${first_name.trim()} ${last_name.trim()}`;

    // Call local server registration
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';
    const response = await axios.post(
      `${baseUrl}/register`,
      {
        name,
        email: email.trim().toLowerCase(),
        password,
        country: country || 'in',
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Setup Nodemailer transporter (only if email credentials are available)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Render the welcome email HTML
      const html = await renderWelcomeEmail();

      // Send the email (don't wait for it to fail the registration)
      transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Welcome to Zuperior!",
        html,
      }).catch(emailError => {
        console.error("Failed to send welcome email:", emailError);
      });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Server API AxiosError:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          message: error.response?.data?.message || "Registration failed",
          error: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    } else if (error instanceof Error) {
      console.error("Server API Error:", error.message);
      return NextResponse.json(
        {
          message: "Unexpected error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during server API call");
      return NextResponse.json(
        {
          message: "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
