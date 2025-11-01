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
import ForgotPasswordNewPasswordForm from "./ForgotPasswordNewPasswordForm";

const AuthForm = () => {
  const router = useRouter();
  const { loading: globalLoading, setLoading: setGlobalLoading } = useLoading();

  // State
  const [isCreateAccount, setIsCreateAccount] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "otp" | "newPassword">("email");
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Handle forgot password - Step 1: Send OTP
  const sendForgotPasswordOtp = async () => {
    if (!loginEmail.trim()) {
      setValidationErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    try {
      setIsLoading(true);
      const fullName = "User"; // Use generic name for forgot password
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), name: fullName, useBackend: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setForgotPasswordStep("otp");
      setForgotPasswordOtp("");
      startCooldown(30);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password - Step 2: Verify OTP
  const verifyForgotPasswordOtp = async () => {
    if (!forgotPasswordOtp || forgotPasswordOtp.length !== 6) {
      setValidationErrors((prev) => ({ ...prev, otp: "Enter the 6-digit code" }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), otp: forgotPasswordOtp, useBackend: true }),
      });
      const data = await res.json();
      console.log("OTP verification response:", data);
      if (!res.ok || !data?.success) {
        const errorMsg = data?.message || "Invalid OTP";
        console.error("OTP verification failed:", errorMsg);
        throw new Error(errorMsg);
      }
      toast.success("OTP verified successfully");
      setForgotPasswordStep("newPassword");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password - Step 3: Reset password
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        newPassword: !newPassword ? "New password is required" : "",
        confirmPassword: !confirmPassword ? "Please confirm your password" : "",
      }));
      return;
    }

    if (newPassword.length < 6) {
      setValidationErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 6 characters long",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/password/reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          newPassword: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to reset password");
      toast.success("Password reset successfully! You can now login.");
      // Reset form and go back to login
      setForgotMode(false);
      setForgotPasswordStep("email");
      setForgotPasswordOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setLoginPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (forgotMode) {
      if (forgotPasswordStep === "email") {
        await sendForgotPasswordOtp();
      } else if (forgotPasswordStep === "otp") {
        await verifyForgotPasswordOtp();
      } else if (forgotPasswordStep === "newPassword") {
        await resetPassword();
      }
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
          setForgotPasswordStep("email");
          setStep(1);
          clearValidationErrors();
        }}
        setStep={setStep}
        clearValidationErrors={clearValidationErrors}
      />

      <AnimatePresence mode="wait">
        <motion.form
          key={`${isCreateAccount}-${step}-${forgotMode}-${forgotPasswordStep}`}
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
                email={registerBuffer.email}
              />
            )
          ) : (
            <>
              {step === 1 && !forgotMode && (
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
                  setForgotMode={(val) => {
                    setForgotMode(val);
                    if (val) {
                      setForgotPasswordStep("email");
                      setForgotPasswordOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }
                  }}
                />
              )}
              {forgotMode && forgotPasswordStep === "email" && (
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-full bg-[#1a1a1a] p-3 rounded text-white text-sm focus:outline-none ${
                      validationErrors.email
                        ? "border border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/20"
                        : "border border-transparent focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/20"
                    }`}
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      clearFieldError("email");
                    }}
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-xs mt-1 animate-pulse">
                      {validationErrors.email}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(false);
                      setForgotPasswordStep("email");
                    }}
                    className="text-sm text-blue-500 hover:underline cursor-pointer mt-2"
                  >
                    Back to Login
                  </button>
                </div>
              )}
              {forgotMode && forgotPasswordStep === "otp" && (
                <RegisterStep2OtpForm
                  otp={forgotPasswordOtp}
                  setOtp={setForgotPasswordOtp}
                  resendCooldown={resendCooldown}
                  sendOtp={sendForgotPasswordOtp}
                  validationErrors={validationErrors}
                  clearError={(f) => clearFieldError(f)}
                  onComplete={verifyForgotPasswordOtp}
                  email={loginEmail}
                />
              )}
              {forgotMode && forgotPasswordStep === "newPassword" && (
                <>
                  <ForgotPasswordNewPasswordForm
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    passwordVisible={passwordVisible}
                    setPasswordVisible={setPasswordVisible}
                    confirmPasswordVisible={confirmPasswordVisible}
                    setConfirmPasswordVisible={setConfirmPasswordVisible}
                    validationErrors={validationErrors}
                    clearFieldError={clearFieldError}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordStep("otp");
                      setForgotPasswordOtp("");
                    }}
                    className="text-sm text-blue-500 hover:underline cursor-pointer"
                  >
                    Back to OTP
                  </button>
                </>
              )}
            </>
          )}
          <SubmitButton
            globalLoading={globalLoading}
            loading={isLoading}
            isCreateAccount={isCreateAccount}
            step={forgotMode ? (forgotPasswordStep === "email" ? 1 : forgotPasswordStep === "otp" ? 2 : 3) : step}
            isForgotPassword={forgotMode}
            forgotPasswordStep={forgotMode ? forgotPasswordStep : undefined}
          />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
