// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Step1Form } from "@/components/deposit/Step1Form";
// import { Step2Confirmation } from "@/components/deposit/Step2Confirmation";
// import { Step3Payment } from "@/components/deposit/Step3Payment";
// import { Step4Status } from "@/components/deposit/Step4Status";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store";
// import btc from "@/assets/bitcoin.png";
// import usdt from "@/assets/tether.png";
// import usdc from "@/assets/binance.png";
// import ethereum from "@/assets/binance.png";
// import solana from "@/assets/binance.png";
// import {
//   CheckoutData,
//   NewAccountDialogProps,
//   PaymentImages,
//   PaymentStatusData,
// } from "./types";

// export function DepositDialog({
//   open,
//   onOpenChange,
//   selectedCrypto,
//   lifetimeDeposit,
// }: NewAccountDialogProps & { lifetimeDeposit: number }) {
//   const [step, setStep] = useState(1);
//   const [amount, setAmount] = useState("");
//   const selectedNetwork = selectedCrypto?.networks[0]?.blockchain ?? "";
//   const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [countdown, setCountdown] = useState(10);
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(
//     null
//   );
//   const [cregisId, setCregisId] = useState<string | null>(null);
//   const [isCheckingStatus, setIsCheckingStatus] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState<string>("");
//   const [exchangeRate, setExchangeRate] = useState<number>(1);

//   const accounts = useSelector((state: RootState) => state.accounts.data);
//   const filteredAccounts = accounts.filter(
//     (acc) => acc.account_type !== "Demo"
//   );

//   const paymentImages: PaymentImages = {
//     USDT: usdt,
//     BTC: btc,
//     USDC: usdc,
//     ETH: ethereum,
//     SOL: solana,
//   };

//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   const checkPaymentStatus = useCallback(
//     async (cregisId: string) => {
//       try {
//         const response = await fetch("/api/checkout-info", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ cregis_id: cregisId }),
//         });

//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);

//         const paymentData = await response.json();
//         const receiveAmount =
//           paymentData.data.payment_info?.[0]?.receive_amount;

//         if (countdown <= 0 && paymentData.data.status === "pending") {
//           return {
//             event_name: paymentData.data.event_name || "",
//             event_type: "expired",
//             order_amount: receiveAmount,
//             paid_amount: paymentData.data.paid_amount || receiveAmount,
//             order_currency: paymentData.data.order_currency,
//             cregis_id: paymentData.data.cregis_id,
//             timestamp: Math.floor(Date.now() / 1000),
//           };
//         }

//         if (!["pending", "new"].includes(paymentData.data.status)) {
//           return {
//             event_name: paymentData.data.event_name || "",
//             event_type: paymentData.data.status,
//             order_amount: receiveAmount,
//             paid_amount: paymentData.data.paid_amount || receiveAmount,
//             order_currency: paymentData.data.order_currency,
//             cregis_id: paymentData.data.cregis_id,
//             timestamp: paymentData.data.created_time
//               ? Math.floor(paymentData.data.created_time / 1000)
//               : Math.floor(Date.now() / 1000),
//           };
//         }
//       } catch (error) {
//         console.error("Error checking payment status:", error);
//       }
//       return null;
//     },
//     [countdown]
//   );

//   useEffect(() => {
//     if (step === 3 && checkoutData?.cregis_id && !paymentStatus) {
//       setCregisId(checkoutData.cregis_id);
//       setIsCheckingStatus(true);

//       const checkStatus = async () => {
//         const status = await checkPaymentStatus(checkoutData.cregis_id);
//         if (status) {
//           setPaymentStatus(status);
//           setIsCheckingStatus(false);
//           setStep(4);
//           if (pollingIntervalRef.current)
//             clearInterval(pollingIntervalRef.current);
//         }
//       };

//       checkStatus();
//       pollingIntervalRef.current = setInterval(checkStatus, 3000);

//       return () => {
//         if (pollingIntervalRef.current)
//           clearInterval(pollingIntervalRef.current);
//       };
//     }
//   }, [step, checkoutData, paymentStatus, checkPaymentStatus]);

//   useEffect(() => {
//     if (step === 3 && checkoutData) {
//       const expireAt = new Date(checkoutData.expire_time).getTime();
//       const now = Date.now();
//       const initialCountdown = Math.max(0, Math.floor((expireAt - now) / 1000));
//       setCountdown(initialCountdown);

//       const interval = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [step, checkoutData]);

//   const nextStep = () => {
//     if (
//       step === 1 &&
//       (!selectedAccount || (selectedCrypto && !selectedNetwork))
//     ) {
//       return;
//     }
//     setStep((prev) => prev + 1);
//   };

//   const prevStep = () => {
//     setStep((prev) => Math.max(1, prev - 1));
//   };

//   const handleContinueToPayment = async () => {
//     if (!amount) {
//       setError("Please enter an amount");
//       return;
//     }

//     if (!selectedAccount) {
//       setError("Please select an account");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const [accountNumber, accountType] = selectedAccount.split("|");

//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           order_amount: amount,
//           order_currency: selectedCrypto?.symbol || "BNB",
//           account_number: accountNumber,
//           account_type: accountType,
//           network: selectedNetwork,
//           crypto_symbol: selectedCrypto?.symbol,
//         }),
//       });

//       const data = await response.json();

//       if (data.code !== "00000") {
//         throw new Error(data.msg || "Payment initiation failed");
//       }

//       setCheckoutData(data.data);

//       const cryptoInfo = data.data.payment_info?.find(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         (item: any) => item.token_symbol === selectedCrypto?.symbol
//       );
//       if (cryptoInfo) {
//         setExchangeRate(Number(cryptoInfo.exchange_rate) || 1);
//       }

//       setStep(3);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Payment initiation failed"
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleRetry = () => {
//     setStep(1);
//     setPaymentStatus(null);
//     setCheckoutData(null);
//     setCregisId(null);
//     if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
//   };

//   const resetAllStates = useCallback(() => {
//     setStep(1);
//     setAmount("");
//     setCheckoutData(null);
//     setIsProcessing(false);
//     setError(null);
//     setCountdown(10);
//     setPaymentStatus(null);
//     setCregisId(null);
//     setIsCheckingStatus(false);
//     setSelectedAccount("");
//     setExchangeRate(1);
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   }, []);

