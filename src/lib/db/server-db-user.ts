import { createSupabaseUserClient } from "@/lib/db/supabase-user-client";

export async function getUserDbClient() {
  return createSupabaseUserClient();
}
