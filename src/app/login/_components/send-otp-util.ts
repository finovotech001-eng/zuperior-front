// Utility to send OTP email (for future use)
export const sendOtpEmail = async (to: string, otp: string) => {
  const htmlTemplate = `
    <div style="font-family:Arial, sans-serif; padding:20px; color:#333;">
      <h2 style="color:#4f46e5;">🔑 Your OTP Code</h2>
      <p>Hi,</p>
      <p>Your one-time password (OTP) is:</p>
      <div style="font-size:24px; font-weight:bold; margin:20px 0; color:#111;">
        ${otp}
      </div>
      <p>This code is valid for the next <b>10 minutes</b>. Do not share it with anyone.</p>
      <hr style="margin:20px 0;">
      <p style="font-size:12px; color:#777;">If you did not request this, please ignore.</p>
    </div>
  `;

  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: htmlTemplate,
    }),
  });

  const data = await res.json();
  return data.success;
};
