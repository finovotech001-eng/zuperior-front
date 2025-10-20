"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "../../ui/dialog";
import { useAppDispatch } from "@/store/hooks";
import { createMt5Account, fetchMt5Groups } from "@/store/slices/mt5AccountSlice";
import { toast } from "sonner";
import { StepChooseAccountType } from "./StepChooseAccountType";
import { StepPrepareAccount } from "./StepPrepareAccount";
import { StepAccountCreated } from "./StepAccountCreated";
import { useFetchUserData } from "@/hooks/useFetchUserData";

interface NewAccountResponse {
  status: string;
  status_code: string;
  message: string;
  _token: string;
  object: {
    crm_account_id: number;
    crm_tp_account_id: number;
    tp_id: string;
    tp_creation_error: string;
  };
  // Add real MT5 account data
  accountId?: string;
  name?: string;
  group?: string;
  leverage?: number;
  balance?: number;
  equity?: number;
  credit?: number;
  margin?: number;
  marginFree?: number;
  marginLevel?: number;
  profit?: number;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function NewAccountDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("Live");
  const [accountPlan, setAccountPlan] = useState("");
  // const [server, setServer] = useState("");
  const [leverage, setLeverage] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [errors, setErrors] = useState<{
    accountName?: string;
    password?: string;
    leverage?: string;
    currency?: string;
  }>({});
  const [loadingStep2, setLoadingStep2] = useState(false);
  // const [platform, setPlatform] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftValue, setScrollLeftValue] = useState(0);
  // CRM account ID is not required for MT5 account creation

  const [latestAccount, setLatestAccount] = useState<NewAccountResponse | null>(
    null
  );

  const { fetchAllData } = useFetchUserData();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftValue(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftValue - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftValue - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  const resetStates = () => {
    setStep(1);
    setAccountPlan("");
    setAccountType("Live");
    setLeverage("");
    setCurrency("USD");
    setAccountName("");
    setPassword("");
    setPasswordVisible(false);
    setErrors({});
    setLoadingStep2(false);
    setLatestAccount(null);
  };

  const arrowMaskStyle = {
    WebkitMaskImage:
      "linear-gradient(100deg, rgba(255, 255, 255, 0.75) 10%, rgba(255, 255, 255, 0.25) 100%)",
    maskImage:
      "linear-gradient(100deg, rgba(255, 255, 255, 0.75) 10%, rgba(255, 255, 255, 0.25) 100%)",
    borderRadius: "100px",
    opacity: 0.75,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  const validateStep2 = () => {
    const newErrors: typeof errors = {};
    // Account Name validation
    if (!accountName.trim()) {
      newErrors.accountName = "Account name is required.";
    } else if (accountName.length < 3) {
      newErrors.accountName = "Account name must be at least 3 characters.";
    }
    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
      }
    }
    // Leverage required
    if (!leverage) {
      newErrors.leverage = "Leverage is required.";
    }
    // Currency required
    if (!currency) {
      newErrors.currency = "Currency is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    try {
      setLoadingStep2(true);

      // Map account plan to MT5 group
      let group = "";
      if (accountPlan === "standard") {
        group = "real\\Bbook\\Standard\\dynamic-2000x-20Pips";
      } else if (accountPlan === "pro") {
        group = "real\\Bbook\\Pro\\dynamic-2000x-10P";
      } else {
        console.error("❌ Invalid account plan selected:", accountPlan);
        toast.error("Please select a valid account plan");
        return;
      }

      console.log("✅ Account plan selected:", accountPlan, "→ Group:", group);

      // Generate passwords for MT5 (master and investor)
      const masterPassword = password.trim();
      const investorPassword = masterPassword + "inv"; // Auto-generate investor password

      const payload = {
        name: accountName.trim(),
        group: group,
        leverage: parseInt(leverage) || 100,
        masterPassword: masterPassword,
        investorPassword: investorPassword,
        password: masterPassword, // Legacy field as per API spec
        email: "",
        country: "",
        city: "",
        phone: "",
        comment: `Created from CRM - ${accountPlan} account`
      };

      console.log("🚀 Creating MT5 Account - Final API payload:", JSON.stringify(payload, null, 2));

      const result = await dispatch(createMt5Account(payload)).unwrap();

      // Handle .NET Core API response format
      if (result) {
        console.log("✅ MT5 Account creation response:", result);

        // Check if account was actually created (accountId should not be empty)
        if (!result.accountId || result.accountId === "0") {
          console.error("❌ MT5 account creation failed - accountId is empty");
          toast.error("MT5 account creation failed - please check API configuration");
          return;
        }

        toast.success(`Your MT5 account has been created successfully! Account ID: ${result.accountId}`);

        // Set the latest account data for the success step
        setLatestAccount({
          status: "success",
          status_code: "200",
          message: "Account created successfully",
          _token: "",
          object: {
            crm_account_id: parseInt(result.accountId) || 0,
            crm_tp_account_id: 0,
            tp_id: result.accountId,
            tp_creation_error: ""
          },
          // Add real MT5 account data
          accountId: result.accountId,
          name: result.name,
          group: result.group,
          leverage: result.leverage,
          balance: result.balance,
          equity: result.equity,
          credit: result.credit,
          margin: result.margin,
          marginFree: result.marginFree,
          marginLevel: result.marginLevel,
          profit: result.profit,
          isEnabled: result.isEnabled,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        });

        // Fetch fresh account details from the API using proxy
        console.log("🔄 Fetching fresh account details from API...");
        try {
          const profileResponse = await fetch(`/api/proxy/users/${result.accountId}/getClientProfile`);
          const profileData = await profileResponse.json();
          console.log("✅ Fresh account profile:", profileData);

          // Update the latest account with fresh data
          if (profileData.data) {
            setLatestAccount(prev => ({
              ...prev!,
              accountId: profileData.data.accountId || prev?.accountId,
              name: profileData.data.name || prev?.name,
              group: profileData.data.group || prev?.group,
              leverage: profileData.data.leverage || prev?.leverage,
              balance: profileData.data.balance || prev?.balance,
              equity: profileData.data.equity || prev?.equity,
              credit: profileData.data.credit || prev?.credit,
              margin: profileData.data.margin || prev?.margin,
              marginFree: profileData.data.marginFree || prev?.marginFree,
              marginLevel: profileData.data.marginLevel || prev?.marginLevel,
              profit: profileData.data.profit || prev?.profit,
              isEnabled: profileData.data.isEnabled || prev?.isEnabled,
              createdAt: profileData.data.createdAt || prev?.createdAt,
              updatedAt: profileData.data.updatedAt || prev?.updatedAt
            }));
          }
        } catch (profileError) {
          console.log("⚠️ Could not fetch fresh profile:", profileError);
        }

        console.log("🎉 MT5 Account Created Successfully!");
        console.log("📊 Account Details:", {
          accountId: result.accountId,
          name: result.name,
          group: result.group,
          leverage: result.leverage,
          balance: result.balance,
          isEnabled: result.isEnabled
        });

        // Store MT5 account in database (basic fields only)
        console.log("💾 Storing MT5 account in database...");
        try {
          // Get user data from localStorage
          const userData = localStorage.getItem('user');
          const token = localStorage.getItem('userToken');

          if (token && userData) {
            const user = JSON.parse(userData);
            console.log("👤 User data from localStorage:", user);

            // Use name and email to lookup user in database
            const userName = user.name;
            const userEmail = user.email;

            console.log("👤 User Name:", userName);
            console.log("📧 User Email:", userEmail);

            if (!userName || !userEmail) {
              console.error("❌ User name or email not found in user data. Available fields:", Object.keys(user));
              console.error("❌ Full user data:", user);
              return;
            }

            const storeResponse = await fetch('/api/mt5/store-account', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accountId: result.accountId,
                userName: userName,
                userEmail: userEmail
              })
            });

            if (storeResponse.ok) {
              const storeData = await storeResponse.json();
              console.log("✅ MT5 account stored in database:", storeData);
            } else {
              const errorData = await storeResponse.json().catch(() => ({}));
              console.error("❌ Failed to store MT5 account in database:", storeResponse.statusText, errorData);
            }
          } else {
            console.warn("⚠️ No user token or user data found, skipping database storage");
            console.log("🔍 Debug - userData:", userData);
            console.log("🔍 Debug - token:", token);
          }
        } catch (storeError) {
          console.error("❌ Error storing MT5 account in database:", storeError);
        }

