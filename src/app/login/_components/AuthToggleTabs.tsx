import React from "react";

interface AuthToggleTabsProps {
  isCreateAccount: boolean;
  setIsCreateAccount: (val: boolean) => void;
  setStep: (val: number) => void;
  clearValidationErrors: () => void;
}

const AuthToggleTabs: React.FC<AuthToggleTabsProps> = ({
  isCreateAccount,
  setIsCreateAccount,
  setStep,
  clearValidationErrors,
}) => {
  return (
    <div className="flex justify-evenly space-x-6 mb-6 border-b border-gray-700">
      <button
        type="button"
        className={`w-1/2 pb-1 text-[16px] ${
          isCreateAccount
            ? "text-purple-500 border-b-2 border-purple-500"
            : "text-gray-400"
        } cursor-pointer`}
        onClick={() => {
          setIsCreateAccount(true);
          setStep(1);
          clearValidationErrors();
        }}
      >
        Create account
      </button>
      <button
        type="button"
        className={`w-1/2 pb-1 text-[16px] ${
          !isCreateAccount
            ? "text-purple-500 border-b-2 border-purple-500"
            : "text-gray-400"
        } cursor-pointer`}
        onClick={() => {
          setIsCreateAccount(false);
          setStep(1);
          clearValidationErrors();
        }}
      >
        Sign in
      </button>
    </div>
  );
};

export default AuthToggleTabs;
