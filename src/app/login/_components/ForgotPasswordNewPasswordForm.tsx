import React from "react";
import EyeIcon from "@/components/EyeIcon";

interface ForgotPasswordNewPasswordFormProps {
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
  confirmPasswordVisible: boolean;
  setConfirmPasswordVisible: (visible: boolean) => void;
  validationErrors: { [key: string]: string };
  clearFieldError: (fieldName: string) => void;
}

const ForgotPasswordNewPasswordForm: React.FC<ForgotPasswordNewPasswordFormProps> = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordVisible,
  setPasswordVisible,
  confirmPasswordVisible,
  setConfirmPasswordVisible,
  validationErrors,
  clearFieldError,
}) => {
  const getInputClassName = (fieldName: string) =>
    `w-full bg-[#1a1a1a] p-3 rounded text-white text-sm focus:outline-none ${
      validationErrors[fieldName]
        ? "border border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/20"
        : "border border-transparent focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/20"
    }`;

  return (
    <>
      <div>
        <p className="text-sm text-gray-300 text-center mb-4">
          Enter your new password below.
        </p>
      </div>
      <div className="relative">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="New Password"
          className={`${getInputClassName("newPassword")} pr-10`}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            clearFieldError("newPassword");
          }}
          aria-invalid={!!validationErrors.newPassword}
          aria-describedby={validationErrors.newPassword ? "newPassword-error" : undefined}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <EyeIcon
            visible={passwordVisible}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
        {validationErrors.newPassword && (
          <p
            id="newPassword-error"
            className="text-red-400 text-xs mt-1 animate-pulse"
            role="alert"
          >
            {validationErrors.newPassword}
          </p>
        )}
      </div>
      <div className="relative">
        <input
          type={confirmPasswordVisible ? "text" : "password"}
          placeholder="Confirm Password"
          className={`${getInputClassName("confirmPassword")} pr-10`}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError("confirmPassword");
          }}
          aria-invalid={!!validationErrors.confirmPassword}
          aria-describedby={validationErrors.confirmPassword ? "confirmPassword-error" : undefined}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <EyeIcon
            visible={confirmPasswordVisible}
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
        </div>
        {validationErrors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-red-400 text-xs mt-1 animate-pulse"
            role="alert"
          >
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordNewPasswordForm;

