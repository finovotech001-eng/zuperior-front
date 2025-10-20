import React, { useRef } from "react";
import EyeIcon from "@/components/EyeIcon";

interface LoginFormProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  validationErrors: { [key: string]: string };
  clearFieldError: (fieldName: string) => void;
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
  forgotMode: boolean;
  setForgotMode: (val: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  validationErrors,
  clearFieldError,
  passwordVisible,
  setPasswordVisible,
  forgotMode,
  setForgotMode,
}) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const getInputClassName = (fieldName: string) =>
    `w-full bg-[#1a1a1a] p-3 rounded text-white text-sm focus:outline-none ${
      validationErrors[fieldName]
        ? "border border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/20"
        : "border border-transparent focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/20"
    }`;

  // Focus password input on ArrowDown from email input
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  // Focus email input on ArrowUp from password input
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      emailRef.current?.focus();
    }
  };

  return (
    <>
      <div>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className={getInputClassName("email")}
          value={loginEmail}
          onChange={(e) => {
            setLoginEmail(e.target.value);
            clearFieldError("email");
          }}
          onKeyDown={handleEmailKeyDown}
          aria-invalid={!!validationErrors.email}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
        />
        {validationErrors.email && (
          <p
            id="email-error"
            className="text-red-400 text-xs mt-1 animate-pulse"
            role="alert"
          >
            {validationErrors.email}
          </p>
        )}
      </div>
      {!forgotMode && (
        <>
          <div className="relative">
            <div className="relative">
              <input
                ref={passwordRef}
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className={`${getInputClassName("password")} pr-10`}
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  clearFieldError("password");
                }}
                onKeyDown={handlePasswordKeyDown}
                aria-invalid={!!validationErrors.password}
                aria-describedby={
                  validationErrors.password ? "password-error" : undefined
                }
              />
              <EyeIcon
                visible={passwordVisible}
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
            {validationErrors.password && (
              <p
                id="password-error"
                className="text-red-400 text-xs mt-1 animate-pulse"
                role="alert"
              >
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="mt-2 text-left">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-sm text-blue-500 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LoginForm;
