import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must include letters and numbers",
    }),
})

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Username can only contain letters and numbers",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must include letters and numbers",
    }),
})

export const editProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Username can only contain letters and numbers",
      })
      .optional()
      .or(z.literal("")), // Allow empty string for optional field
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .optional()
      .or(z.literal("")), // Allow empty string for optional field
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "Password must include letters and numbers",
      })
      .optional()
      .or(z.literal("")), // Allow empty string for optional field
    confirmPassword: z.string().optional().or(z.literal("")),
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
  })
  .superRefine((data, ctx) => {
    // Check if at least one field is being updated
    const hasUpdates =
      (data.username && data.username.trim() !== "") ||
      (data.email && data.email.trim() !== "") ||
      (data.newPassword && data.newPassword.trim() !== "")

    if (!hasUpdates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please fill at least one field to update",
        path: ["general"],
      })
    }

    // Password confirmation validation
    if (data.newPassword && data.newPassword.trim() !== "") {
      if (!data.confirmPassword || data.confirmPassword.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please confirm your new password",
          path: ["confirmPassword"],
        })
      } else if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
      }
    }
  })

// Email validation schema
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
})

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
})

// Password reset validation schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "Password must include letters and numbers",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
