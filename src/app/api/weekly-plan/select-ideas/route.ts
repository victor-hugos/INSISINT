import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/supabase-server";
import { getCurrentWeekKey } from "@/lib/week-key";

const schema = z.object({
  userId: z.string().min(1),
  profileId: z.string().min(1),
  ideaIds: z.array(z.string().min(1)),
});

export async function POST(req: Request) {
  try {
    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const parsed = schema.parse(body);
    const weekKey = getCurrentWeekKey();

    const { error: deleteError } = await supabaseServer
      .from("weekly_plan_ideas")
      .delete()
      .eq("user_id", parsed.userId)
      .eq("profile_id", parsed.profileId)
      .eq("week_key", weekKey);

    if (deleteError) {
      return NextResponse.json(
        {
          error: "Erro ao limpar selecao anterior.",
          details: deleteError.message,
        },
        { status: 500 }
      );
    }

    if (parsed.ideaIds.length === 0) {
      return NextResponse.json({
        success: true,
        weekKey,
        selectedCount: 0,
      });
    }

    const rows = parsed.ideaIds.map((ideaId) => ({
      user_id: parsed.userId,
      profile_id: parsed.profileId,
      idea_id: ideaId,
      week_key: weekKey,
    }));

    const { error } = await supabaseServer.from("weekly_plan_ideas").insert(rows);

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao salvar selecao da semana.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      weekKey,
      selectedCount: parsed.ideaIds.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao salvar ideias selecionadas.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
