import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/server-auth";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    await requireAuthenticatedUser();

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
      { status: 401 }
    );
  }
}
