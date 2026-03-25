import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/server-auth";
import { getSupabaseServer } from "@/lib/supabase-server";

const schema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["new", "contacted", "approved", "converted", "rejected"]),
});

export async function PATCH(req: Request) {
  try {
    await requireAuthenticatedUser();

    const body = await req.json();
    const parsed = schema.parse(body);

    const { data, error } = await getSupabaseServer()
      .from("pilot_leads")
      .update({
        status: parsed.status,
      })
      .eq("id", parsed.leadId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao atualizar status.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao atualizar lead.",
      },
      { status: 400 }
    );
  }
}