//   useEffect(() => {
//     if (!open) resetAllStates();
//   }, [open, resetAllStates]);

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(isOpen) => {
//         if (!isOpen) resetAllStates();
//         onOpenChange(isOpen);
//       }}
//     >
//       <DialogContent
//         className="border-2 border-transparent p-6 text-white rounded-[18px] flex flex-col items-center w-full
//           [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
//         disableOutsideClick={true}
//       >
//         <DialogTitle className="sr-only">Deposit Funds</DialogTitle>

//         <DialogHeader className="w-full ">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center space-x-2 w-full mx-10">
//               {[1, 2, 3, 4].map((num) => (
//                 <React.Fragment key={num}>
//                   <div
//                     className={`flex h-8 w-8 px-4 mx-0 items-center justify-center rounded-full ${
//                       step >= num ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
//                     }`}
//                   >
//                     <span className="text-sm font-medium">{num}</span>
//                   </div>
//                   {num !== 4 && (
//                     <div
//                       className={`h-[4px] w-full mx-0 ${
//                         step > num ? "bg-[#6B5993]" : "bg-[#392F4F]"
//                       }`}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </DialogHeader>

//         {step === 1 && (
//           <Step1Form
//             amount={amount}
//             setAmount={setAmount}
//             selectedNetwork={selectedNetwork}
//             selectedCrypto={selectedCrypto}
//             nextStep={nextStep}
//             accounts={filteredAccounts}
//             selectedAccount={selectedAccount}
//             setSelectedAccount={setSelectedAccount}
//             lifetimeDeposit={lifetimeDeposit}
//           />
//         )}

//         {step === 2 && (
//           <Step2Confirmation
//             amount={amount}
//             selectedNetwork={selectedNetwork}
//             selectedCrypto={selectedCrypto}
//             paymentMethod={selectedCrypto?.symbol || ""}
//             paymentImages={paymentImages}
//             error={error}
//             isProcessing={isProcessing}
//             selectedAccount={selectedAccount}
//             prevStep={prevStep}
//             handleContinueToPayment={handleContinueToPayment}
//             exchangeRate={exchangeRate}
//           />
//         )}

//         {step === 3 && checkoutData && (
//           <Step3Payment
//             amount={amount}
//             countdown={countdown}
//             selectedCrypto={selectedCrypto}
//             selectedNetwork={selectedNetwork}
//             checkoutData={checkoutData}
//             cregisId={cregisId || ""}
//             isLoading={isCheckingStatus}
//             selectedAccount={selectedAccount}
//           />
//         )}

//         {step === 4 && paymentStatus && (
//           <Step4Status
//             statusData={paymentStatus}
//             onRetry={handleRetry}
//             onClose={() => onOpenChange(false)}
//             accountNumber={selectedAccount.split("|")[0]}
//             amount={amount}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Step1Form } from "@/components/deposit/Step1Form";
import { Step2Confirmation } from "@/components/deposit/Step2Confirmation";
import { Step3Payment } from "@/components/deposit/Step3Payment";
import { Step4Status } from "@/components/deposit/Step4Status";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchUserMt5Accounts } from "../../store/slices/mt5AccountSlice";
import {
  CheckoutData,
  NewAccountDialogProps,
  PaymentImages,
  PaymentStatusData,
} from "./types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { TpAccountSnapshot } from "@/types/user-details";
import { MT5Account } from "@/store/slices/mt5AccountSlice";

