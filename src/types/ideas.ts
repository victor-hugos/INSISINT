import { z } from "zod";
import { IDEA_CATEGORIES, IDEA_STATUSES } from "@/lib/constants";

export const ideaCategorySchema = z.enum(IDEA_CATEGORIES);

export const ideaStatusSchema = z.enum(IDEA_STATUSES);

export const contentIdeaSchema = z.object({
  id: z.string().optional(),
  category: ideaCategorySchema,
  title: z.string().min(1),
  hook: z.string().min(1),
  description: z.string().min(1),
  status: ideaStatusSchema.optional(),
});

export const ideasResultSchema = z.object({
  ideas: z.array(contentIdeaSchema).length(12),
});

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];
export type IdeaStatus = (typeof IDEA_STATUSES)[number];
export type ContentIdea = z.infer<typeof contentIdeaSchema>;
export type IdeasResult = z.infer<typeof ideasResultSchema>;
