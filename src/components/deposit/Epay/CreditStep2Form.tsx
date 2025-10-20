import { Button } from "@/components/ui/button";
import { CreditStep2Props } from "./types";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { CopyIcon } from "lucide-react";

export function CreditStep2Form({
  amount,
  error,
  isProcessing,
  prevStep,
  selectedAccount,
  currency,
  handleContinueToPayment,
}: CreditStep2Props & {
  selectedAccount: string;
  currency: string;
  handleContinueToPayment: () => void;
}) {
  const hasShownConfirmationToast = useRef(false);

  const accountDetails = selectedAccount
    ? {
        accountNumber: selectedAccount.split("|")[0],
        accountType: selectedAccount.split("|")[1],
      }
    : null;

  useEffect(() => {
    if (!hasShownConfirmationToast.current) {
      const timer = setTimeout(() => {
        toast.success("Details Confirmed", {
          description:
            "Please review your transaction details before proceeding.",
          duration: 4000,
        });
        hasShownConfirmationToast.current = true;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Transaction Error", {
        description: error,
        duration: 5000,
      });
    }
  }, [error]);

  const handleBackClick = () => {
    toast.info("Going Back", {
      description: "Returning to previous step to modify details.",
      duration: 2000,
    });
    prevStep();
  };

  const handleCopyAccountNumber = () => {
    if (accountDetails?.accountNumber) {
      navigator.clipboard
        .writeText(accountDetails.accountNumber)
        .then(() => {
          toast.success("Copied to Clipboard", {
            description: "Account number has been copied.",
          });
        })
        .catch(() => {
          toast.error("Copy Failed", {
            description: "Could not copy account number.",
          });
        });
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl text-center font-bold dark:text-white/75 text-black">
        Pay {amount} {currency.toUpperCase()}
      </h2>

      {accountDetails && (
        <div className="mt-3 rounded-lg ">
          <div className="flex justify-between items-center mb-2">
            <span className="dark:text-white/75 text-black">Currency:</span>
            <span className="dark:text-white/75 text-black">{currency.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="dark:text-white/75 text-black">Account Number:</span>
            <div className="flex items-center gap-2">
              <span className="dark:text-white/75 text-black">{accountDetails.accountNumber}</span>
              <button
                onClick={handleCopyAccountNumber}
                className="dark:text-white/75 text-black hover:text-white text-xs"
                title="Copy account number"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="dark:text-white/75 text-black">Account Type:</span>
            <span className="dark:text-white/75 text-black">
              {accountDetails.accountType
                ? accountDetails.accountType.charAt(0).toUpperCase() +
                  accountDetails.accountType.slice(1)
                : "Not specified"}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        <hr className="border-t border-[#31263a]" />

        <div className="space-y-2 flex justify-between items-center text-sm">
          <p className="dark:text-white/75 text-black">Amount</p>
          <div className="flex items-center gap-2">
            <p className="dark:text-white/75 text-black">
              {amount} {currency}
            </p>
          </div>
        </div>

        <hr className="border-t border-[#31263a]" />

        <div className="p-3 pt-4 flex justify-between rounded-lg items-center text-sm dark:bg-[#221D22]">
          <p className="dark:text-white/75 text-black text-xs font-semibold">To be Deposited</p>
          <p className="text-[#945393] text-lg font-bold">
            {amount} {currency}
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
        )}

        <div className="flex flex-col">
          <Button
            className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
            onClick={handleContinueToPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Continue"
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent cursor-pointer dark:text-white/75 text-black border-none text-xs mt-1 dark:hover:bg-[#090209]"
            onClick={handleBackClick}
            disabled={isProcessing}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
