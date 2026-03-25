"use client";

import { useCallback, useEffect, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import type { ContentIdea } from "@/types/ideas";

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

export function WeeklyPlanPanel() {
  const { activeProfileId, profile } = useActiveProfile();
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [weekKey, setWeekKey] = useState("");

  const loadApprovedIdeas = useCallback(async () => {
    if (!activeProfileId) {
      return;
    }

    setLoadingIdeas(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ideas/list?profileId=${encodeURIComponent(activeProfileId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar ideias");
      }

      const approvedIdeas = (data.ideas || []).filter(
        (idea: ContentIdea) => idea.status === "approved"
      );

      setIdeas(approvedIdeas);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro inesperado.");
    } finally {
      setLoadingIdeas(false);
    }
  }, [activeProfileId]);

  const loadCurrentSelection = useCallback(async () => {
    if (!activeProfileId) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `/api/weekly-plan/current?profileId=${encodeURIComponent(activeProfileId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar selecao");
      }

      setSelectedIds(data.ideaIds || []);
      setWeekKey(data.weekKey || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro inesperado.");
    }
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      void loadApprovedIdeas();
      void loadCurrentSelection();
    } else {
      setIdeas([]);
      setSelectedIds([]);
      setWeekKey("");
      setSuccessMessage(null);
    }
  }, [activeProfileId, loadApprovedIdeas, loadCurrentSelection]);

  function toggleIdea(ideaId: string) {
    setSelectedIds((current) =>
      current.includes(ideaId)
        ? current.filter((id) => id !== ideaId)
        : [...current, ideaId]
    );
  }

  async function saveSelection() {
    if (!activeProfileId) {
      setError("Ative um perfil antes de salvar a selecao.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/weekly-plan/select-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfileId,
          ideaIds: selectedIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar selecao");
      }

      setWeekKey(data.weekKey || "");
      setSuccessMessage(
        `Selecao salva com sucesso. ${data.selectedCount} ideia(s) escolhida(s).`
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para selecionar as ideias da semana."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      {weekKey ? (
        <section style={cardStyle}>
          <strong>Semana ativa:</strong> {weekKey}
        </section>
      ) : null}

      <section style={cardStyle}>
        {loadingIdeas ? (
          <p style={{ margin: 0 }}>Carregando ideias aprovadas...</p>
        ) : ideas.length === 0 ? (
          <p style={{ margin: 0 }}>Nenhuma ideia aprovada disponivel para esta semana.</p>
        ) : (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              {ideas.map((idea) => (
                <article
                  key={idea.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: 16,
                    display: "grid",
                    gap: 8,
                    background: "rgba(255,255,255,0.65)",
                  }}
                >
                  <label
                    style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={idea.id ? selectedIds.includes(idea.id) : false}
                      onChange={() => idea.id && toggleIdea(idea.id)}
                    />
                    <div>
                      <p style={{ marginTop: 0 }}>
                        <strong>Categoria:</strong> {idea.category}
                      </p>
                      <h3 style={{ margin: "4px 0" }}>{idea.title}</h3>
                      <p>
                        <strong>Hook:</strong> {idea.hook}
                      </p>
                      <p style={{ marginBottom: 0 }}>{idea.description}</p>
                    </div>
                  </label>
                </article>
              ))}
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <button type="button" onClick={saveSelection} disabled={saving} style={buttonStyle}>
                {saving ? "Salvando..." : "Salvar ideias da semana"}
              </button>
              {error ? <p style={{ color: "#8a2f12", margin: 0 }}>{error}</p> : null}
              {successMessage ? (
                <p style={{ color: "#256245", margin: 0 }}>{successMessage}</p>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
    )
  );
}
