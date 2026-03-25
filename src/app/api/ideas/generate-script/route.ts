import { NextResponse } from "next/server";
import { generateScript } from "@/lib/agents/scripts";
import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { scriptInputSchema } from "@/types/scripts";

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = scriptInputSchema.omit({ userId: true }).parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const result = await generateScript({
      ...parsed,
      userId: user.id,
    });

    const { data, error } = await supabase
      .from("scripts")
      .insert({
        user_id: user.id,
        profile_id: parsed.profileId,
        idea_title: parsed.title,
        category: parsed.category,
        hook: result.hook,
        development: result.development,
        cta: result.cta,
        caption: result.caption,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Roteiro gerado, mas nao foi salvo.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      script: data,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao gerar roteiro a partir da ideia.",
      },
      { status: 400 }
    );
  }
}
