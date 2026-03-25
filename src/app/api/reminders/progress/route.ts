import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { getCurrentWeekRange } from "@/lib/utils/calendar-reminder-time";
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
    const { startIso, endIso } = getCurrentWeekRange();

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .gte("scheduled_for", startIso)
      .lt("scheduled_for", endIso);

    if (error) {
      return NextResponse.json(
        { error: "Erro ao buscar lembretes.", details: error.message },
        { status: 500 }
      );
    }

    const reminders = data || [];
    const total = reminders.length;
    const completed = reminders.filter((item) => item.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      weekKey,
      total,
      completed,
      percentage,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao calcular progresso.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
