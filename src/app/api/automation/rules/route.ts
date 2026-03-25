import { NextResponse } from "next/server";
import { z } from "zod";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";

const schema = z.object({
  profileId: z.string().min(1),
  keyword: z.string().min(1),
  replyMessage: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = schema.parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { data, error } = await supabase
      .from("automation_rules")
      .insert({
        user_id: user.id,
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

    const { data, error } = await supabase
      .from("automation_rules")
      .select("*")
      .eq("user_id", user.id)
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
