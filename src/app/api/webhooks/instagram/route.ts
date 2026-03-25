import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/db/supabase-server";

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
const DEMO_PROFILE_ID = process.env.DEMO_PROFILE_ID;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (!VERIFY_TOKEN) {
    return new Response("Webhook token not configured", { status: 500 });
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge || "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    if (!DEMO_PROFILE_ID) {
      return NextResponse.json(
        { error: "DEMO_PROFILE_ID nao configurado." },
        { status: 500 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const entries = Array.isArray(body.entry) ? body.entry : [];
    const { data: profileOwner, error: profileOwnerError } = await supabaseServer
      .from("profiles")
      .select("id, user_id")
      .eq("id", DEMO_PROFILE_ID)
      .single();

    if (profileOwnerError || !profileOwner) {
      return NextResponse.json(
        {
          error: "Nao foi possivel identificar o dono do perfil configurado para o webhook.",
          details: profileOwnerError?.message,
        },
        { status: 500 }
      );
    }

    const userId = String(profileOwner.user_id);
    const profileId = String(profileOwner.id);

    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : [];

      for (const change of changes) {
        const value = change?.value || {};
        const text = String(value.text || "").trim();
        const commentId = String(value.id || "").trim();
        const mediaId = String(value.media?.id || "").trim();
        const fromId = String(value.from?.id || "").trim();

        if (!text || !commentId) {
          continue;
        }

        const { data: existingEvent } = await supabaseServer
          .from("automation_events")
          .select("id")
          .eq("user_id", userId)
          .eq("profile_id", profileId)
          .eq("external_comment_id", commentId)
          .maybeSingle();

        if (existingEvent) {
          continue;
        }

        const { data: eventRow, error: eventError } = await supabaseServer
          .from("automation_events")
          .insert({
            user_id: userId,
            profile_id: profileId,
            platform: "instagram",
            event_type: "comment_created",
            external_event_id: commentId,
            external_media_id: mediaId || null,
            external_comment_id: commentId,
            external_from_id: fromId || null,
            comment_text: text,
            raw_payload: change,
          })
          .select("*")
          .single();

        if (eventError || !eventRow) {
          continue;
        }

        const { data: rules, error: rulesError } = await supabaseServer
          .from("automation_rules")
          .select("*")
          .eq("user_id", userId)
          .eq("profile_id", profileId)
          .eq("platform", "instagram")
          .eq("is_active", true);

        if (rulesError) {
          continue;
        }

        const matchedRule = (rules || []).find((rule) =>
          text.toLowerCase().includes(String(rule.keyword || "").toLowerCase())
        );

        if (!matchedRule) {
          continue;
        }

        await supabaseServer
          .from("automation_events")
          .update({ matched_rule_id: matchedRule.id })
          .eq("id", eventRow.id);

        const { data: existingAction } = await supabaseServer
          .from("automation_actions")
          .select("id")
          .eq("event_id", eventRow.id)
          .maybeSingle();

        if (existingAction) {
          continue;
        }

        await supabaseServer.from("automation_actions").insert({
          user_id: userId,
          profile_id: profileId,
          event_id: eventRow.id,
          rule_id: matchedRule.id,
          action_type: "instagram_private_reply",
          status: "pending",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar webhook do Instagram.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
