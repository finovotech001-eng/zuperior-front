"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string | undefined;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({
  firstName,
  lastName,
  phoneNumber,
  country,
  setFirstName,
  setLastName,
  setPhoneNumber,
  onNext,
}: PersonalInfoStepProps) {
  const displayCountry = !country || country === "Unknown" ? "India" : country;

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      toast.error("Some required information is missing.");
      return;
    }

    toast.success("Personal information confirmed!");
    onNext();
  };

  return (
    <div className="dark:text-white text-black">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-semibold">Verify Your Information</h1>
        <span className="text-sm mt-2 text-center">
          Please confirm that your details match your National Identity Card.
          <br />
          If any information is incorrect, contact support.
        </span>
      </div>
      <Card className="border-0 p-4 bg-white dark:bg-[#01040D] dark:text-white text-black mx-auto max-w-sm">
        <div className="space-y-6">
          <div className="space-y-3">
            <>
              <label htmlFor="country" className="text-xs font-medium mb-1">
                Country
              </label>
              <Input
                id="country"
                placeholder="Country"
                value={displayCountry}
                disabled
                className="border-[#2a3247] bg-white dark:bg-[#01040D] dark:text-white text-black"
              />
            </>
            <>
              <label htmlFor="firstName" className="text-xs font-medium mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-[#2a3247] bg-white dark:bg-[#01040D] dark:text-white text-black"
              />
            </>
            <>
              <label htmlFor="lastName" className="text-xs font-medium mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-[#2a3247] bg-white dark:bg-[#01040D] dark:text-white text-black"
              />
            </>
            <>
              <label htmlFor="phoneNumber" className="text-xs font-medium mb-1">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-[#2a3247] bg-white dark:bg-[#01040D] dark:text-white text-black"
              />
            </>
          </div>

          <Button
            className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white text-black"
            onClick={handleNext}>
            Confirm & Next
          </Button>
          <Link href="/">
            <Button className="w-full bg-white dark:bg-[#01040D] dark:text-white text-black hover:bg-white dark:hover:bg-[#01040D] cursor-pointer underline">
              <MoveLeft className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
