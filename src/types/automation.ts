import { z } from "zod";

export const automationRuleSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().min(1),
  platform: z.literal("instagram"),
  triggerType: z.literal("comment_keyword"),
  keyword: z.string().min(1),
  replyMessage: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const instagramCommentEventSchema = z.object({
  commentId: z.string().min(1),
  mediaId: z.string().optional(),
  fromId: z.string().optional(),
  text: z.string().min(1),
  rawPayload: z.unknown(),
});

export type AutomationRule = z.infer<typeof automationRuleSchema>;
export type InstagramCommentEvent = z.infer<typeof instagramCommentEventSchema>;
