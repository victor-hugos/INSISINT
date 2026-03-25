import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminUser } from "@/lib/auth/server-admin";
import { getSupabaseServer } from "@/lib/db/supabase-server";
import { getErrorStatus } from "@/lib/utils/app-error";

const schema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["new", "contacted", "approved", "converted", "rejected"]),
});

export async function PATCH(req: Request) {
  try {
    await requireAdminUser();

    const body = await req.json();
    const parsed = schema.parse(body);
    const now = new Date().toISOString();
    const updates: Record<string, string | null> = {
      status: parsed.status,
      updated_at: now,
    };

    if (parsed.status === "contacted") {
      updates.contacted_at = now;
    }

    if (parsed.status === "approved") {
      updates.approved_at = now;
    }

    if (parsed.status === "converted") {
      updates.converted_at = now;
    }

    if (parsed.status === "rejected") {
      updates.rejected_at = now;
    }

    const { data, error } = await getSupabaseServer()
      .from("pilot_leads")
      .update(updates)
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
      { status: getErrorStatus(error, 400) }
    );
  }
}