        await fetchAllData();
        nextStep();
      } else {
        toast.error("Failed to create MT5 account");
      }

    } catch (err: any) {
      console.error("MT5 account creation failed:", err);
      toast.error(err.message || "Failed to create MT5 account");
    } finally {
      setLoadingStep2(false);
    }
  };


  const handleAccountChange = (value: string) => {
    setAccountType(value);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      resetStates();
    }
  }}>
      <DialogContent className="border-3 border-transparent py-10 px-[35px] md:px-[50px] text-white/75 rounded-lg flex flex-col items-center w-full [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border">
        <DialogHeader className="w-full">
          <div className="flex items-center justify-between ">
            <div className="flex items-center h-[24] w-[400px]">
              <div
                className={`flex h-6 w-6 px-3 mx-0 items-center justify-center rounded-full ${
                  step >= 1 ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium">1</span>
              </div>
              <div
                className={`h-[4px] w-full mx-0 ${
                  step >= 2 ? "bg-[#6B5993]" : "bg-[#392F4F]"
                }`}
              ></div>
              <div
                className={`flex h-6 w-6 px-3 mx-0 items-center justify-center rounded-full ${
                  step >= 2 ? "bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium ">2</span>
              </div>
              <div
                className={`h-[4px] w-full mx-0 ${
                  step >= 3 ? "bg-[#6B5993]" : "bg-[#392F4F]"
                }`}
              ></div>
              <div
                className={`flex h-6 w-6 px-3 items-center justify-center rounded-full ${
                  step >= 3 ? " bg-[#9F8BCF]" : "bg-[#594B7A]"
                }`}
              >
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <StepChooseAccountType
            accountPlan={accountPlan}
            setAccountPlan={setAccountPlan}
            nextStep={nextStep}
            scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            isDragging={isDragging}
            handleScrollLeft={handleScrollLeft}
            handleScrollRight={handleScrollRight}
            arrowMaskStyle={arrowMaskStyle as React.CSSProperties}
          />
        )}

        {step === 2 && (
          <StepPrepareAccount
            accountType={accountType}
            handleAccountChange={handleAccountChange}
            leverage={leverage}
            setLeverage={setLeverage}
            currency={currency}
            setCurrency={setCurrency}
            accountName={accountName}
            setAccountName={setAccountName}
            password={password}
            setPassword={setPassword}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            errors={errors}
            loadingStep2={loadingStep2}
            handleSubmit={async () => {
              setLoadingStep2(true);
              await handleSubmit();
              setLoadingStep2(false);
            }}
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <StepAccountCreated
            latestAccount={latestAccount}
            password={password}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
