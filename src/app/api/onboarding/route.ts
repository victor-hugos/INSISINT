import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { onboardingSchema } from "@/types/onboarding";

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = onboardingSchema.omit({ userId: true }).parse(body);

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        niche: parsed.niche,
        target_audience: parsed.targetAudience,
        goal: parsed.goal,
        tone: parsed.tone,
        posting_frequency: parsed.postingFrequency,
        products_services: parsed.productsServices,
        competitors: parsed.competitors,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao salvar onboarding.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ profileId: data.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar onboarding.",
      },
      { status: 400 }
    );
  }
}
