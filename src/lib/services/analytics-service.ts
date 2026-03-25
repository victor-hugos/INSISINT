import { apiRequest } from "@/lib/api-client";
import type { AnalyticsData } from "@/types/analytics";

export async function fetchAnalytics(profileId: string) {
  return apiRequest<AnalyticsData>(
    `/api/analytics?profileId=${encodeURIComponent(profileId)}`
  );
}
