"use client";

import { useState } from "react";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import type { CalendarItem } from "@/types/calendar";

type CalendarResponse = {
  result: {
    items: CalendarItem[];
  };
  ideasUsedCount?: number;
  weekKey?: string;
};

const orderedDays = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
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

const buttonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

export function CalendarPanel() {
  const [loading, setLoading] = useState(false);
  const [generatingReminders, setGeneratingReminders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalendarResponse | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string>("");
  const { activeProfileId, profile } = useActiveProfile();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de gerar calendario.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setReminderMessage("");

    try {
      const response = await fetch("/api/calendar", {
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar calendario");
      }

      setResult(data);
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

  async function handleGenerateReminders() {
    if (!activeProfileId) {
      setError("Ative um perfil antes de gerar lembretes.");
      return;
    }

    setGeneratingReminders(true);
    setError(null);
    setReminderMessage("");

    try {
      const response = await fetch("/api/calendar/generate-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfileId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar lembretes");
      }

      setReminderMessage(
        data.createdCount > 0
          ? `${data.createdCount} lembrete(s) criado(s) para a semana ${data.weekKey}.`
          : data.message || "Nenhum lembrete novo foi criado."
      );
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Erro inesperado."
      );
    } finally {
      setGeneratingReminders(false);
    }
  }

  const sortedItems =
    result?.result.items.slice().sort((a, b) => {
      return orderedDays.indexOf(a.dayOfWeek) - orderedDays.indexOf(b.dayOfWeek);
    }) || [];

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil e selecione uma semana antes de montar o calendario."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading
            ? "Gerando calendario..."
            : "Gerar calendario com ideias selecionadas"}
        </button>
        {error ? <p style={{ color: "#8a2f12", marginBottom: 0 }}>{error}</p> : null}
      </form>

      {result ? (
        <section style={cardStyle}>
          {result.weekKey ? (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 12,
                marginBottom: 16,
                background: "rgba(255,255,255,0.65)",
              }}
            >
              <strong>Semana do planejamento:</strong> {result.weekKey}
            </div>
          ) : null}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 12,
              marginBottom: 16,
              background: "rgba(255,255,255,0.65)",
              display: "grid",
              gap: 12,
            }}
          >
            <div>
              <strong>Ideias selecionadas consideradas:</strong>{" "}
              {result.ideasUsedCount ?? 0}
            </div>
            <button
              type="button"
              onClick={handleGenerateReminders}
              disabled={generatingReminders}
              style={buttonStyle}
            >
              {generatingReminders
                ? "Gerando lembretes..."
                : "Gerar lembretes automaticos desta semana"}
            </button>
            {reminderMessage ? (
              <p style={{ margin: 0, color: "#256245" }}>{reminderMessage}</p>
            ) : null}
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {sortedItems.map((item, index) => (
              <article
                key={`${item.dayOfWeek}-${item.title}-${index}`}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 8, textTransform: "capitalize" }}>
                  {item.dayOfWeek} - {item.title}
                </h3>
                <p>
                  <strong>Categoria:</strong> {item.category}
                </p>
                <p>
                  <strong>Formato:</strong> {item.contentType}
                </p>
                <p>
                  <strong>Objetivo:</strong> {item.objective}
                </p>
                <p>
                  <strong>Ideia de origem:</strong>{" "}
                  {item.sourceIdeaTitle && item.sourceIdeaTitle.trim()
                    ? item.sourceIdeaTitle
                    : "Nova sugestao criada no calendario"}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Notas:</strong> {item.notes}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
    )
  );
}
