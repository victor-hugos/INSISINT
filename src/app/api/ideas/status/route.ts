import { NextResponse } from "next/server";
import { z } from "zod";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";

const updateIdeaStatusSchema = z.object({
  ideaId: z.string().min(1),
  profileId: z.string().min(1),
  status: z.enum(["generated", "approved", "rejected"]),
});

export async function PATCH(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = updateIdeaStatusSchema.parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { data, error } = await supabase
      .from("content_ideas")
      .update({
        status: parsed.status,
      })
      .eq("id", parsed.ideaId)
      .eq("user_id", user.id)
      .eq("profile_id", parsed.profileId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao atualizar status da ideia.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ idea: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao atualizar ideia.",
      },
      { status: 400 }
    );
  }
}
