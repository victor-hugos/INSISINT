import { createSupabaseUserClient } from "@/lib/db/supabase-user-client";
import { AppError } from "@/lib/utils/app-error";

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseUserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("Usuario nao autenticado.", 401);
  }

  return user;
}
