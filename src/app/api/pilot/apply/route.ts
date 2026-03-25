import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/db/supabase-server";

const schema = z.object({
  name: z.string().min(2),
  instagram: z.string().optional(),
  niche: z.string().optional(),
  pain: z.string().optional(),
  frequency: z.string().optional(),
  goal: z.string().optional(),
  feedback: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const { data, error } = await getSupabaseServer()
      .from("pilot_leads")
      .insert({
        name: parsed.name,
        instagram: parsed.instagram,
        niche: parsed.niche,
        pain: parsed.pain,
        frequency: parsed.frequency,
        goal: parsed.goal,
        feedback: parsed.feedback,
        source: parsed.source || "pilot_landing",
        status: "new",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao salvar lead.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao enviar aplicacao.",
      },
      { status: 400 }
    );
  }
}
