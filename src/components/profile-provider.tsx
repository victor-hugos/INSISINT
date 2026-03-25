"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { fetchProfileContext } from "@/lib/services/profile-service";
import type { ProfileContext } from "@/types/profile";

type ActiveProfileContextValue = {
  userId: string | null;
  activeProfileId: string | null;
  profile: ProfileContext | null;
  loadingProfile: boolean;
  setActiveProfileId: (profileId: string | null) => void;
  refreshProfile: () => Promise<void>;
  clearActiveProfile: () => void;
};

const ActiveProfileContext = createContext<ActiveProfileContextValue | null>(null);

const STORAGE_KEY = "creator-copilot.activeProfileId";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileContext | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const userId = user?.id ?? null;

  const getStorageKey = useCallback(
    (currentUserId: string) => `${STORAGE_KEY}.${currentUserId}`,
    []
  );

  const loadProfile = useCallback(
    async (profileId: string) => {
      setLoadingProfile(true);
      try {
        const profileData = await fetchProfileContext(profileId);
        setProfile(profileData);
      } catch (error) {
        console.error("Erro ao carregar perfil ativo:", error);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    },
    []
  );

  const setActiveProfileId = useCallback(
    (profileId: string | null) => {
      setActiveProfileIdState(profileId);

      if (profileId) {
        if (!userId) {
          return;
        }

        localStorage.setItem(getStorageKey(userId), profileId);
        void loadProfile(profileId);
      } else {
        if (userId) {
          localStorage.removeItem(getStorageKey(userId));
        }
        setProfile(null);
      }
    },
    [getStorageKey, loadProfile, userId]
  );

  const clearActiveProfile = useCallback(() => {
    setActiveProfileIdState(null);
    setProfile(null);
    if (userId) {
      localStorage.removeItem(getStorageKey(userId));
    }
  }, [getStorageKey, userId]);

  const refreshProfile = useCallback(async () => {
    if (!activeProfileId || !userId) {
      return;
    }

    await loadProfile(activeProfileId);
  }, [activeProfileId, loadProfile, userId]);

  useEffect(() => {
    if (!userId) {
      setActiveProfileIdState(null);
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    const stored = localStorage.getItem(getStorageKey(userId));

    if (!stored) {
      setActiveProfileIdState(null);
      setProfile(null);
      return;
    }

    setActiveProfileIdState(stored);
    void loadProfile(stored);
  }, [getStorageKey, loadProfile, userId]);

  const value = useMemo(
    () => ({
      userId,
      activeProfileId,
      profile,
      loadingProfile,
      setActiveProfileId,
      refreshProfile,
      clearActiveProfile,
    }),
    [
      userId,
      activeProfileId,
      profile,
      loadingProfile,
      setActiveProfileId,
      refreshProfile,
      clearActiveProfile,
    ]
  );

  return (
    <ActiveProfileContext.Provider value={value}>
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const context = useContext(ActiveProfileContext);

  if (!context) {
    throw new Error("useActiveProfile deve ser usado dentro de ProfileProvider.");
  }

  return context;
}
