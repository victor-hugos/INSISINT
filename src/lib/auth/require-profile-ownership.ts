import { getSupabaseServer } from "@/lib/db/supabase-server";
import { AppError } from "@/lib/utils/app-error";

export async function requireProfileOwnership(params: {
  userId: string;
  profileId: string;
}) {
  const { data, error } = await getSupabaseServer()
    .from("profiles")
    .select("id, user_id")
    .eq("id", params.profileId)
    .eq("user_id", params.userId)
    .single();

  if (error || !data) {
    throw new AppError("Perfil nao encontrado ou sem permissao de acesso.", 403);
  }

  return data;
}
