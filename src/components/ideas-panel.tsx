"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { getErrorMessage } from "@/lib/get-error-message";
import { getIdeaStatusLabel } from "@/lib/labels";
import {
  generateIdeasRequest,
  generateScriptFromIdeaRequest,
  listIdeas,
  updateIdeaStatusRequest,
} from "@/lib/services/ideas-service";
import { useActiveProfile } from "@/components/profile-provider";
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

const buttonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#e7d7c8",
  color: "var(--text)",
};

const statusPalette: Record<NonNullable<IdeaStatus>, { label: string; color: string }> = {
  generated: { label: "Gerada", color: "#8c5a22" },
  approved: { label: "Aprovada", color: "#256245" },
  rejected: { label: "Rejeitada", color: "#8a2f12" },
};

export function IdeasPanel() {
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingSavedIdeas, setLoadingSavedIdeas] = useState(false);
  const [loadingScriptKey, setLoadingScriptKey] = useState<string | null>(null);
  const [updatingIdeaId, setUpdatingIdeaId] = useState<string | null>(null);
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

  function getStatusMeta(status?: IdeaStatus) {
    const resolvedStatus = status || "generated";
    return {
      label: getIdeaStatusLabel(status),
      color: statusPalette[resolvedStatus].color,
    };
  }

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil ou faca onboarding antes de gerar ideias."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={handleGenerateIdeas} style={cardStyle}>
        <button
          type="submit"
          disabled={loadingIdeas}
          style={buttonStyle}
        >
          {loadingIdeas ? "Gerando ideias..." : "Gerar ideias com perfil ativo"}
        </button>
        {error ? <p style={{ color: "#8a2f12", marginBottom: 0 }}>{error}</p> : null}
      </form>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Ideias salvas</h2>
        {loadingSavedIdeas ? (
          <p>Carregando ideias salvas...</p>
        ) : savedIdeas.length === 0 ? (
          <p>Nenhuma ideia salva ainda.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {["alcance", "autoridade", "venda", "relacionamento"].map((category) => {
              const ideas = savedIdeas.filter((idea) => idea.category === category);

              if (ideas.length === 0) {
                return null;
              }

              return (
                <section key={category} style={{ display: "grid", gap: 12 }}>
                  <h3 style={{ margin: 0, textTransform: "capitalize" }}>{category}</h3>

                  {ideas.map((idea, index) => {
                    const ideaKey = `${category}-${idea.id || index}-${idea.title}`;
                    const generatedScript = generatedScripts[ideaKey];
                    const statusMeta = getStatusMeta(idea.status);

                    return (
                      <article
                        key={ideaKey}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 18,
                          padding: 16,
                          display: "grid",
                          gap: 12,
                          background: "rgba(255,255,255,0.65)",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              marginTop: 0,
                              marginBottom: 10,
                              fontWeight: 700,
                              color: statusMeta.color,
                            }}
                          >
                            Status: {statusMeta.label}
                          </p>
                          <h4 style={{ marginTop: 0 }}>{idea.title}</h4>
                          <p>
                            <strong>Hook:</strong> {idea.hook}
                          </p>
                          <p style={{ marginBottom: 0 }}>{idea.description}</p>
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
                            {loadingScriptKey === ideaKey
                              ? "Gerando roteiro..."
                              : "Gerar roteiro"}
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
                </section>
              );
            })}
          </div>
        )}
      </section>

      {result ? (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Ultima geracao</h2>
          <p style={{ marginBottom: 0 }}>
            As ideias geradas ja foram salvas acima e podem ser aprovadas ou rejeitadas.
          </p>
        </section>
      ) : null}
    </div>
    )
  );
}
