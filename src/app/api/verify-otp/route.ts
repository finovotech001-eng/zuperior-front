import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Missing email or otp" }, { status: 400 });
    }

    const cookies = req.cookies;
    const savedEmail = cookies.get("otp_email")?.value || "";
    const savedHash = cookies.get("otp_hash")?.value || "";
    const expiresRaw = cookies.get("otp_expires")?.value || "0";
    const expires = parseInt(expiresRaw, 10) || 0;

    if (!savedEmail || !savedHash || !expires) {
      return NextResponse.json({ success: false, message: "OTP not found or expired" }, { status: 400 });
    }

    if (Date.now() > expires) {
      const resp = NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
      resp.cookies.delete("otp_email");
      resp.cookies.delete("otp_hash");
      resp.cookies.delete("otp_expires");
      return resp;
    }

    if (savedEmail.toLowerCase() !== String(email).toLowerCase()) {
      return NextResponse.json({ success: false, message: "Email mismatch" }, { status: 400 });
    }

    const compare = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (compare !== savedHash) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    const res = NextResponse.json({ success: true });
    // Mark verified for the subsequent register call
    res.cookies.set("otp_verified", "true", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
    // cleanup
    res.cookies.delete("otp_email");
    res.cookies.delete("otp_hash");
    res.cookies.delete("otp_expires");
    return res;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Verification error" }, { status: 500 });
  }
}

