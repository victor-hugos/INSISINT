"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { tryCreateSupabaseBrowserClient } from "@/lib/db/supabase-browser";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => tryCreateSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const client = supabase;

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    }

    void loadSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
