import { createSupabaseUserClient } from "@/lib/supabase-user-client";

export async function getUserDbClient() {
  return createSupabaseUserClient();
}
