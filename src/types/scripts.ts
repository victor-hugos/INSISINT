import { z } from "zod";
import { ideaCategorySchema } from "@/types/ideas";
import { onboardingSchema } from "@/types/onboarding";

export const scriptInputSchema = onboardingSchema.extend({
  profileId: z.string().min(1),
  category: ideaCategorySchema,
  title: z.string().min(2),
  hookBase: z.string().min(2),
  description: z.string().min(2),
});

export const scriptResultSchema = z.object({
  hook: z.string().min(1),
  development: z.string().min(1),
  cta: z.string().min(1),
  caption: z.string().min(1),
});

export type ScriptInput = z.infer<typeof scriptInputSchema>;
export type ScriptResult = z.infer<typeof scriptResultSchema>;
