import { z } from "zod";
import { ideaCategorySchema } from "@/types/ideas";

export const dayOfWeekSchema = z.enum([
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
]);

export const calendarItemSchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  category: ideaCategorySchema,
  contentType: z.string().min(1),
  title: z.string().min(1),
  objective: z.string().min(1),
  notes: z.string().min(1),
  sourceIdeaTitle: z.string().optional(),
});

export const calendarResultSchema = z.object({
  items: z.array(calendarItemSchema).min(5).max(7),
});

export type CalendarItem = z.infer<typeof calendarItemSchema>;
export type CalendarResult = z.infer<typeof calendarResultSchema>;
