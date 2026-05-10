"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import type { DiagnosisResult } from "@/types/onboarding";

const STORAGE_KEY = "instasocial:last-profile";

type FormData = {
  niche: string;
  targetAudience: string;
  goal: string;
  tone: string;
  postingFrequency: string;
  productsServices: string;
  competitors: string;
};

const STEPS = [
  { label: "Perfil" },
  { label: "Objetivo" },
  { label: "Contexto" },
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Etapa {step} de {total}
        </span>
        <span style={{ fontSize: "0.78rem", color: "var(--subtle)" }}>
          {STEPS[step - 1]?.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {STEPS.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i < step ? "var(--accent)" : "var(--border-md)",
              transition: "background 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>{label}</label>
      {children}
    </div>
  );
}

export function OnboardingForm() {
  const { user } = useAuth();
  const { setActiveProfileId } = useActiveProfile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [form, setForm] = useState<FormData>({
    niche: "",
    targetAudience: "",
    goal: "",
    tone: "",
    postingFrequency: "",
    productsServices: "",
    competitors: "",
  });

  if (!user) {
    return (
      <EmptyState
        title="Você precisa entrar para criar um perfil"
        description="Acesse sua conta para salvar o onboarding e ativar o perfil."
        ctaLabel="Ir para login"
        ctaHref="/login"
      />
    );
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canAdvance() {
    if (step === 1) return form.niche.trim() && form.targetAudience.trim();
    if (step === 2) return form.goal.trim() && form.tone.trim() && form.postingFrequency.trim();
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    setProfileId(null);

    try {
      const onboardingRes = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const onboardingData = await onboardingRes.json();

      if (!onboardingRes.ok) throw new Error(onboardingData.error || "Erro no onboarding.");

      setProfileId(onboardingData.profileId);
      setActiveProfileId(onboardingData.profileId);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, profileId: onboardingData.profileId }));

      const diagnosisRes = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, profileId: onboardingData.profileId }),
      });
      const diagnosisData = await diagnosisRes.json();

      if (!diagnosisRes.ok) throw new Error(diagnosisData.error || "Erro ao gerar diagnóstico.");

      setResult(diagnosisData.result);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Tela de resultado ── */
  if (step === 4 && result) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 20 }}>
        {/* Sucesso */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid rgba(16,185,129,0.25)",
            background: "rgba(16,185,129,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(16,185,129,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2">
              <path d="M3 8l4 4 6-6"/>
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>Perfil criado e ativado!</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
              ID: <span style={{ fontFamily: "monospace", color: "var(--subtle)" }}>{profileId}</span>
            </p>
          </div>
        </div>

        {/* Diagnóstico */}
        <div
          style={{
            padding: 24,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-md)",
            background: "var(--bg-card)",
            display: "grid",
            gap: 20,
          }}
        >
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)" }}>
              Diagnóstico inicial
            </p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, fontSize: "0.92rem" }}>{result.summary}</p>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {[
              { label: "Pontos fortes", items: result.strengths, color: "var(--success)" },
              { label: "Pontos fracos", items: result.weaknesses, color: "var(--danger)" },
              { label: "Oportunidades", items: result.opportunities, color: "var(--accent-strong)" },
              { label: "Pilares", items: result.pillars, color: "var(--warning)" },
            ].map(({ label, items, color }) => (
              <div
                key={label}
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color }}>{label}</p>
                <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 4 }}>
                  {items.map((item) => (
                    <li key={item} style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.4 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos passos */}
        <div
          style={{
            padding: 24,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-md)",
            background: "var(--bg-card)",
          }}
        >
          <p style={{ margin: "0 0 14px", fontWeight: 700 }}>Próximos passos</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { href: "/ideas", n: "1", label: "Gerar ideias de conteúdo" },
              { href: "/weekly-plan", n: "2", label: "Selecionar ideias da semana" },
              { href: "/calendar", n: "3", label: "Montar o calendário" },
              { href: "/reminders", n: "4", label: "Configurar lembretes e executar" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  transition: "border-color 140ms",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "var(--accent-soft)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "var(--accent-strong)",
                    flexShrink: 0,
                  }}
                >
                  {s.n}
                </span>
                <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{s.label}</span>
                <svg style={{ marginLeft: "auto" }} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--subtle)" strokeWidth="2">
                  <path d="M6 4l4 4-4 4"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Loading (submetendo) ── */
  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
        <div className="skeleton" style={{ height: 56, borderRadius: "var(--radius-xl)" }} />
        <div className="skeleton" style={{ height: 220, borderRadius: "var(--radius-xl)" }} />
        <div className="skeleton" style={{ height: 120, borderRadius: "var(--radius-xl)" }} />
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>
          Criando perfil e gerando diagnóstico com IA…
        </p>
      </div>
    );
  }

  /* ── Wizard ── */
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 24 }}>

      {/* Cabeçalho */}
      <div style={{ display: "grid", gap: 4 }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
          Configure seu perfil
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
          O sistema usa essas informações como base para gerar ideias e roteiros alinhados ao seu negócio.
        </p>
      </div>

      {/* Card do wizard */}
      <div
        style={{
          padding: 28,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-md)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-md)",
          display: "grid",
          gap: 24,
        }}
      >
        <ProgressBar step={step} total={STEPS.length} />

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Etapa 1: Nicho + Público */}
        {step === 1 && (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1rem" }}>Quem é você no digital?</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Defina seu nicho e para quem você fala.</p>
            </div>
            <FieldGroup label="Nicho de atuação *">
              <input
                className="input"
                required
                placeholder="Ex.: nutrição esportiva, marketing digital, finanças pessoais"
                value={form.niche}
                onChange={(e) => set("niche", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Público-alvo *">
              <input
                className="input"
                required
                placeholder="Ex.: mulheres de 25 a 40 anos que querem emagrecer"
                value={form.targetAudience}
                onChange={(e) => set("targetAudience", e.target.value)}
              />
            </FieldGroup>
          </div>
        )}

        {/* Etapa 2: Objetivo + Tom + Frequência */}
        {step === 2 && (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1rem" }}>Qual é o seu objetivo?</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Define como a IA vai posicionar cada conteúdo.</p>
            </div>
            <FieldGroup label="Objetivo do conteúdo *">
              <input
                className="input"
                required
                placeholder="Ex.: gerar leads, vender consultoria, crescer seguidores"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Tom de voz *">
              <input
                className="input"
                required
                placeholder="Ex.: direto e didático, inspiracional, técnico e acessível"
                value={form.tone}
                onChange={(e) => set("tone", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Frequência de postagem *">
              <input
                className="input"
                required
                placeholder="Ex.: 4x por semana, 1 post por dia"
                value={form.postingFrequency}
                onChange={(e) => set("postingFrequency", e.target.value)}
              />
            </FieldGroup>
          </div>
        )}

        {/* Etapa 3: Produtos + Concorrentes */}
        {step === 3 && (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1rem" }}>Contexto do negócio</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Opcional, mas melhora muito a qualidade das ideias geradas.</p>
            </div>
            <FieldGroup label="Produtos ou serviços">
              <input
                className="input"
                placeholder="Ex.: consultoria, curso online, ebook, loja"
                value={form.productsServices}
                onChange={(e) => set("productsServices", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Concorrentes ou referências">
              <textarea
                className="input"
                rows={4}
                placeholder="Ex.: @perfil1, @perfil2, nomes de marcas que você admira ou compete"
                value={form.competitors}
                onChange={(e) => set("competitors", e.target.value)}
                style={{ resize: "vertical" }}
              />
            </FieldGroup>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              fontSize: "0.85rem",
              color: "var(--danger)",
            }}
          >
            {error}
          </div>
        )}

        {/* Navegação */}
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setError(null); setStep((s) => s - 1); }}
            >
              ← Voltar
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              Próximo →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "10px 24px" }}
              onClick={handleSubmit}
            >
              Salvar e gerar diagnóstico
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
