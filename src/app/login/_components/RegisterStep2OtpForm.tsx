import React, { useEffect, useRef } from "react";
import OtpInput from "react-otp-input";

interface RegisterStep2OtpFormProps {
  otp: string;
  setOtp: (val: string) => void;
  resendCooldown: number;
  sendOtp: () => void;
  validationErrors: { [key: string]: string };
  clearError: (field: string) => void;
  onComplete: () => void; // New prop
}

const RegisterStep2OtpForm: React.FC<RegisterStep2OtpFormProps> = ({
  otp,
  setOtp,
  resendCooldown,
  sendOtp,
  validationErrors,
  clearError,
  onComplete,
}) => {
  const otpCompletedRef = useRef(false);

  useEffect(() => {
    if (otp.length === 6 && !otpCompletedRef.current) {
      onComplete();
      otpCompletedRef.current = true;
    } else if (otp.length < 6) {
      otpCompletedRef.current = false;
    }
  }, [otp, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-300 text-center mb-2">
        Enter the 6-digit code sent to your email/phone.
        <br />
        <span className="text-xs text-gray-400">
          This code is valid for 10 minutes.
        </span>
      </p>
      <OtpInput
        value={otp}
        onChange={(val) => {
          setOtp(val.trim());
          clearError("otp");
        }}
        shouldAutoFocus
        numInputs={6}
        renderInput={(props, idx) => (
          <input
            {...props}
            key={idx}
            inputMode="numeric"
            className={`!w-13 h-13 text-center text-2xl font-mono rounded-md outline-none bg-[#181A1B] text-white border transition ${
              validationErrors.otp
                ? "border-red-500"
                : "border-gray-600 focus:border-purple-500"
            }`}
          />
        )}
        containerStyle="flex justify-center gap-3"
      />
      {validationErrors.otp && (
        <p className="text-red-400 text-xs mt-1 animate-pulse text-center">
          {validationErrors.otp}
        </p>
      )}
      <button
        type="button"
        className={`text-xs mt-2 ${
          resendCooldown
            ? "text-gray-500 cursor-not-allowed"
            : "text-purple-400 cursor-pointer"
        }`}
        onClick={sendOtp}
        disabled={Boolean(resendCooldown)}
      >
        {resendCooldown
          ? `Resend OTP in ${resendCooldown}s`
          : "Didn't get it? Resend OTP"}
      </button>
    </div>
  );
};

export default RegisterStep2OtpForm;
