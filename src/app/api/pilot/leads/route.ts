import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth/server-admin";
import { getSupabaseServer } from "@/lib/db/supabase-server";
import { getErrorStatus } from "@/lib/utils/app-error";

export async function GET() {
  try {
    await requireAdminUser();

    const { data, error } = await getSupabaseServer()
      .from("pilot_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Erro ao buscar leads.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao carregar leads.",
      },
      { status: getErrorStatus(error, 401) }
    );
  }
}
