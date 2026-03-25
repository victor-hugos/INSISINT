import { useActiveProfile } from "@/components/profile-provider";

export function useProfileRequired() {
  const context = useActiveProfile();

  return {
    ...context,
    hasProfile: !!context.activeProfileId && !!context.profile,
  };
}
