import { NextResponse } from "next/server";

import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { reminderInputSchema } from "@/types/reminders";

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = reminderInputSchema.parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const scheduledFor = new Date(parsed.scheduledFor);

    if (Number.isNaN(scheduledFor.getTime())) {
      return NextResponse.json(
        { error: "scheduledFor invalido." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reminders")
      .insert({
        user_id: user.id,
        profile_id: parsed.profileId,
        title: parsed.title,
        description: parsed.description,
        reminder_type: parsed.reminderType,
        scheduled_for: scheduledFor.toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao salvar lembrete.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ reminder: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao criar lembrete.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
