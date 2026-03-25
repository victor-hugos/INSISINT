import { apiRequest } from "@/lib/api-client";

export type ReminderApiItem = {
  id: string;
  calendar_item_id?: string | null;
  title: string;
  description: string | null;
  reminder_type: string;
  scheduled_for: string;
  status: string;
  completed_at?: string | null;
};

export async function createReminderRequest(payload: Record<string, unknown>) {
  return apiRequest<{ reminder: ReminderApiItem }>("/api/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function listReminders(profileId: string) {
  return apiRequest<{ reminders: ReminderApiItem[] }>(
    `/api/reminders/list?profileId=${encodeURIComponent(profileId)}`
  );
}

export async function completeReminderRequest(payload: {
  reminderId: string;
  userId: string;
  profileId: string;
}) {
  return apiRequest<{ reminder: ReminderApiItem }>("/api/reminders/complete", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
