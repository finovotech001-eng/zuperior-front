// Utility to request an OTP email via the serverless route.
// Note: The route generates the OTP and uses the built-in branded template with the Zuperior logo.
export const sendOtpEmail = async (to: string, name?: string) => {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: to, name }),
  });
  const data = await res.json();
  return !!data?.success;
};
