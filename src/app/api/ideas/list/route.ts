import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import { getUserDbClient } from "@/lib/server-db-user";

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

    const { data, error } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Erro ao listar ideias.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao listar ideias.",
      },
      { status: 401 }
    );
  }
}
