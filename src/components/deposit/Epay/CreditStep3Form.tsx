
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CreditStep3Props = {
  amount: string;
  currency: string;
  redirectUrl: string;
  selectedAccount: string;
};

export function CreditStep3Form({
  amount,
  currency,
  redirectUrl,
  selectedAccount,
}: CreditStep3Props) {
  const accountDetails = selectedAccount
    ? {
        accountNumber: selectedAccount.split("|")[0],
        accountType: selectedAccount.split("|")[1],
      }
    : null;

  const handleRedirect = () => {
    if (!redirectUrl) {
      toast.error("Redirect URL missing", {
        description: "Payment link is not available. Please try again.",
      });
      return;
    }

    toast.success("Redirecting to Payment", {
      description: "You will be taken to the payment gateway.",
    });

    window.location.href = redirectUrl;
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-6">
      <h2 className="text-2xl font-bold dark:text-white/75 text-black">
        Pay {amount} {currency.toUpperCase()}
      </h2>

      {accountDetails && (
        <div className="dark:bg-[#070307] bg-white rounded-lg p-4 text-left">
          <div className="flex justify-between mb-2">
            <span className="dark:text-white/75 text-black">Account Number:</span>
            <span className="dark:text-white/75 text-black">{accountDetails.accountNumber}</span>
          </div>
           <div className="flex justify-between">
            <span className="dark:text-white/75 text-black">Currency:</span>
            <span className="dark:text-white/75 text-black">{currency}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="dark:text-white/75 text-black">Amount:</span>
            <span className="dark:text-white/75 text-black">{amount}</span>
          </div>
        </div>
      )}

      <Button
        className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75 text-black hover:bg-[#9d6ad9]"
        onClick={handleRedirect}
      >
        Deposit
      </Button>
    </div>
  );
}