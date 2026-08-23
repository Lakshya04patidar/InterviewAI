import { z } from "zod";

export const createResumeSchema = z.object({
    fileName: z
        .string()
        .min(1, "File name is required")
        .max(255, "File name is too long"),

    fileUrl: z
        .string()
        .min(1, "File URL is required"),
    
    fileType: z
        .string()
        .min(1, "File type is required"),
    
    fileSize: z
        .number()
        .positive("File size must be greater than 0"),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;