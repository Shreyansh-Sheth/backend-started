import { z } from "zod";

const Email = z.string().trim().email();
const Password = z.string().trim().min(8).max(25);
const Username = z.string().trim().min(3).max(25);
const Otp = z.string().trim().min(6).max(6);
const RefreshToken = z.string().min(1).trim();
export const registerSchema = z
  .object({
    username: Username,
    email: Email,
    password: Password,
    confirmPassword: Password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const loginSchema = z.object({
  email: Email,
  password: Password,
});
export const changePasswordSchema = z
  .object({
    oldPassword: Password,
    newPassword: Password,
    confirmNewPassword: Password,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password cannot be the same as the old password",
    path: ["newPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: Email,
});

export const verifyOtpSchema = z.object({
  email: Email,
  otp: Otp,
});
export const resetPasswordSchema = z
  .object({
    email: Email,
    otp: Otp,
    password: Password,
    confirmPassword: Password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LogoutValidation = z.object({
  refreshToken: RefreshToken,
});

export const RefreshTokenValidation = z.object({
  refreshToken: RefreshToken,
});
