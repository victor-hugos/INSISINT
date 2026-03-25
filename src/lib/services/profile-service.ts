import { apiRequest } from "@/lib/utils/api-client";
import type { ProfileContext } from "@/types/profile";

export async function fetchProfileContext(profileId: string) {
  const data = await apiRequest<{ profile: ProfileContext }>(
    `/api/profile-context?profileId=${encodeURIComponent(profileId)}`
  );

  return data.profile;
}
