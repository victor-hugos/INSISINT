import { NextResponse } from "next/server";
import { z } from "zod";

import { generateCalendar } from "@/lib/agents/calendar";
import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { getCurrentWeekKey } from "@/lib/utils/week-key";
import { onboardingSchema } from "@/types/onboarding";

const calendarSchema = onboardingSchema.omit({ userId: true }).extend({
  profileId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = calendarSchema.parse(body);
    const weekKey = getCurrentWeekKey();

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { data: selectedIdeaLinks, error: selectedIdeasError } = await supabase
      .from("weekly_plan_ideas")
      .select("idea_id")
      .eq("user_id", user.id)
      .eq("profile_id", parsed.profileId)
      .eq("week_key", weekKey);

    if (selectedIdeasError) {
      return NextResponse.json(
        {
          error: "Erro ao buscar selecao semanal.",
          details: selectedIdeasError.message,
        },
        { status: 500 }
      );
    }

    const selectedIdeaIds = (selectedIdeaLinks || []).map((row) => row.idea_id);
    let ideas: Array<{
      category: string;
      title: string;
      hook: string;
      description: string;
      status?: string;
    }> = [];

    if (selectedIdeaIds.length > 0) {
      const { data: selectedIdeas, error: ideasError } = await supabase
        .from("content_ideas")
        .select("category, title, hook, description, status")
        .eq("user_id", user.id)
        .eq("profile_id", parsed.profileId)
        .in("id", selectedIdeaIds)
        .eq("status", "approved");

      if (ideasError) {
        return NextResponse.json(
          {
            error: "Erro ao buscar ideias selecionadas.",
            details: ideasError.message,
          },
          { status: 500 }
        );
      }

      ideas = selectedIdeas || [];
    }

    const result = await generateCalendar({ ...parsed, userId: user.id }, ideas || []);

    const rows = result.items.map((item) => ({
      user_id: user.id,
      profile_id: parsed.profileId,
      day_of_week: item.dayOfWeek,
      category: item.category,
      content_type: item.contentType,
      title: item.title,
      objective: item.objective,
      notes: item.notes,
      source_idea_title: item.sourceIdeaTitle || null,
    }));

    const { error } = await supabase.from("content_calendar").insert(rows);

    if (error) {
      return NextResponse.json(
        {
          error: "Calendario gerado, mas nao foi salvo.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result,
      ideasUsedCount: (ideas || []).length,
      weekKey,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao gerar calendario.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
