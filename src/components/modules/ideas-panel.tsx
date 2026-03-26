"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { getIdeaStatusLabel } from "@/lib/utils/labels";
import {
  generateIdeasRequest,
  generateScriptFromIdeaRequest,
  listIdeas,
  updateIdeaStatusRequest,
} from "@/lib/services/ideas-service";
import type { ContentIdea, IdeaStatus } from "@/types/ideas";
import type { ScriptResult } from "@/types/scripts";

type IdeasResult = {
  ideas: ContentIdea[];
};

type ScriptMap = Record<string, ScriptResult>;

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

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  color: "var(--text)",
  padding: "14px 16px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#f8f5ff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "var(--surface-strong)",
  color: "var(--text)",
};

const chipStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "var(--surface-soft)",
  color: "var(--text)",
  fontWeight: 700,
  fontSize: "0.92rem",
  cursor: "pointer",
};

const statusPalette: Record<NonNullable<IdeaStatus>, { label: string; tone: "accent" | "success" | "danger" }> = {
  generated: { label: "Nova", tone: "accent" },
  approved: { label: "Em producao", tone: "success" },
  rejected: { label: "Descartada", tone: "danger" },
};

export function IdeasPanel() {
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingSavedIdeas, setLoadingSavedIdeas] = useState(false);
  const [loadingScriptKey, setLoadingScriptKey] = useState<string | null>(null);
  const [updatingIdeaId, setUpdatingIdeaId] = useState<string | null>(null);
  const [focusPrompt, setFocusPrompt] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "generated" | "approved" | "rejected">("all");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdeasResult | null>(null);
  const [generatedScripts, setGeneratedScripts] = useState<ScriptMap>({});
  const [savedIdeas, setSavedIdeas] = useState<ContentIdea[]>([]);
  const { activeProfileId, profile } = useActiveProfile();

  const loadSavedIdeas = useCallback(async () => {
    if (!activeProfileId) return;

    setLoadingSavedIdeas(true);
    setError(null);

    try {
      const data = await listIdeas(activeProfileId);
      setSavedIdeas(data.ideas || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoadingSavedIdeas(false);
    }
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      void loadSavedIdeas();
      return;
    }

    setSavedIdeas([]);
  }, [activeProfileId, loadSavedIdeas]);

  async function handleGenerateIdeas(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de gerar ideias.");
      return;
    }

    setLoadingIdeas(true);
    setError(null);
    setGeneratedScripts({});

    try {
      const data = await generateIdeasRequest({
        profileId: activeProfileId,
        niche: profile.niche,
        targetAudience: profile.target_audience,
        goal: profile.goal,
        tone: profile.tone,
        postingFrequency: profile.posting_frequency,
        productsServices: profile.products_services || "",
        competitors: profile.competitors || "",
        focusPrompt,
      });

      setResult(data.result);
      await loadSavedIdeas();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setLoadingIdeas(false);
    }
  }

  async function handleGenerateScriptFromIdea(idea: ContentIdea, key: string) {
    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de gerar roteiro.");
      return;
    }

    setLoadingScriptKey(key);
    setError(null);

    try {
      const data = await generateScriptFromIdeaRequest({
        profileId: activeProfileId,
        niche: profile.niche,
        targetAudience: profile.target_audience,
        goal: profile.goal,
        tone: profile.tone,
        postingFrequency: profile.posting_frequency,
        productsServices: profile.products_services || "",
        competitors: profile.competitors || "",
        category: idea.category,
        title: idea.title,
        hookBase: idea.hook,
        description: idea.description,
      });

      setGeneratedScripts((current) => ({
        ...current,
        [key]: data.result,
      }));
    } catch (generationError) {
      setError(getErrorMessage(generationError));
    } finally {
      setLoadingScriptKey(null);
    }
  }

  async function updateIdeaStatus(ideaId: string, status: IdeaStatus) {
    if (!activeProfileId) {
      setError("Ative um perfil antes de atualizar ideias.");
      return;
    }

    setUpdatingIdeaId(ideaId);
    setError(null);

    try {
      await updateIdeaStatusRequest({
        ideaId,
        profileId: activeProfileId,
        status,
      });

      setSavedIdeas((current) =>
        current.map((idea) =>
          idea.id === ideaId ? { ...idea, status } : idea
        )
      );
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setUpdatingIdeaId(null);
    }
  }

  const filteredIdeas = useMemo(
    () =>
      savedIdeas.filter((idea) => {
        if (statusFilter === "all") return true;
        return (idea.status || "generated") === statusFilter;
      }),
    [savedIdeas, statusFilter]
  );

  const counters = useMemo(
    () => ({
      all: savedIdeas.length,
      generated: savedIdeas.filter((idea) => (idea.status || "generated") === "generated").length,
      approved: savedIdeas.filter((idea) => idea.status === "approved").length,
      rejected: savedIdeas.filter((idea) => idea.status === "rejected").length,
    }),
    [savedIdeas]
  );

  if (!profile) {
    return (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil ou faca onboarding antes de gerar ideias."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    );
  }

  return (
    <div style={shellStyle}>
      <form onSubmit={handleGenerateIdeas} style={cardStyle}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Gerar novas ideias
            </p>
            <strong>Crie ideias poderosas com base no seu perfil ativo e em um foco opcional de campanha.</strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 12,
            }}
            className="marketing-card-grid"
          >
            <input
              value={focusPrompt}
              onChange={(event) => setFocusPrompt(event.target.value)}
              placeholder="Nicho ou tema específico (ex.: marketing digital)"
              style={fieldStyle}
            />
            <button type="submit" disabled={loadingIdeas} style={{ ...buttonStyle, minWidth: 180 }}>
              {loadingIdeas ? "Gerando..." : "Gerar ideias"}
            </button>
          </div>
        </div>

        {error ? <FeedbackBanner message={error} tone="error" /> : null}
      </form>

      <section style={cardStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {[
            ["Todas", counters.all],
            ["Novas", counters.generated],
            ["Em producao", counters.approved],
            ["Descartadas", counters.rejected],
          ].map(([label, value]) => (
            <article
              key={label}
              style={{
                borderRadius: 18,
                border: "1px solid var(--border)",
                padding: 16,
                background: "var(--surface-soft)",
                display: "grid",
                gap: 6,
              }}
            >
              <span style={{ color: "var(--muted)" }}>{label}</span>
              <strong style={{ fontSize: "1.8rem" }}>{value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            ["all", "Todas"],
            ["generated", "Nova"],
            ["approved", "Em producao"],
            ["rejected", "Descartada"],
          ].map(([value, label]) => {
            const active = statusFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatusFilter(value as "all" | "generated" | "approved" | "rejected")
                }
                style={{
                  ...chipStyle,
                  background: active ? "var(--accent)" : "var(--surface-soft)",
                  color: active ? "#f8f5ff" : "var(--text)",
                  borderColor: active ? "transparent" : "var(--border)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loadingSavedIdeas ? (
          <div className="skeleton" style={{ height: 240, borderRadius: 20 }} />
        ) : filteredIdeas.length === 0 ? (
          <section style={cardStyle}>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Nenhuma ideia salva ainda para este filtro.
            </p>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {filteredIdeas.map((idea, index) => {
              const ideaKey = `${idea.category}-${idea.id || index}-${idea.title}`;
              const generatedScript = generatedScripts[ideaKey];
              const resolvedStatus = idea.status || "generated";
              const statusMeta = statusPalette[resolvedStatus];

              return (
                <article
                  key={ideaKey}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 22,
                    padding: 18,
                    display: "grid",
                    gap: 14,
                    background: "var(--bg-elevated)",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                    <StatusBadge tone="neutral">{idea.category}</StatusBadge>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: "1.4rem", lineHeight: 1.12 }}>
                      {idea.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--accent-strong)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      &ldquo;{idea.hook}&rdquo;
                    </p>
                    <p style={{ margin: 0, color: "var(--muted)" }}>{idea.description}</p>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => idea.id && updateIdeaStatus(idea.id, "approved")}
                      disabled={updatingIdeaId === idea.id}
                      style={secondaryButtonStyle}
                    >
                      Aprovar
                    </button>

                    <button
                      type="button"
                      onClick={() => idea.id && updateIdeaStatus(idea.id, "rejected")}
                      disabled={updatingIdeaId === idea.id}
                      style={secondaryButtonStyle}
                    >
                      Rejeitar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenerateScriptFromIdea(idea, ideaKey)}
                      disabled={loadingScriptKey === ideaKey}
                      style={buttonStyle}
                    >
                      {loadingScriptKey === ideaKey ? "Gerando..." : "Gerar roteiro"}
                    </button>
                  </div>

                  {generatedScript ? (
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        paddingTop: 12,
                        display: "grid",
                        gap: 12,
                      }}
                    >
                      <section>
                        <h5 style={{ marginBottom: 6 }}>Hook</h5>
                        <p style={{ margin: 0 }}>{generatedScript.hook}</p>
                      </section>

                      <section>
                        <h5 style={{ marginBottom: 6 }}>Desenvolvimento</h5>
                        <p style={{ margin: 0 }}>{generatedScript.development}</p>
                      </section>

                      <section>
                        <h5 style={{ marginBottom: 6 }}>CTA</h5>
                        <p style={{ margin: 0 }}>{generatedScript.cta}</p>
                      </section>

                      <section>
                        <h5 style={{ marginBottom: 6 }}>Legenda</h5>
                        <p style={{ margin: 0 }}>{generatedScript.caption}</p>
                      </section>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {result ? (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Ultima geracao</h2>
          <p style={{ marginBottom: 0, color: "var(--muted)" }}>
            {result.ideas.length} ideia(s) foram geradas e salvas. Agora voce pode aprovar, descartar ou transformar em roteiro.
          </p>
        </section>
      ) : null}
    </div>
  );
}
