"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import VerificationAlert from "@/components/verification-alert";
import Profile from "./_components/profile";
import VerificationProfile from "./_components/VerificationProfile";
import SecurityTab from "./_components/SecurityTab";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { TextAnimate } from "@/components/ui/text-animate";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { getLifetimeDeposit } from "@/services/depositLimitService";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = store.getState().user.data?.accountname;
  const email = store.getState().user.data?.email1;
  const verificationStatus = store.getState().kyc.verificationStatus;
  const dispatch = useAppDispatch();
  const [remainingLimit, setRemainingLimit] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "profile" | "verification" | "security" | "bank" | "subscriptions"
  >("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      ["profile", "verification", "security", "bank", "subscriptions"].includes(
        tab
      )
    ) {
      setActiveTab(tab as typeof activeTab);
    }
  }, [searchParams]);

  const handleTabChange = useCallback(
    (value: string | undefined) => {
      if (
        value &&
        [
          "profile",
          "verification",
          "security",
          "bank",
          "subscriptions",
        ].includes(value)
      ) {
        router.replace(`/settings?tab=${value}`, { scroll: false });
        setActiveTab(value as typeof activeTab);
      }
    },
    [router]
  );

  const tabs = useMemo(
    () => [
      { value: "profile", label: "Profile" },
      { value: "verification", label: "Verification" },
      { value: "security", label: "Security" },
      // { value: "bank", label: "Bank Accounts" },
      // { value: "subscriptions", label: "My Subscriptions" },
    ],
    []
  );

  useEffect(() => {
    const fetchRemainingLimit = async () => {
      if (!email) {
        setRemainingLimit("");
        return;
      }
      const freshToken = await dispatch(fetchAccessToken()).unwrap();
      const lifetimeDeposit = await getLifetimeDeposit({
        email: email,
        accessToken: freshToken,
      });

      if (verificationStatus === "partial") {
        const remaining = 10000 - lifetimeDeposit;
        setRemainingLimit(`${remaining.toLocaleString()} USD`);
      } else if (verificationStatus === "unverified") {
        const remaining = 5000 - lifetimeDeposit;
        setRemainingLimit(`${remaining.toLocaleString()} USD`);
      } else {
        setRemainingLimit(""); // Verified → Unlimited
      }
    };

    fetchRemainingLimit();
  }, [verificationStatus, email, dispatch]);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "verification":
        return <VerificationProfile remainingLimit={remainingLimit} />;
      case "security":
        return <SecurityTab />;
      // Uncomment and add your real components later:
      // case "bank":
      //   return <div>Bank Accounts Content Coming Soon</div>;
      // case "subscriptions":
      //   return <div>My Subscriptions Content Coming Soon</div>;
      default:
        return <Profile />;
    }
  }, [activeTab, remainingLimit]);

  return (
    <>
      <VerificationAlert
        name={name || "User"}
        verificationStatus={verificationStatus}
      />

      <div className="mt-6 mb-4 flex px-2.5 md:px-0">
        <TextAnimate className="text-[34px] tracking-[-0.05em] leading-[44px] font-semibold text-[#000] dark:text-white/85">
          Profile Settings
        </TextAnimate>
      </div>

      <div className="px-2.5 md:px-0">
        <div className="mb-4 max-w-[750px] rounded-xl border-2 border-dashed border-[#13161E] px-4 ">
          <div className="my-3">
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={handleTabChange}
              className="relative gap-1 rounded-[15px] border border-white/10 bg-white dark:bg-black/10 p-2 dark:border-[#0F121A]">
              {tabs.map((tab) => (
                <ToggleGroupItem
                  key={tab.value}
                  value={tab.value}
                  className="z-10 cursor-pointer rounded-[12px] px-[24px] py-[9px] text-[12px] font-semibold leading-[14px] text-white/50 transition-all duration-200 
                  data-[state=on]:bg-gradient-to-r 
                  data-[state=on]:from-[#1E1429] 
                  data-[state=on]:to-[#311B47]/95 
                  data-[state=on]:text-white">
                  {tab.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="w-full mt-2">{renderContent}</div>
          </div>
        </div>
      </div>
    </>
  );
}
