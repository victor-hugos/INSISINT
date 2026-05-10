import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/db/supabase-server";
import { sendEmail } from "@/lib/email/mailer";
import { getAdminEmails } from "@/lib/config/env";

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
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

    const db = getSupabaseServer();

    /* ── Verificar duplicata ── */
    const { data: existing } = await db
      .from("pilot_leads")
      .select("id")
      .eq("email", parsed.email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está na lista do piloto." },
        { status: 409 }
      );
    }

    /* ── Salvar lead ── */
    const { data: lead, error: dbError } = await db
      .from("pilot_leads")
      .insert({
        name: parsed.name,
        email: parsed.email,
        instagram: parsed.instagram ?? null,
        niche: parsed.niche ?? null,
        pain: parsed.pain ?? null,
        frequency: parsed.frequency ?? null,
        goal: parsed.goal ?? null,
        feedback: parsed.feedback ?? null,
        source: parsed.source ?? "pilot_landing",
        status: "new",
      })
      .select("*")
      .single();

    if (dbError) {
      console.error("[pilot/apply] Supabase error:", dbError.message);
      return NextResponse.json(
        { error: "Erro ao salvar sua aplicação. Tente novamente." },
        { status: 500 }
      );
    }

    /* ── Enviar emails (falha silenciosa — lead já foi salvo) ── */
    const adminEmails = getAdminEmails();

    await Promise.allSettled([
      sendEmail({
        to: parsed.email,
        subject: "Sua aplicação para o piloto INSISINT foi recebida!",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0c0c10;color:#f0eeff;border-radius:12px">
            <h2 style="margin:0 0 12px;color:#a78bfa">Aplicação recebida, ${parsed.name}!</h2>
            <p style="margin:0 0 16px;color:#8b8699;line-height:1.6">
              Recebemos sua aplicação para o piloto do INSISINT. Analisaremos suas respostas e entraremos em contato em até 48 horas.
            </p>
            <p style="margin:0 0 8px;color:#8b8699"><strong style="color:#f0eeff">Nicho:</strong> ${parsed.niche ?? "—"}</p>
            <p style="margin:0 0 8px;color:#8b8699"><strong style="color:#f0eeff">Objetivo:</strong> ${parsed.goal ?? "—"}</p>
            <p style="margin:0 0 24px;color:#8b8699"><strong style="color:#f0eeff">Instagram:</strong> ${parsed.instagram ?? "—"}</p>
            <a href="https://insisint.com.br/signup" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">
              Criar conta gratuita →
            </a>
            <p style="margin:24px 0 0;font-size:0.8rem;color:#5a5568">INSISINT · Sistema operacional de conteúdo com IA</p>
          </div>
        `,
      }),
      adminEmails.length > 0
        ? sendEmail({
            to: adminEmails.join(","),
            subject: `[INSISINT] Novo lead no piloto: ${parsed.name}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0c0c10;color:#f0eeff;border-radius:12px">
                <h2 style="margin:0 0 16px;color:#a78bfa">Novo lead — Piloto INSISINT</h2>
                <p><strong>Nome:</strong> ${parsed.name}</p>
                <p><strong>Email:</strong> ${parsed.email}</p>
                <p><strong>Instagram:</strong> ${parsed.instagram ?? "—"}</p>
                <p><strong>Nicho:</strong> ${parsed.niche ?? "—"}</p>
                <p><strong>Dor:</strong> ${parsed.pain ?? "—"}</p>
                <p><strong>Frequência:</strong> ${parsed.frequency ?? "—"}</p>
                <p><strong>Objetivo:</strong> ${parsed.goal ?? "—"}</p>
                <p><strong>Feedback:</strong> ${parsed.feedback ?? "—"}</p>
                <p style="margin-top:16px;font-size:0.82rem;color:#5a5568">Ver todos os leads: /pilot/leads</p>
              </div>
            `,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const first = err.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Dados inválidos." },
        { status: 422 }
      );
    }

    console.error("[pilot/apply] Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro inesperado. Tente novamente." },
      { status: 500 }
    );
  }
}
