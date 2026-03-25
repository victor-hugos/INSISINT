import { apiRequest } from "@/lib/utils/api-client";
import type { DashboardData, ProgressData } from "@/types/dashboard";

export async function fetchDashboard(profileId: string) {
  return apiRequest<DashboardData>(
    `/api/dashboard?profileId=${encodeURIComponent(profileId)}`
  );
}

export async function fetchReminderProgress(profileId: string) {
  return apiRequest<ProgressData>(
    `/api/reminders/progress?profileId=${encodeURIComponent(profileId)}`
  );
}
