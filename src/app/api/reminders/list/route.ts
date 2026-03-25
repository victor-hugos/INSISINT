import { NextResponse } from "next/server";
import { getUserDbClient } from "@/lib/server-db-user";
import { requireAuthenticatedUser } from "@/lib/server-auth";

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
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .order("scheduled_for", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Erro ao listar lembretes.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ reminders: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao listar lembretes.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
