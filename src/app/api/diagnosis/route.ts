import { NextResponse } from "next/server";
import { generateDiagnosis } from "@/lib/agents/diagnosis";
import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { diagnosisRequestSchema } from "@/types/onboarding";

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = diagnosisRequestSchema.omit({ userId: true }).parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const result = await generateDiagnosis({
      ...parsed,
      userId: user.id,
    });

    const { error } = await supabase.from("diagnoses").insert({
      user_id: user.id,
      profile_id: parsed.profileId,
      result,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Diagnostico gerado, mas nao foi salvo.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao gerar diagnostico.",
      },
      { status: 400 }
    );
  }
}
