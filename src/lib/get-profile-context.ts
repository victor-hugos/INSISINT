import { fetchProfileContext } from "@/lib/services/profile-service";

export async function getProfileContext(params: {
  profileId: string;
}) {
  return fetchProfileContext(params.profileId);
}
