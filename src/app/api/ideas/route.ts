import { NextResponse } from "next/server";
import { z } from "zod";
import { generateIdeas } from "@/lib/agents/ideas";
import { requireProfileOwnership } from "@/lib/require-profile-ownership";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import { getSupabaseServer } from "@/lib/supabase-server";

const ideasSchema = z.object({
  profileId: z.string().min(1),
  niche: z.string().min(2),
  targetAudience: z.string().min(2),
  goal: z.string().min(2),
  tone: z.string().min(2),
  postingFrequency: z.string().min(1),
  productsServices: z.string().optional().default(""),
  competitors: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const supabaseServer = getSupabaseServer();
    const body = await req.json();
    const parsed = ideasSchema.parse(body);

    await requireProfileOwnership({
      userId: user.id,
      profileId: parsed.profileId,
    });

    const result = await generateIdeas({
      userId: user.id,
      ...parsed,
    });

    const rows = result.ideas.map((idea) => ({
      user_id: user.id,
      profile_id: parsed.profileId,
      category: idea.category,
      title: idea.title,
      hook: idea.hook,
      description: idea.description,
      status: "generated",
    }));

    const { error } = await supabaseServer.from("content_ideas").insert(rows);

    if (error) {
      return NextResponse.json(
        {
          error: "Ideias geradas, mas nao foram salvas.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao gerar ideias.",
      },
      { status: 400 }
    );
  }
}
