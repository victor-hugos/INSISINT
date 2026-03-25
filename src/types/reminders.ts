import { z } from "zod";
import { REMINDER_STATUSES, REMINDER_TYPES } from "@/lib/constants";

export const reminderTypeSchema = z.enum(REMINDER_TYPES);

export const reminderStatusSchema = z.enum(REMINDER_STATUSES);

export const reminderInputSchema = z.object({
  userId: z.string().min(1),
  profileId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  reminderType: reminderTypeSchema,
  scheduledFor: z.string().min(1),
});

export const reminderItemSchema = z.object({
  id: z.string().optional(),
  calendarItemId: z.string().optional().nullable(),
  userId: z.string().min(1),
  profileId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  reminderType: reminderTypeSchema,
  scheduledFor: z.string().min(1),
  status: reminderStatusSchema.optional(),
  completedAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type ReminderType = (typeof REMINDER_TYPES)[number];
export type ReminderStatus = (typeof REMINDER_STATUSES)[number];
export type ReminderInput = z.infer<typeof reminderInputSchema>;
export type ReminderItem = z.infer<typeof reminderItemSchema>;
