import React from "react";

interface SubmitButtonProps {
  globalLoading: boolean;
  loading: boolean;
  isCreateAccount: boolean;
  step: number;
  isForgotPassword?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  globalLoading,
  loading,
  isCreateAccount,
  // step,
  isForgotPassword = false,
}) => {
  const disabled = !!globalLoading || !!loading;
  return (
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] cursor-pointer text-white p-3 rounded mt-2 flex items-center justify-center disabled:opacity-70"
      disabled={disabled}
    >
      {globalLoading || loading ? (
        <svg
          className="animate-spin h-7 w-7"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient
              id="loader-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a259ff" />
              <stop offset="100%" stopColor="#6a3fd9" />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="url(#loader-gradient)"
            strokeWidth="4"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M12 2 a10 10 0 0 1 0 20 a10 10 0 0 1 0-20"
            stroke="url(#loader-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="40"
            strokeDashoffset="10"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )  : isForgotPassword ? ( // 👈 new condition
        "Send Reset Link"
      ) : isCreateAccount ? (
        "Sign Up"
      ) : (
        "Login"
      )}
    </button>
  );
};

export default SubmitButton;
