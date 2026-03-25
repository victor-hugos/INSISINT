import { NextResponse } from "next/server";
import { z } from "zod";

import {
  buildReminderDate,
  getCurrentWeekRange,
  getDefaultReminderHour,
  getDefaultReminderType,
} from "@/lib/utils/calendar-reminder-time";
import { requireProfileOwnership } from "@/lib/auth/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { getUserDbClient } from "@/lib/db/server-db-user";
import { getCurrentWeekKey } from "@/lib/utils/week-key";

const schema = z.object({
  profileId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await getUserDbClient();
    const body = await req.json();
    const parsed = schema.parse(body);
    const weekKey = getCurrentWeekKey();
    const { startIso, endIso } = getCurrentWeekRange();

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const { data: calendarItems, error: calendarError } = await supabase
      .from("content_calendar")
      .select("*")
      .eq("user_id", user.id)
      .eq("profile_id", parsed.profileId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (calendarError) {
      return NextResponse.json(
        { error: "Erro ao buscar calendario.", details: calendarError.message },
        { status: 500 }
      );
    }

    if (!calendarItems || calendarItems.length === 0) {
      return NextResponse.json(
        { error: "Nenhum item de calendario encontrado para gerar lembretes." },
        { status: 400 }
      );
    }

    const existingCalendarIds = calendarItems.map((item) => item.id);
    const { data: existingReminders, error: existingError } = await supabase
      .from("reminders")
      .select("calendar_item_id, title, scheduled_for")
      .eq("user_id", user.id)
      .eq("profile_id", parsed.profileId)
      .gte("scheduled_for", startIso)
      .lt("scheduled_for", endIso);

    if (existingError) {
      return NextResponse.json(
        {
          error: "Erro ao verificar lembretes existentes.",
          details: existingError.message,
        },
        { status: 500 }
      );
    }

    const alreadyCreatedIds = new Set(
      (existingReminders || [])
        .map((item) => item.calendar_item_id)
        .filter(Boolean)
    );

    const existingReminderKeys = new Set(
      (existingReminders || []).map(
        (item) => `${item.title}__${new Date(item.scheduled_for).toISOString()}`
      )
    );

    const rows = calendarItems
      .filter((item) => !alreadyCreatedIds.has(item.id))
      .map((item) => {
        const hour = getDefaultReminderHour(item.content_type);
        const reminderType = getDefaultReminderType(item.content_type);
        const scheduledFor = buildReminderDate(item.day_of_week, hour, 0);

        return {
          user_id: user.id,
          profile_id: parsed.profileId,
          calendar_item_id: item.id,
          title: `${item.day_of_week}: ${item.title}`,
          description: `Executar conteudo planejado para a semana ${weekKey}. Formato: ${item.content_type}. Objetivo: ${item.objective}`,
          reminder_type: reminderType,
          scheduled_for: scheduledFor,
          status: "pending",
          reminderKey: `${item.day_of_week}: ${item.title}__${scheduledFor}`,
        };
      })
      .filter((item) => !existingReminderKeys.has(item.reminderKey));

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        createdCount: 0,
        message: "Todos os lembretes desse calendario ja foram criados.",
        weekKey,
      });
    }

    const insertRows = rows.map(({ reminderKey, ...row }) => row);

    const { data: inserted, error: insertError } = await supabase
      .from("reminders")
      .insert(insertRows)
      .select("*");

    if (insertError) {
      return NextResponse.json(
        {
          error: "Erro ao criar lembretes do calendario.",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      createdCount: inserted?.length || 0,
      weekKey,
      reminders: inserted || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao gerar lembretes do calendario.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
