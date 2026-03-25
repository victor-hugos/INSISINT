import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/supabase-server";

const schema = z.object({
  reminderId: z.string().min(1),
  userId: z.string().min(1),
  profileId: z.string().min(1),
});

export async function PATCH(req: Request) {
  try {
    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const parsed = schema.parse(body);
    const now = new Date().toISOString();

    const { data, error } = await supabaseServer
      .from("reminders")
      .update({
        status: "completed",
        completed_at: now,
        updated_at: now,
      })
      .eq("id", parsed.reminderId)
      .eq("user_id", parsed.userId)
      .eq("profile_id", parsed.profileId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao marcar lembrete como concluido.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ reminder: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao atualizar lembrete.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
