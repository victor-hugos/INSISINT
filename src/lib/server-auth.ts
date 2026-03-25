import { createSupabaseUserClient } from "@/lib/supabase-user-client";

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseUserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Usuario nao autenticado.");
  }

  return user;
}
