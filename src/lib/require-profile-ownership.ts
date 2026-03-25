import { getSupabaseServer } from "@/lib/supabase-server";

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
    throw new Error("Perfil nao encontrado ou sem permissao de acesso.");
  }

  return data;
}
