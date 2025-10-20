import { z } from "zod";

export const registrationStep1Schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]+$/,
      "First name can only contain letters, spaces, hyphens, apostrophes, and accented characters"
    )
    .nonempty("First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]+$/,
      "Last name can only contain letters, spaces, hyphens, apostrophes, and accented characters"
    )
    .nonempty("Last name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-\(\)]{9,15}$/, "Please enter a valid phone number")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 9 && !/^0+$/.test(digits);
      },
      { message: "Please enter a valid phone number" }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .min(1, "Password is required"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});
