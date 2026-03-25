import { createBrowserClient } from "@supabase/ssr";
import { getOptionalPublicEnv, getPublicEnv } from "@/lib/config/env";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function tryCreateSupabaseBrowserClient() {
  const env = getOptionalPublicEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function getSupabaseBrowser() {
  return createSupabaseBrowserClient();
}