// Helper function to map MT5Account to TpAccountSnapshot for deposit dialog
const mapMT5AccountToTpAccount = (mt5Account: MT5Account): TpAccountSnapshot => {
  return {
    tradingplatformaccountsid: parseInt(mt5Account.accountId),
    account_name: parseInt(mt5Account.accountId),
    platformname: "MT5",
    acc: parseInt(mt5Account.accountId),
    account_type: "Live",
    leverage: mt5Account.leverage,
    balance: mt5Account.balance.toString(),
    credit: mt5Account.credit.toString(),
    equity: mt5Account.equity.toString(),
    margin: mt5Account.margin.toString(),
    margin_free: mt5Account.marginFree.toString(),
    margin_level: mt5Account.marginLevel.toString(),
    closed_pnl: mt5Account.profit.toString(),
    open_pnl: "0",
    account_type_requested: "Standard", // Default value for MT5 accounts
    provides_balance_history: true,
    tp_account_scf: {
      tradingplatformaccountsid: parseInt(mt5Account.accountId),
      cf_1479: mt5Account.name
    }
  };
};

export function DepositDialog({
  open,
  onOpenChange,
  selectedCrypto,
  lifetimeDeposit,
}: NewAccountDialogProps & { lifetimeDeposit: number }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const selectedNetwork = selectedCrypto?.networks[0]?.blockchain ?? "";
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(
    null
  );
  const [cregisId, setCregisId] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false); // Add confirmation state

  const dispatch = useDispatch<AppDispatch>();
  const mt5Accounts = useSelector((state: RootState) => state.mt5.accounts);
  const filteredAccounts = mt5Accounts.filter(
    (acc) => acc.isEnabled
  );

  // Dynamic payment images based on selected crypto
  const getPaymentImages = (): PaymentImages => {
    const images: PaymentImages = {};
    
    if (selectedCrypto) {
      // Use the icon from the selected crypto
      images[selectedCrypto.symbol] = selectedCrypto.icon;
    }
    
    return images;
  };

  const paymentImages = getPaymentImages();

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch MT5 accounts when dialog opens
  useEffect(() => {
    if (open && mt5Accounts.length === 0) {
      console.log('🔄 DepositDialog: Fetching MT5 accounts...');
      dispatch(fetchUserMt5Accounts());
    }
  }, [open, dispatch, mt5Accounts.length]);

  const checkPaymentStatus = useCallback(
    async (cregisId: string) => {
      try {
        const response = await fetch("/api/checkout-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cregis_id: cregisId }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const paymentData = await response.json();
        const receiveAmount =
          paymentData.data.payment_info?.[0]?.receive_amount;

        if (countdown <= 0 && paymentData.data.status === "pending") {
          return {
            event_name: paymentData.data.event_name || "",
            event_type: "expired",
            order_amount: receiveAmount,
            paid_amount: paymentData.data.paid_amount || receiveAmount,
            order_currency: paymentData.data.order_currency,
            cregis_id: paymentData.data.cregis_id,
            timestamp: Math.floor(Date.now() / 1000),
          };
        }

        if (!["pending", "new"].includes(paymentData.data.status)) {
          return {
            event_name: paymentData.data.event_name || "",
            event_type: paymentData.data.status,
            order_amount: receiveAmount,
            paid_amount: paymentData.data.paid_amount || receiveAmount,
            order_currency: paymentData.data.order_currency,
            cregis_id: paymentData.data.cregis_id,
            timestamp: paymentData.data.created_time
              ? Math.floor(paymentData.data.created_time / 1000)
              : Math.floor(Date.now() / 1000),
          };
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
      return null;
    },
    [countdown]
  );

  useEffect(() => {
    if (step === 3 && checkoutData?.cregis_id && !paymentStatus) {
      setCregisId(checkoutData.cregis_id);
      setIsCheckingStatus(true);

      const checkStatus = async () => {
        const status = await checkPaymentStatus(checkoutData.cregis_id);
        if (status) {
          setPaymentStatus(status);
          setIsCheckingStatus(false);
          setStep(4);
          if (pollingIntervalRef.current)
            clearInterval(pollingIntervalRef.current);
        }
      };

      checkStatus();
      pollingIntervalRef.current = setInterval(checkStatus, 3000);

      return () => {
        if (pollingIntervalRef.current)
          clearInterval(pollingIntervalRef.current);
      };
    }
  }, [step, checkoutData, paymentStatus, checkPaymentStatus]);

  useEffect(() => {
    if (step === 3 && checkoutData) {
      const expireAt = new Date(checkoutData.expire_time).getTime();
      const now = Date.now();
      const initialCountdown = Math.max(0, Math.floor((expireAt - now) / 1000));
      setCountdown(initialCountdown);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, checkoutData]);

  const nextStep = () => {
    if (
      step === 1 &&
      (!selectedAccount || (selectedCrypto && !selectedNetwork))
    ) {
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleContinueToPayment = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    if (!selectedAccount) {
      setError("Please select an account");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const [accountNumber, accountType] = selectedAccount.split("|");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_amount: amount,
          order_currency: selectedCrypto?.symbol || "BNB",
          account_number: accountNumber,
          account_type: accountType,
          network: selectedNetwork,
          crypto_symbol: selectedCrypto?.symbol,
        }),
      });

      const data = await response.json();

      if (data.code !== "00000") {
        throw new Error(data.msg || "Payment initiation failed");
      }

      setCheckoutData(data.data);

      const cryptoInfo = data.data.payment_info?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.token_symbol === selectedCrypto?.symbol
      );
      if (cryptoInfo) {
        setExchangeRate(Number(cryptoInfo.exchange_rate) || 1);
      }

      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment initiation failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setStep(1);
    setPaymentStatus(null);
    setCheckoutData(null);
    setCregisId(null);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
  };

  // Handle close confirmation for Step 3
  const handleClosePayment = () => {
    setConfirmCloseOpen(true);
  };

  // Handle confirmed close from Step 3
  const handleConfirmClose = () => {
    setConfirmCloseOpen(false);
    resetAllStates();
    onOpenChange(false);
  };

  const resetAllStates = useCallback(() => {
    setStep(1);
    setAmount("");
    setCheckoutData(null);
    setIsProcessing(false);
    setError(null);
    setCountdown(10);
    setPaymentStatus(null);
    setCregisId(null);
    setIsCheckingStatus(false);
    setSelectedAccount("");
    setExchangeRate(1);
    setConfirmCloseOpen(false); // Reset confirmation state
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) resetAllStates();
  }, [open, resetAllStates]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (step === 3 && !isOpen) {
            // When user tries to close during payment, show confirmation
            handleClosePayment();
          } else if (!isOpen) {
            resetAllStates();
            onOpenChange(isOpen);
          }
        }}
      >
        <DialogContent
          className="border-2 border-transparent p-6 text-white rounded-[18px] flex flex-col items-center w-full
            [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
          disableOutsideClick={step === 3} // Prevent outside clicks only during payment step
        >
          <DialogTitle className="sr-only">Deposit Funds</DialogTitle>

          <DialogHeader className="w-full ">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 w-full mx-10">
                {[1, 2, 3, 4].map((num) => (
                  <React.Fragment key={num}>
                    <div
                      className={`flex h-8 w-8 px-4 mx-0 items-center justify-center rounded-full ${
                        step >= num ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                      }`}
                    >
                      <span className="text-sm font-medium">{num}</span>
                    </div>
                    {num !== 4 && (
                      <div
                        className={`h-[4px] w-full mx-0 ${
                          step > num ? "bg-[#6B5993]" : "bg-[#392F4F]"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </DialogHeader>

          {step === 1 && (
            <Step1Form
              amount={amount}
              setAmount={setAmount}
              selectedNetwork={selectedNetwork}
              selectedCrypto={selectedCrypto}
              nextStep={nextStep}
              accounts={filteredAccounts.map(mapMT5AccountToTpAccount)}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              lifetimeDeposit={lifetimeDeposit}
            />
          )}

          {step === 2 && (
            <Step2Confirmation
              amount={amount}
              selectedNetwork={selectedNetwork}
              selectedCrypto={selectedCrypto}
              paymentMethod={selectedCrypto?.symbol || ""}
              paymentImages={paymentImages}
              error={error}
              isProcessing={isProcessing}
              selectedAccount={selectedAccount}
              prevStep={prevStep}
              handleContinueToPayment={handleContinueToPayment}
              exchangeRate={exchangeRate}
            />
          )}

          {step === 3 && checkoutData && (
            <Step3Payment
              amount={amount}
              countdown={countdown}
              selectedCrypto={selectedCrypto}
              selectedNetwork={selectedNetwork}
              checkoutData={checkoutData}
              cregisId={cregisId || ""}
              isLoading={isCheckingStatus}
              selectedAccount={selectedAccount}
              onClose={handleClosePayment} // Pass the close handler
            />
          )}

          {step === 4 && paymentStatus && (
            <Step4Status
              statusData={paymentStatus}
              onRetry={handleRetry}
              onClose={() => onOpenChange(false)}
              accountNumber={selectedAccount.split("|")[0]}
              amount={amount}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Step 3 */}
      <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <DialogContent className="sm:max-w-[400px] p-4">
          <DialogHeader>
            <DialogTitle>Confirm Close</DialogTitle>
            <DialogDescription className="mt-4 text-sm text-muted-foreground">
              Are you sure you want to close this? Your payment process may be
              interrupted and you might lose your progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setConfirmCloseOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Close Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}