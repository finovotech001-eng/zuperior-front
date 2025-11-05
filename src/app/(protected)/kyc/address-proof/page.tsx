"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import StepProgress from "./_components/StepProgress";
import PersonalInfoStep from "./_components/PersonalInfoStep";
import AddressVerificationStep from "./_components/AddressVerificationStep";
import VerificationInProgressStep from "./_components/VerificationInProgressStep";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { addressVerification } from "@/services/addressVerification";
import { AddressKYCResponse } from "@/types/kyc";
import { setAddressVerified } from "@/store/slices/kycSlice";
import { useAppDispatch } from "@/store/hooks";
import { createKycRecord, updateAddressStatus } from "@/services/kycService";
import { useEffect } from "react";

export default function AddressVerificationPage() {
  const [step, setStep] = useState(1);
  const user = useSelector((state: RootState) => state.user.data);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Make fields editable by using state
  const [firstName, setFirstName] = useState(user?.accountname.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.accountname.split(" ")[1] || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [declinedReason, setDeclinedReason] = useState("");
  const dispatch = useAppDispatch();

  // Create KYC record on component mount
  useEffect(() => {
    const initKyc = async () => {
      try {
        const result = await createKycRecord();
        if (result.success) {
          console.log("✅ KYC record ready:", result.message);
        }
      } catch (error) {
        console.log("⚠️ KYC initialization issue:", error);
        // Don't show error to user - this is not critical
      }
    };
    initKyc();
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!file || !documentType) {
      toast.error("Please upload a document and select document type");
      return;
    }

    setIsLoading(true);
    toast("Submitting your address for verification...");
    nextStep();

    try {
      const addressVerificationResult: AddressKYCResponse =
        await addressVerification({
          file,
          first_name: firstName,
          last_name: lastName,
          full_address: address,
          selected_document_type: documentType,
        });

      // Backend already stores the addressReference during submission via submitAddress
      // Status updates will come via webhook from Shufti
      // Only update UI status based on Shufti response event
      
      const reference = addressVerificationResult.reference;
      
      if (!reference) {
        console.error("❌ No reference returned from address verification");
        setVerificationStatus("declined");
        toast.error("Failed to get verification reference. Please try again.");
        return;
      }

      if (addressVerificationResult.event === "verification.accepted") {
        // Shufti accepted immediately (rare, usually it's pending)
        setVerificationStatus("verified");
        dispatch(setAddressVerified(true));
        toast.success("Address verification completed successfully!");
      } else if (addressVerificationResult.event === "verification.declined") {
        setVerificationStatus("declined");
        toast.warning("Address verification was declined. Please try again.");
      } else {
        // Usually "request.pending" or "request.received" - verification in progress
        setVerificationStatus("pending");
        toast.success("Address submitted for verification. We'll notify you when it's complete.");
      }

      // Set declined reason if available
      if (addressVerificationResult?.declined_reason) {
        setDeclinedReason(addressVerificationResult.declined_reason);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit address. Please try again.",
        { id: "address-submission" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            firstName={firstName}
            lastName={lastName}
            phoneNumber={phoneNumber}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setPhoneNumber={setPhoneNumber}
            setAddress={setAddress}
            onNext={nextStep}
            address={address}
          />
        );
      case 2:
        return (
          <AddressVerificationStep
            documentType={documentType}
            file={file}
            isDragging={isDragging}
            isLoading={isLoading}
            setDocumentType={setDocumentType}
            setFile={setFile}
            setIsDragging={setIsDragging}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <VerificationInProgressStep
            onNext={nextStep}
            onBack={prevStep}
            isLoading={isLoading}
            verificationStatus={verificationStatus}
            declinedReason={declinedReason}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dark:bg-[#01040D] bg-[#FFFFFF] h-full">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-center font-bold dark:text-[#FFFFFF] text-[#000000]">
            Address Verification
          </h1>
          <StepProgress currentStep={step} />
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
}
