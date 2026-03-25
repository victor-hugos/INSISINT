import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { getCurrentWeekKey } from "@/lib/week-key";

export async function GET(req: Request) {
  try {
    const supabaseServer = getSupabaseServer();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const profileId = searchParams.get("profileId");

    if (!userId || !profileId) {
      return NextResponse.json(
        { error: "userId e profileId sao obrigatorios." },
        { status: 400 }
      );
    }

    const weekKey = getCurrentWeekKey();

    const { data, error } = await supabaseServer
      .from("weekly_plan_ideas")
      .select("idea_id")
      .eq("user_id", userId)
      .eq("profile_id", profileId)
      .eq("week_key", weekKey);

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao buscar selecao da semana.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      weekKey,
      ideaIds: (data || []).map((row) => row.idea_id),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao buscar plano semanal.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
