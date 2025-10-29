// zuperior-dashboard/client/src/app/login/_components/auth-form.tsx (Updated for Backend Integration)

"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registrationStep1Schema, loginSchema } from "./auth-schemas";
import { ZodError } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import { authService } from "@/services/api.service";
import AuthToggleTabs from "./AuthToggleTabs";
import RegisterStep1Form from "./RegisterStep1Form";
import RegisterStep2OtpForm from "./RegisterStep2OtpForm";
import LoginForm from "./LoginForm";
import SubmitButton from "./SubmitButton";

const AuthForm = () => {
  const router = useRouter();
  const { loading: globalLoading, setLoading: setGlobalLoading } = useLoading();

  // State
  const [isCreateAccount, setIsCreateAccount] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const [registerBuffer, setRegisterBuffer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    country: "in",
    country_code: "",
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-detect country from IP on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/geo/country", { cache: "no-store" });
        const data = await res.json();
        const code = (data?.countryCode || "").toString().toLowerCase();
        if (!cancelled && code) {
          setRegisterBuffer((prev) => ({ ...prev, country: code }));
        }
      } catch {
        // no-op: keep default country
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Clear validation errors
  const clearValidationErrors = () => setValidationErrors({});

  const clearFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle registration with backend
  const handleRegister = async () => {
    try {
      setIsLoading(true);

      // Prepare registration data for backend
      const registerData = {
        name: `${registerBuffer.firstName.trim()} ${registerBuffer.lastName.trim()}`,
        email: registerBuffer.email.trim().toLowerCase(),
        password: registerBuffer.password,
        country: registerBuffer.country.trim(),
        phone: registerBuffer.phone.trim() || null, // Handle empty phone field
      };

      const response = await authService.register(registerData);

      // Store auth data
      authService.setAuthData(response.token, response.clientId);

      // Store user data for navbar display
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      toast.success("Account created! Welcome aboard.");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCooldown = (seconds = 30) => {
    setResendCooldown(seconds);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const fullName = `${registerBuffer.firstName.trim()} ${registerBuffer.lastName.trim()}`.trim();
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerBuffer.email.trim(), name: fullName || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setStep(2);
      setOtp("");
      startCooldown(30);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerBuffer.email.trim(), otp }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Invalid OTP");
      await handleRegister();
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate registration step 1
  const validateStep1 = () => {
    try {
      registrationStep1Schema.parse(registerBuffer);
      clearValidationErrors();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { [key: string]: string } = {};
        (error as ZodError).errors.forEach(
          (err: { path: (string | number)[]; message: string }) => {
            if (err.path.length) errors[err.path[0] as string] = err.message;
          }
        );
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Validate login inputs
  const validateLogin = () => {
    try {
      loginSchema.parse({ email: loginEmail.trim(), password: loginPassword });
      clearValidationErrors();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { [key: string]: string } = {};
        (error as ZodError).errors.forEach(
          (err: { path: (string | number)[]; message: string }) => {
            if (err.path.length) errors[err.path[0] as string] = err.message;
          }
        );
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Helper delay for smooth loading
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!loginEmail.trim()) {
      setValidationErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    try {
      setIsLoading(true);
      // Call forgot password API
      const response = await authService.forgotPassword(loginEmail);
      toast.success("Password reset link sent to your email!");
      setForgotMode(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (forgotMode) {
      await handleForgotPassword();
      return;
    }

    if (isCreateAccount) {
      if (step === 1) {
        if (validateStep1()) {
          await sendOtp();
        }
      } else if (step === 2) {
        if (!otp || otp.length !== 6) {
          setValidationErrors((prev) => ({ ...prev, otp: "Enter the 6-digit code" }));
          return;
        }
        await verifyAndRegister();
      }
    } else {
      if (validateLogin()) {
        await handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const loginData = {
        // Normalize email to lowercase to match registration/storage
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      };

      const response = await authService.login(loginData);

      // Store auth data
      authService.setAuthData(response.token, response.clientId);

      // Store user data for navbar display
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      toast.success("Welcome back! You've successfully logged in.");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form helper
  /* const resetForm = () => {
    setRegisterBuffer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      country: "",
      country_code: "",
    });
    setValidationErrors({});
  }; */

  return (
    <div className="w-full max-w-md px-6 py-8 h-auto flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-400">
        Let&apos;s become a Zuperior...
      </h2>
      <AuthToggleTabs
        isCreateAccount={isCreateAccount}
        setIsCreateAccount={(val) => {
          setIsCreateAccount(val);
          setForgotMode(false);
          setStep(1);
          clearValidationErrors();
        }}
        setStep={setStep}
        clearValidationErrors={clearValidationErrors}
      />

      <AnimatePresence mode="wait">
        <motion.form
          key={`${isCreateAccount}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          {isCreateAccount ? (
            step === 1 ? (
              <RegisterStep1Form
                registerBuffer={registerBuffer}
                setRegisterBuffer={setRegisterBuffer}
                validationErrors={validationErrors}
                clearFieldError={clearFieldError}
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
              />
            ) : (
              <RegisterStep2OtpForm
                otp={otp}
                setOtp={setOtp}
                resendCooldown={resendCooldown}
                sendOtp={sendOtp}
                validationErrors={validationErrors}
                clearError={(f) => clearFieldError(f)}
                onComplete={verifyAndRegister}
              />
            )
          ) : (
            <>
              {step === 1 && (
                <LoginForm
                  loginEmail={loginEmail}
                  setLoginEmail={setLoginEmail}
                  loginPassword={loginPassword}
                  setLoginPassword={setLoginPassword}
                  validationErrors={validationErrors}
                  clearFieldError={clearFieldError}
                  passwordVisible={passwordVisible}
                  setPasswordVisible={setPasswordVisible}
                  forgotMode={forgotMode}
                  setForgotMode={setForgotMode}
                />
              )}
            </>
          )}
          <SubmitButton
            globalLoading={globalLoading}
            loading={isLoading}
            isCreateAccount={isCreateAccount}
            step={step}
            isForgotPassword={forgotMode}
          />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
