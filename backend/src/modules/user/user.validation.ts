import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters")
        .trim()
        .optional(),

    
    avatar: z
        .string()
        .url("Avatar must be a valid URL")
        .optional(),
});

export type UpdateProfileInput = z.infer<
    typeof updateProfileSchema
>;

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "New password cannot exceed 100 characters"),
});

export type changePasswordSchema = z.infer<
    typeof changePasswordSchema
>;