import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/supabase-server";

const schema = z.object({
  userId: z.string().min(1),
  profileId: z.string().min(1),
  keyword: z.string().min(1),
  replyMessage: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const parsed = schema.parse(body);

    const { data, error } = await supabaseServer
      .from("automation_rules")
      .insert({
        user_id: parsed.userId,
        profile_id: parsed.profileId,
        platform: "instagram",
        trigger_type: "comment_keyword",
        keyword: parsed.keyword.trim().toLowerCase(),
        reply_message: parsed.replyMessage,
        is_active: true,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao salvar regra.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ rule: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao criar regra.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}

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

    const { data, error } = await supabaseServer
      .from("automation_rules")
      .select("*")
      .eq("user_id", userId)
      .eq("profile_id", profileId)
      .eq("platform", "instagram")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Erro ao listar regras.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ rules: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao listar regras.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
