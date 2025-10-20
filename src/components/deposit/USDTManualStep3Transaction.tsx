// client/src/components/deposit/USDTManualStep3Transaction.tsx

"use client";

import React, { useState, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface USDTManualStep3TransactionProps {
  amount: string;
  selectedAccount: string;
  transactionId: string;
  setTransactionId: (id: string) => void;
  proofFile: File | null;
  setProofFile: (file: File | null) => void;
  nextStep: () => void;
}

export function USDTManualStep3Transaction({
  amount,
  selectedAccount,
  transactionId,
  setTransactionId,
  proofFile,
  setProofFile,
  nextStep,
}: USDTManualStep3TransactionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload only images (JPEG, PNG) or PDF files"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "File size must be less than 5MB"
        });
        return;
      }

      setProofFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setProofFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("File removed");
  };

  const handleContinue = () => {
    if (!transactionId.trim()) {
      toast.error("Transaction ID required", {
        description: "Please enter the transaction ID/hash to continue.",
      });
      return;
    }

    toast.success("Transaction details verified", {
      description: "Creating payment request...",
    });
    nextStep();
  };

  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-2xl text-center font-bold dark:text-white/75 text-black mb-6">
        Transaction Details
      </h2>

      {/* Transaction ID Field */}
      <div className="mt-4 w-full">
        <div className="rounded-lg">
          <div className="mt-4">
            <Label className="text-sm dark:text-white/75 text-black mb-1">
              Transaction ID/Hash *
            </Label>
            <Input
              placeholder="Enter transaction hash"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="dark:text-white/75 text-black border-[#362e36] p-5 focus-visible:ring-blue-600 w-full"
            />
            <p className="text-xs text-white/60 mt-1">
              Enter the transaction hash from your USDT transfer
            </p>
          </div>
        </div>
      </div>

      {/* Payment Proof Upload */}
      <div className="mt-6 w-full">
        <div className="rounded-lg">
          <div className="mt-4">
            <Label className="text-sm dark:text-white/75 text-black mb-1">
              Transaction Proof (Optional)
            </Label>
            <div className="space-y-3">
              {!proofFile ? (
                <div
                  className="border-2 border-dashed border-[#362e36] dark:border-[#362e36] rounded-lg p-6 text-center cursor-pointer hover:border-[#8046c9] transition-colors"
                  onClick={handleFileUpload}
                >
                  <Upload className="mx-auto h-8 w-8 text-[#945393] mb-2" />
                  <p className="text-sm dark:text-white/75 text-black">
                    Click to upload transaction proof
                  </p>
                  <p className="text-xs text-[#945393] mt-1">
                    Images (JPEG, PNG) or PDF files up to 5MB
                  </p>
                </div>
              ) : (
                <div className="border border-[#362e36] dark:border-[#362e36] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-[#8046c9]" />
                    <div>
                      <p className="text-sm font-medium dark:text-white/75 text-black">{proofFile.name}</p>
                      <p className="text-xs text-[#945393]">
                        {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 border-red-300"
                  >
                    Remove
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <Button
          className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
          onClick={handleContinue}
        >
          Create Payment Request
        </Button>
      </div>
    </div>
  );
}