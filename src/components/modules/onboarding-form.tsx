"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import type { DiagnosisResult } from "@/types/onboarding";

const STORAGE_KEY = "instasocial:last-profile";

const formShellStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  display: "grid",
  gap: 24,
};

const cardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.8)",
  padding: "14px 16px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "var(--muted)",
  fontSize: "0.95rem",
};

const submitStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 8,
};

export function OnboardingForm() {
  const { user } = useAuth();
  const { setActiveProfileId } = useActiveProfile();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [form, setForm] = useState({
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
        title="Voce precisa entrar para criar um perfil"
        description="Acesse sua conta para salvar o onboarding no usuario correto e ativar o perfil."
        ctaLabel="Ir para login"
        ctaHref="/login"
      />
    );
  }

  const currentUser = user;

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      if (!onboardingRes.ok) {
        throw new Error(onboardingData.error || "Erro no onboarding.");
      }

      setProfileId(onboardingData.profileId);
      setActiveProfileId(onboardingData.profileId);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...form,
          profileId: onboardingData.profileId,
        })
      );

      const diagnosisRes = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          profileId: onboardingData.profileId,
        }),
      });

      const diagnosisData = await diagnosisRes.json();

      if (!diagnosisRes.ok) {
        throw new Error(diagnosisData.error || "Erro ao gerar diagnostico.");
      }

      setResult(diagnosisData.result);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={formShellStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={gridStyle}>
          <label style={labelStyle}>
            Nicho
            <input
              required
              style={fieldStyle}
              value={form.niche}
              onChange={(event) => updateField("niche", event.target.value)}
              placeholder="Ex.: nutricao esportiva"
            />
          </label>
          <label style={labelStyle}>
            Publico-alvo
            <input
              required
              style={fieldStyle}
              value={form.targetAudience}
              onChange={(event) =>
                updateField("targetAudience", event.target.value)
              }
              placeholder="Ex.: mulheres de 25 a 40 anos"
            />
          </label>
          <label style={labelStyle}>
            Objetivo
            <input
              required
              style={fieldStyle}
              value={form.goal}
              onChange={(event) => updateField("goal", event.target.value)}
              placeholder="Ex.: gerar leads no Instagram"
            />
          </label>
          <label style={labelStyle}>
            Tom de voz
            <input
              required
              style={fieldStyle}
              value={form.tone}
              onChange={(event) => updateField("tone", event.target.value)}
              placeholder="Ex.: direto, energico e didatico"
            />
          </label>
          <label style={labelStyle}>
            Frequencia de postagem
            <input
              required
              style={fieldStyle}
              value={form.postingFrequency}
              onChange={(event) =>
                updateField("postingFrequency", event.target.value)
              }
              placeholder="Ex.: 4x por semana"
            />
          </label>
          <label style={labelStyle}>
            Produtos ou servicos
            <input
              style={fieldStyle}
              value={form.productsServices}
              onChange={(event) =>
                updateField("productsServices", event.target.value)
              }
              placeholder="Ex.: consultoria e ebooks"
            />
          </label>
        </div>

        <label style={{ ...labelStyle, marginTop: 14 }}>
          Concorrentes ou referencias
          <textarea
            rows={4}
            style={{ ...fieldStyle, resize: "vertical" }}
            value={form.competitors}
            onChange={(event) => updateField("competitors", event.target.value)}
            placeholder="Ex.: nomes de perfis, marcas ou criadores"
          />
        </label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
          }}
        >
          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? "Gerando diagnostico..." : "Salvar e gerar diagnostico"}
          </button>
          <span style={{ color: "var(--muted)" }}>
            Usuario autenticado: <strong>{currentUser.email ?? currentUser.id}</strong>
          </span>
        </div>

        {error ? (
          <p style={{ color: "#8a2f12", marginTop: 16 }}>{error}</p>
        ) : null}
      </form>

      {profileId ? (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Profile ID salvo</h2>
          <p style={{ wordBreak: "break-all", marginBottom: 8 }}>
            <strong>{profileId}</strong>
          </p>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Esse perfil tambem foi ativado automaticamente para as proximas telas.
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 16,
                background: "rgba(255,255,255,0.65)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Proximos passos</h3>
              <p>Seu perfil foi criado e ativado. Agora siga este fluxo:</p>

              <div style={{ display: "grid", gap: 8 }}>
                <Link href="/ideas">1. Gerar ideias</Link>
                <Link href="/scripts">2. Gerar roteiros</Link>
                <Link href="/weekly-plan">3. Selecionar ideias da semana</Link>
                <Link href="/calendar">4. Montar calendario</Link>
                <Link href="/reminders">5. Executar a semana</Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {result ? (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Diagnostico inicial</h2>
          <p style={{ color: "var(--muted)" }}>{result.summary}</p>

          <div style={gridStyle}>
            <div>
              <h3>Pontos fortes</h3>
              <ul style={listStyle}>
                {result.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Pontos fracos</h3>
              <ul style={listStyle}>
                {result.weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Oportunidades</h3>
              <ul style={listStyle}>
                {result.opportunities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Pilares de conteudo</h3>
              <ul style={listStyle}>
                {result.pillars.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
