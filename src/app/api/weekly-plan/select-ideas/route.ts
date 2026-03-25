import { NextResponse } from "next/server";
import { z } from "zod";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { getCurrentWeekKey } from "@/lib/utils/week-key";

const schema = z.object({
  profileId: z.string().min(1),
  ideaIds: z.array(z.string().min(1)),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = schema.parse(body);
    const weekKey = getCurrentWeekKey();

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { error: deleteError } = await supabase
      .from("weekly_plan_ideas")
      .delete()
      .eq("user_id", user.id)
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

    if (parsed.ideaIds.length > 0) {
      const { data: validIdeas, error: ideasError } = await supabase
        .from("content_ideas")
        .select("id")
        .eq("user_id", user.id)
        .eq("profile_id", parsed.profileId)
        .eq("status", "approved")
        .in("id", parsed.ideaIds);

      if (ideasError) {
        return NextResponse.json(
          {
            error: "Erro ao validar ideias selecionadas.",
            details: ideasError.message,
          },
          { status: 500 }
        );
      }

      if ((validIdeas || []).length !== parsed.ideaIds.length) {
        return NextResponse.json(
          { error: "Uma ou mais ideias selecionadas nao pertencem ao perfil ativo." },
          { status: 403 }
        );
      }
    }

    if (parsed.ideaIds.length === 0) {
      return NextResponse.json({
        success: true,
        weekKey,
        selectedCount: 0,
      });
    }

    const rows = parsed.ideaIds.map((ideaId) => ({
      user_id: user.id,
      profile_id: parsed.profileId,
      idea_id: ideaId,
      week_key: weekKey,
    }));

    const { error } = await supabase.from("weekly_plan_ideas").insert(rows);

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
