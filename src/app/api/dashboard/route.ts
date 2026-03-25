import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";

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

    const [
      profileRes,
      diagnosisRes,
      ideasRes,
      scriptsRes,
      calendarRes,
      remindersRes,
      automationRes,
      ideasSummaryRes,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("id", profileId)
        .single(),
      supabase
        .from("diagnoses")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("content_ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("scripts")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("content_calendar")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(7),
      supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("scheduled_for", { ascending: true })
        .limit(10),
      supabase
        .from("automation_actions")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("content_ideas")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
    ]);

    const errors = [
      profileRes.error,
      diagnosisRes.error,
      ideasRes.error,
      scriptsRes.error,
      calendarRes.error,
      remindersRes.error,
      automationRes.error,
      ideasSummaryRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Erro ao montar dashboard.",
          details: errors.map((error) => error?.message),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: profileRes.data,
      diagnosis: diagnosisRes.data,
      ideas: ideasRes.data || [],
      scripts: scriptsRes.data || [],
      calendar: calendarRes.data || [],
      reminders: remindersRes.data || [],
      automation: automationRes.data || [],
      ideasSummary: ideasSummaryRes.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro inesperado ao carregar dashboard.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
