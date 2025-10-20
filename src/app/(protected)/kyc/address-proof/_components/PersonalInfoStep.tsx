"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setAddress: (value: string) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({
  firstName,
  lastName,
  address,
  phoneNumber,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setAddress,
  onNext,
}: PersonalInfoStepProps) {
  const handleNext = () => {
    if (!firstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    toast.success("Personal information saved successfully!");
    onNext();
  };

  return (
    <div className="dark:text-[#FFFFFF] text-[#000000]">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl">Enter your Personal Information</h1>
        <span className="text-sm mt-2">
          Make sure your information matches your address proof document
        </span>
      </div>
      <Card className="border-0 p-6 bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] mx-auto max-w-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              id="firstName"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-[#2a3247] bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] focus-visible:ring-blue-500"
            />
            <Input
              id="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border-[#2a3247] bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] focus-visible:ring-blue-500"
            />
            <Input
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-[#2a3247] bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] focus-visible:ring-blue-500"
            />

            <Textarea
              id="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2} // makes it roughly two lines tall
              className="w-full border-[#2a3247] bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] focus-visible:ring-blue-500 rounded-md p-2"
            />
          </div>

          <Button
            className="w-full cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-[#FFFFFF] text-[#000000]"
            onClick={handleNext}>
            Save & Next
          </Button>
          <Link href="/">
            <Button className="w-full bg-[#FFFFFF] dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000] hover:bg-[#FFFFFF] dark:hover:bg-[#01040D] cursor-pointer underline">
              <MoveLeft className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
