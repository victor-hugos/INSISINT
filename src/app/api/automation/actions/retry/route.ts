import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/supabase-server";

const schema = z.object({
  actionId: z.string().min(1),
  userId: z.string().min(1),
  profileId: z.string().min(1),
});

export async function PATCH(req: Request) {
  try {
    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const parsed = schema.parse(body);

    const { data: existing, error: findError } = await supabaseServer
      .from("automation_actions")
      .select("*")
      .eq("id", parsed.actionId)
      .eq("user_id", parsed.userId)
      .eq("profile_id", parsed.profileId)
      .single();

    if (findError || !existing) {
      return NextResponse.json(
        { error: "Acao nao encontrada.", details: findError?.message },
        { status: 404 }
      );
    }

    const { data, error } = await supabaseServer
      .from("automation_actions")
      .update({
        status: "pending",
        error_message: null,
        updated_at: new Date().toISOString(),
        retry_count: (existing.retry_count || 0) + 1,
      })
      .eq("id", parsed.actionId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao reprocessar acao.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ action: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao reprocessar acao automatica.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
