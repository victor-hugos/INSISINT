import { NextResponse } from "next/server";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
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

    await requireProfileOwnership({
      userId: user.id,
      profileId,
    });

    const [eventsRes, actionsRes] = await Promise.all([
      supabase
        .from("automation_events")
        .select("*")
        .eq("user_id", user.id)
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
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
        .eq("user_id", user.id)
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
