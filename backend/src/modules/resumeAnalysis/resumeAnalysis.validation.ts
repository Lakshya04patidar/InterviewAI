import { z } from "zod";

export const resumeAnalysisSchema = z.object({
    summary: z.string(),
    skills: z.array(z.string()),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    experienceLevel: z.string(),
    education: z.array(z.string()),
    missingSkills: z.array(z.string()),
});

export type ResumeAnalysisInput = z.infer<
    typeof resumeAnalysisSchema
>;