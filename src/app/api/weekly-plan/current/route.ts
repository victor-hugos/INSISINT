import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { getCurrentWeekKey } from "@/lib/utils/week-key";

export async function GET(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "profileId e obrigatorio." },
        { status: 400 }
      );
    }

    const weekKey = getCurrentWeekKey();

    const { data, error } = await supabase
      .from("weekly_plan_ideas")
      .select("idea_id")
      .eq("user_id", user.id)
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
