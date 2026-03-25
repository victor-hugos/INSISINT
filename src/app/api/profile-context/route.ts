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

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao buscar contexto do perfil.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao buscar perfil.",
      },
      { status: 401 }
    );
  }
}
