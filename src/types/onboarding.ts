import { z } from "zod";

export const onboardingSchema = z.object({
  userId: z.string().min(1),
  niche: z.string().min(2),
  targetAudience: z.string().min(2),
  goal: z.string().min(2),
  tone: z.string().min(2),
  postingFrequency: z.string().min(1),
  productsServices: z.string().optional().default(""),
  competitors: z.string().optional().default(""),
});

export const diagnosisResultSchema = z.object({
  strengths: z.array(z.string()).length(3),
  weaknesses: z.array(z.string()).length(3),
  opportunities: z.array(z.string()).length(3),
  pillars: z.array(z.string()).min(4).max(6),
  summary: z.string().min(1),
});

export const diagnosisRequestSchema = onboardingSchema.extend({
  profileId: z.string().min(1),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type DiagnosisRequestInput = z.infer<typeof diagnosisRequestSchema>;
export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;
