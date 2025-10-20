"use client";

import React from "react";
import Image from "next/image";
import profile from "@/assets/kyc/kyc-profile.png";
import face from "@/assets/kyc/kyc-face.png";
import doc from "@/assets/kyc/kyc-doc.png";

interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const stepLabels = ["Personal Information", "ID Verification", "Review & Finish"];
  const stepIcons = [profile, face, doc];

  return (
    <div className="mt-8 flex flex-col items-center">
      {/* Step Labels */}
      <div className="flex w-full max-w-lg justify-between">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <span
              className={`${
                currentStep >= stepNumber ? "dark:text-[#FFFFFF] text-[#000000]" : "text-zinc-500"
              } text-sm`}
            >
              {stepLabels[stepNumber - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* Step Icons with Connecting Lines */}
      <div className="relative w-full max-w-md mt-2 flex items-center justify-between">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between w-full">
          {[1, 2].map((lineNumber) => (
            <div
              key={lineNumber}
              className={`h-[2px] flex-1 ${
                currentStep >= lineNumber + 1 ? "bg-[#49327F]" : "bg-[#49327F]"
              }`}
            />
          ))}
        </div>

        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex h-10 w-10 items-center justify-center rounded-full z-10 ${
              currentStep >= stepNumber ? "bg-[#6242A5]" : stepNumber === 1 ? "bg-[#1a1f2e]" : "bg-[#9F8BCF]"
            }`}
          >
            <Image 
              className="h-6 w-6" 
              src={stepIcons[stepNumber - 1]} 
              alt="" 
            />
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md justify-between mt-3">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <span
              className={`${
                currentStep >= stepNumber ? "dark:text-[#FFFFFF] text-[#000000]" : "text-zinc-500"
              } text-sm`}
            >
              Step {stepNumber}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
