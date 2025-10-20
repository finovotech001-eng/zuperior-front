"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Check,
  Clock,
  X,
  AlertTriangle,
  RefreshCw,
  Copy as CopyIcon,
} from "lucide-react";
import { PaymentStatusData, PaymentStatus } from "./types";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { mt5Service } from "@/services/api.service";

type StatusConfigType = {
  [key in PaymentStatus]: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  };
};

const statusConfig: StatusConfigType = {
  paid: {
    icon: <Check className="h-8 w-8 text-green-500" />,
    title: "Payment Successful",
    description: "Your payment has been processed successfully",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  expired: {
    icon: <X className="h-8 w-8 text-red-500" />,
    title: "Payment Expired",
    description: "The payment window has closed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  partial_paid: {
    icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
    title: "Partial Payment",
    description: "Only part of the payment was received",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  overpaid: {
    icon: <AlertTriangle className="h-8 w-8 text-purple-500" />,
    title: "Overpayment Detected",
    description: "You paid more than the required amount",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  refunded: {
    icon: <Check className="h-8 w-8 text-blue-500" />,
    title: "Payment Refunded",
    description: "Your payment has been refunded",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  paid_remain: {
    icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
    title: "Additional Payment Needed",
    description: "Please pay the remaining amount",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  pending: {
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    title: "Payment Processing",
    description: "Waiting for payment confirmation",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  new: {
    icon: <Clock className="h-8 w-8 text-gray-500" />,
    title: "New Payment",
    description: "A new payment has been initiated",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
};

export function Step4Status({
  statusData,
  onRetry,
  onClose,
  accountNumber,
}: {
  statusData: PaymentStatusData;
  onRetry: () => void;
  onClose: () => void;
  amount: string;
  accountNumber: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depositCompleted, setDepositCompleted] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [hasFetchedCheckoutInfo, setHasFetchedCheckoutInfo] = useState(false);

  const dispatch = useAppDispatch();
  const hasCalledDeposit = useRef(false);
  const hasShownStatusToast = useRef(false);

  useEffect(() => {
    if (!hasShownStatusToast.current) {
      const config =
        statusConfig[statusData.event_type] || statusConfig.pending;
      toast[statusData.event_type === "paid" ? "success" : "info"](
        config.title,
        {
          description: config.description,
          duration: 5000,
        }
      );
      hasShownStatusToast.current = true;
    }
  }, [statusData.event_type]);

  // Fetch checkout info with payment amount
  useEffect(() => {
    const fetchCheckoutInfo = async () => {
      try {
        const response = await fetch("/api/checkout-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cregis_id: statusData.cregis_id }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const payAmount = data?.data?.payment_detail?.[0]?.pay_amount;

        if (payAmount) {
          setReceivedAmount(payAmount);
        } else {
          console.error("No pay_amount found in payment_detail");
          toast.error("Payment details incomplete");
        }
      } catch (err) {
        console.error("Error fetching checkout info:", err);
        toast.error("Failed to fetch payment details");
      } finally {
        setHasFetchedCheckoutInfo(true);
      }
    };

    if (statusData.cregis_id && !hasFetchedCheckoutInfo) {
      fetchCheckoutInfo();
    } else if (!statusData.cregis_id) {
      setHasFetchedCheckoutInfo(true);
    }
  }, [statusData.cregis_id, hasFetchedCheckoutInfo]);

  const handleDeposit = useCallback(async () => {
    if (!receivedAmount || receivedAmount === "0") {
      toast.error("Invalid Amount", {
        description: "Cannot process deposit with zero amount.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      toast.loading("Processing MT5 deposit...", {
        description: "Please wait while we process your transaction.",
      });

      // Use the new MT5 deposit API
      const result = await mt5Service.depositToMt5({
        login: parseInt(accountNumber),
        balance: parseFloat(receivedAmount),
        comment: `Deposit via crypto payment - ${statusData.cregis_id}`
      });

      if (result.success) {
        setDepositCompleted(true);
        toast.success("MT5 Deposit Completed", {
          description:
            "Your funds have been successfully deposited to your MT5 account.",
          duration: 4000,
        });

        setTimeout(() => {
          toast.info("Closing", {
            description: "Returning to dashboard...",
            duration: 2000,
          });
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || "MT5 deposit processing failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "MT5 deposit failed";
      setError(errorMessage);
      toast.error("MT5 Deposit Failed", {
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      setIsProcessing(false);
      toast.dismiss();
    }
  }, [accountNumber, receivedAmount, statusData.cregis_id, onClose]);

  useEffect(() => {
    if (
      statusData.event_type !== "expired" &&
      !depositCompleted &&
      !hasCalledDeposit.current &&
      hasFetchedCheckoutInfo &&
      receivedAmount &&
      receivedAmount !== "0"
    ) {
      hasCalledDeposit.current = true;
      handleDeposit();
    }
  }, [
    statusData.event_type,
    depositCompleted,
    hasFetchedCheckoutInfo,
    receivedAmount,
    handleDeposit,
  ]);

  const handleRetry = () => {
    toast.info("Retrying Payment", {
      description: "Preparing a new payment session...",
    });
    onRetry();
  };

  const handleCopyDetails = () => {
    const details = `Amount: ${receivedAmount} ${statusData.order_currency}
Account: ${accountNumber}
Status: ${statusData.event_type}
Time: ${new Date(statusData.timestamp * 1000).toLocaleString()}`;

    navigator.clipboard
      .writeText(details)
      .then(() => {
        toast.success("Details Copied", {
          description: `Account ${accountNumber} copied to clipboard.`,
        });
      })
      .catch(() => {
        toast.error("Copy Failed", {
          description: "Could not copy details to clipboard.",
        });
      });
  };

  const config = statusConfig[statusData.event_type] || statusConfig.pending;

  const formattedDate = statusData.timestamp
    ? new Date(statusData.timestamp * 1000).toLocaleString()
    : "N/A";

  return (
    <div className="w-full px-6 text-center">
      <div
        className={`mx-auto w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}
      >
        {config.icon}
      </div>
      <h2 className={`text-2xl font-bold mb-2 ${config.color}`}>
        {config.title}
      </h2>
      <p
        className={`mb-6 ${
          depositCompleted ? "text-green-500" : "text-gray-300"
        }`}
      >
        {isProcessing && !depositCompleted
          ? "Processing your deposit..."
          : depositCompleted
          ? "Deposit completed successfully!"
          : config.description}
      </p>

      <div className="bg-[#070307] rounded-lg p-4 mb-6 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="dark:text-white/75 text-black text-sm">Amount</p>
            <p className="text-white">
              {receivedAmount} {statusData.order_currency}
            </p>
          </div>
          <div>
            <p className="dark:text-white/75 text-black text-sm">Account Number</p>
            <div className="flex items-center gap-2">
              <p className="text-white">{accountNumber}</p>
              <button
                onClick={handleCopyDetails}
                className="dark:text-white/75 text-black dark:hover:text-white text-xs"
                title="Copy all details"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="dark:text-white/75 text-black text-sm">Status</p>
            <p className={`capitalize ${config.color}`}>
              {statusData.event_type.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="dark:text-white/75 text-black text-sm">Time</p>
            <p className="dark:text-white/75 text-black">{formattedDate}</p>
          </div>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

      <div className="flex gap-3 justify-center">
        {statusData.event_type === "expired" && (
          <Button
            onClick={handleRetry}
            disabled={isProcessing}
            className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75 text-black font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={onClose}
          className="hover:bg-green-700 bg-green-600 dark:text-white/75 text-black font-semibold px-6 py-2 rounded-lg"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
