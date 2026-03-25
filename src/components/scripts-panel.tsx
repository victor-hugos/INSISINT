"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { useActiveProfile } from "@/components/profile-provider";
import type { IdeaCategory } from "@/types/ideas";
import type { ScriptResult } from "@/types/scripts";

const IDEA_STORAGE_KEY = "instasocial:selected-idea";

const categories: IdeaCategory[] = [
  "alcance",
  "autoridade",
  "venda",
  "relacionamento",
];

const shellStyle: React.CSSProperties = {
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

const buttonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

export function ScriptsPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const { activeProfileId, profile } = useActiveProfile();
  const [form, setForm] = useState({
    category: "alcance" as IdeaCategory,
    title: "",
    hookBase: "",
    description: "",
  });

  useEffect(() => {
    const storedIdea = window.localStorage.getItem(IDEA_STORAGE_KEY);

    if (!storedIdea) {
      return;
    }

    try {
      const ideaData = JSON.parse(storedIdea) as Partial<typeof form>;
      setForm((current) => ({
        ...current,
        ...ideaData,
      }));
    } catch {
      window.localStorage.removeItem(IDEA_STORAGE_KEY);
    }
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de gerar roteiro.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfileId,
          niche: profile.niche,
          targetAudience: profile.target_audience,
          goal: profile.goal,
          tone: profile.tone,
          postingFrequency: profile.posting_frequency,
          productsServices: profile.products_services || "",
          competitors: profile.competitors || "",
          category: form.category,
          title: form.title,
          hookBase: form.hookBase,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar roteiro");
      }

      setResult(data.result);
      window.localStorage.setItem(IDEA_STORAGE_KEY, JSON.stringify(form));
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
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil ou faca onboarding antes de gerar roteiros."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={gridStyle}>
          <label style={labelStyle}>
            Categoria
            <select
              style={fieldStyle}
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value as IdeaCategory)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category[0].toUpperCase()}
                  {category.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ ...gridStyle, marginTop: 14 }}>
          <label style={labelStyle}>
            Titulo da ideia
            <input
              required
              style={fieldStyle}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ex.: 3 erros que travam seu alcance"
            />
          </label>
          <label style={labelStyle}>
            Hook base
            <input
              required
              style={fieldStyle}
              value={form.hookBase}
              onChange={(event) => updateField("hookBase", event.target.value)}
              placeholder="Ex.: Se voce faz isso, seu conteudo morre"
            />
          </label>
        </div>

        <label style={{ ...labelStyle, marginTop: 14 }}>
          Descricao da ideia
          <textarea
            required
            rows={5}
            style={{ ...fieldStyle, resize: "vertical" }}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Explique rapidamente o angulo da ideia"
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
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Gerando roteiro..." : "Gerar roteiro com perfil ativo"}
          </button>
        </div>

        {error ? <p style={{ color: "#8a2f12", marginTop: 16 }}>{error}</p> : null}
      </form>

      {result ? (
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>Roteiro gerado</h2>
            <Link
              href="/calendar"
              style={{ color: "var(--accent-strong)", fontWeight: 700 }}
            >
              Gerar calendario semanal
            </Link>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <article>
              <h3>Hook</h3>
              <p>{result.hook}</p>
            </article>
            <article>
              <h3>Desenvolvimento</h3>
              <p>{result.development}</p>
            </article>
            <article>
              <h3>CTA</h3>
              <p>{result.cta}</p>
            </article>
            <article>
              <h3>Legenda</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{result.caption}</p>
            </article>
          </div>
        </section>
      ) : null}
    </div>
    )
  );
}
