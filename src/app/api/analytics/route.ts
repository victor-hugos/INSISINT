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
      ideasRes,
      scriptsRes,
      calendarRes,
      remindersRes,
      automationActionsRes,
    ] = await Promise.all([
      supabase
        .from("content_ideas")
        .select("id, status", { count: "exact" })
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
      supabase
        .from("scripts")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
      supabase
        .from("content_calendar")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
      supabase
        .from("reminders")
        .select("id, status", { count: "exact" })
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
      supabase
        .from("automation_actions")
        .select("id, status", { count: "exact" })
        .eq("user_id", user.id)
        .eq("profile_id", profileId),
    ]);

    const errors = [
      ideasRes.error,
      scriptsRes.error,
      calendarRes.error,
      remindersRes.error,
      automationActionsRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Erro ao calcular analytics.",
          details: errors.map((error) => error?.message),
        },
        { status: 500 }
      );
    }

    const ideas = ideasRes.data || [];
    const reminders = remindersRes.data || [];
    const automationActions = automationActionsRes.data || [];

    const totalIdeas = ideasRes.count || 0;
    const approvedIdeas = ideas.filter((idea) => idea.status === "approved").length;
    const rejectedIdeas = ideas.filter((idea) => idea.status === "rejected").length;
    const generatedIdeas = ideas.filter((idea) => idea.status === "generated").length;

    const totalScripts = scriptsRes.count || 0;
    const totalCalendarItems = calendarRes.count || 0;

    const totalReminders = remindersRes.count || 0;
    const completedReminders = reminders.filter(
      (reminder) => reminder.status === "completed"
    ).length;
    const pendingReminders = reminders.filter(
      (reminder) => reminder.status === "pending"
    ).length;
    const executionRate =
      totalReminders > 0
        ? Math.round((completedReminders / totalReminders) * 100)
        : 0;

    const totalAutomationActions = automationActionsRes.count || 0;
    const sentAutomationActions = automationActions.filter(
      (action) => action.status === "sent"
    ).length;
    const failedAutomationActions = automationActions.filter(
      (action) => action.status === "failed"
    ).length;
    const pendingAutomationActions = automationActions.filter(
      (action) => action.status === "pending"
    ).length;

    return NextResponse.json({
      ideas: {
        total: totalIdeas,
        approved: approvedIdeas,
        rejected: rejectedIdeas,
        generated: generatedIdeas,
      },
      scripts: {
        total: totalScripts,
      },
      calendar: {
        total: totalCalendarItems,
      },
      reminders: {
        total: totalReminders,
        completed: completedReminders,
        pending: pendingReminders,
        executionRate,
      },
      automations: {
        total: totalAutomationActions,
        sent: sentAutomationActions,
        failed: failedAutomationActions,
        pending: pendingAutomationActions,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro inesperado ao calcular analytics.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
