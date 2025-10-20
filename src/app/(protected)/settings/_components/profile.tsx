"use client";

import tick from "@/assets/icons/tick.png";
import userImage from "@/assets/icons/user.png";
import userImageDark from "@/assets/icons/userDark.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTheme } from "next-themes";
import { TextAnimate } from "@/components/ui/text-animate";
import { CopyButton } from "@/components/CopyButton";
import { memo, useMemo, useCallback, useState } from "react";
import { EmailVerificationDialog } from "./EmailVerificationDialog";

function ProfileComponent() {
  const user = useSelector((state: RootState) => state.user.data);
  const { passwordMask } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState<boolean>(false);

  const formatPhoneNumber = useCallback((phone: string) => {
    if (!phone) return "";
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length === 12) {
      return `+${digitsOnly.substring(0, 2)} ${digitsOnly.substring(2)}`;
    }
    return phone;
  }, []);

  const userDetails = useMemo(() => {
    const fullName = user?.accountname ?? "";
    const firstName = fullName.split(" ")[0] || "";
    const lastName = fullName.split(" ").slice(1).join(" ") || "";
    const phone = formatPhoneNumber(user?.phone || "");

    return [
      ["First Name", firstName],
      ["Last Name", lastName],
      [
        "Email",
        <div key="email" className="flex items-center gap-2">
          <span>{user?.email1 ?? "Not provided"}</span>
          {user?.email1 && (
            <div
              className="flex items-center ml-1 opacity-80 cursor-pointer"
              onClick={() => {
                if (!user?.verification_status) setVerifyDialogOpen(true); // To Do: change the verification status check field
              }}
            >
              <Image
                className="h-4 w-4"
                src={tick}
                alt="Verification status"
                width={16}
                height={16}
              />
              <span
                className={`text-xs ml-1 font-medium ${
                  user?.verification_status
                    ? "text-green-600 dark:text-green-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {user?.verification_status ? "Verified" : "Not Verified"}
              </span>
            </div>
          )}
        </div>,
      ],
      ["Phone No.", phone || "Not provided"],
      ["Password", passwordMask || "Not provided"],
      // ["DOB", ""],
      ["Language", "English"],
      ["Country of Residence", user?.account_bill_ads_general?.bill_country],
      ["Time Region", "Asia"],
    ];
  }, [user, passwordMask, formatPhoneNumber]);

  return (
    <div className="dark:bg-[#01040D] dark:text-[#FFFFFF] text-[#000000]">
      <div className="flex rounded-xl mb-4 items-center justify-between bg-white dark:bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429] border-2 dark:border-[#1D1825] border-gray-300">
        <div className="py-6 px-8 flex items-center w-full">
          <div className="rounded-full flex items-center justify-center mr-4">
            <Image
              className="dark:h-16 w-full h-full dark:w-16"
              src={theme === "dark" ? userImage : userImageDark}
              alt="User profile"
              width={64}
              height={64}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {user?.accountname && (
                    <TextAnimate className="text-2xl font-semibold">
                      {user.accountname}
                    </TextAnimate>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <p className="text-[13px] tracking-[-0.05em] leading-[1.1em] font-semibold text-gray-700 dark:text-white/50">
                    User ID:{" "}
                    <span className="text-[14px] leading-[1.1em] font-semibold text-black dark:text-white/75">
                      {user?.crm_account_id ?? "N/A"}
                    </span>
                  </p>
                  <CopyButton
                    text={user?.crm_account_id?.toString() ?? ""}
                    className="pl-1"
                    size={12}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3 w-full mb-4">
        {userDetails.map(([label, value], index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b-2 border-gray-300 dark:border-[#090B17] pb-2 last:border-b-0"
          >
            <span className="dark:text-white/75 text-[13px] font-semibold leading-[18px] tracking-[-0.02em] text-gray-800">
              {label}
            </span>
            <div className="flex items-center gap-2">
              <span className="dark:text-white/75 text-[13px] font-semibold leading-[18px] tracking-[-0.02em] text-gray-800">
                {value || "Not provided"}
              </span>
            </div>
          </div>
        ))}
      </section>

      <EmailVerificationDialog
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        email={user?.email1 ?? ""}
      />
    </div>
  );
}

export default memo(ProfileComponent);
