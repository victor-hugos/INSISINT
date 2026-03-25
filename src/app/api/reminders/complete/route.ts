import { NextResponse } from "next/server";
import { z } from "zod";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";

const schema = z.object({
  reminderId: z.string().min(1),
  profileId: z.string().min(1),
});

export async function PATCH(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = schema.parse(body);
    const now = new Date().toISOString();

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { data, error } = await supabase
      .from("reminders")
      .update({
        status: "completed",
        completed_at: now,
        updated_at: now,
      })
      .eq("id", parsed.reminderId)
      .eq("user_id", user.id)
      .eq("profile_id", parsed.profileId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao marcar lembrete como concluido.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ reminder: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao atualizar lembrete.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
