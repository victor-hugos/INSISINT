import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";

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

    const [eventsRes, actionsRes] = await Promise.all([
      supabaseServer
        .from("automation_events")
        .select("*")
        .eq("user_id", userId)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseServer
        .from("automation_actions")
        .select(
          `
          *,
          automation_events (
            id,
            comment_text,
            external_comment_id,
            external_from_id,
            created_at
          ),
          automation_rules (
            id,
            keyword,
            reply_message
          )
        `
        )
        .eq("user_id", userId)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (eventsRes.error || actionsRes.error) {
      return NextResponse.json(
        {
          error: "Erro ao carregar logs.",
          details: [eventsRes.error?.message, actionsRes.error?.message].filter(
            Boolean
          ),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      events: eventsRes.data || [],
      actions: actionsRes.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao carregar monitor de automacoes.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
