import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Helper to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const buildEmailHtml = (otp: string, name?: string) => `
  <div style="background:#0b0f1a;padding:24px;font-family:Arial,sans-serif;color:#e6e6e6">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#121828;border-radius:12px;overflow:hidden">
      <tr>
        <td style="background:linear-gradient(90deg,#6242a5,#9f8bcf);padding:16px 20px">
          <img src="cid:zuperior-logo" width="28" height="28" style="display:block;border:0;outline:none" alt="Zuperior logo"/>
          <h1 style="margin:0;font-size:20px;color:#fff">Zuperior</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <p style="margin:0 0 12px 0;font-size:14px;color:#cbd5e1">${name ? `Hi ${name},` : "Hi,"}</p>
          <p style="margin:0 0 16px 0;font-size:14px;color:#cbd5e1">Use the one-time code below to verify your email address.</p>
          <div style="letter-spacing:6px;font-weight:700;font-size:28px;text-align:center;color:#fff;margin:18px 0 8px">${otp}</div>
          <p style="margin:0 0 6px 0;font-size:12px;color:#94a3b8;text-align:center">This code will expire in 10 minutes.</p>
          <div style="margin-top:22px;padding:12px 16px;background:#0f172a;border:1px solid #1f2937;border-radius:8px;color:#94a3b8;font-size:12px">
            If you didn't request this email, you can safely ignore it.
          </div>
          <p style="margin-top:24px;font-size:12px;color:#64748b">— Team Zuperior</p>
        </td>
      </tr>
    </table>
  </div>
`;

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.SMTP_FROM || "Zuperior <noreply@zuperior.com>";

  const mailOptions = {
    from,
    to: email,
    subject: "Verify your email • Zuperior",
    text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
    html: buildEmailHtml(otp, name),
    attachments: [
      {
        filename: "logo.png",
        path: `${process.cwd()}/public/logo.png`,
        cid: "zuperior-logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);

    // Set secure cookies to verify later (hash only)
    const res = NextResponse.json({ success: true });
    res.cookies.set("otp_email", email, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
    res.cookies.set("otp_hash", otpHash, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
    res.cookies.set("otp_expires", String(expiresAt), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
    return res;
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
