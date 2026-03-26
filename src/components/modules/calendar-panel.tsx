"use client";

import { useMemo, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CalendarItem } from "@/types/calendar";

type CalendarResponse = {
  result: {
    items: CalendarItem[];
  };
  ideasUsedCount?: number;
  weekKey?: string;
};

const orderedDays = [
  { key: "segunda", short: "Seg" },
  { key: "terca", short: "Ter" },
  { key: "quarta", short: "Qua" },
  { key: "quinta", short: "Qui" },
  { key: "sexta", short: "Sex" },
  { key: "sabado", short: "Sab" },
  { key: "domingo", short: "Dom" },
] as const;

const shellStyle: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gap: 20,
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
  color: "#f8f5ff",
  fontWeight: 700,
  cursor: "pointer",
};

const calendarColumnStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 14,
  background: "var(--bg-elevated)",
  minHeight: 220,
  display: "grid",
  alignContent: "start",
  gap: 12,
  boxShadow: "var(--shadow-soft)",
};

function getWeekRangeLabel(weekKey?: string) {
  if (!weekKey) return "Semana atual";

  const match = /^(\d{4})-W(\d{2})$/.exec(weekKey);
  if (!match) return weekKey;

  const year = Number(match[1]);
  const week = Number(match[2]);

  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const day = simple.getUTCDay() || 7;
  const monday = new Date(simple);
  monday.setUTCDate(simple.getUTCDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(monday)} - ${formatter.format(sunday)}, ${year}`;
}

export function CalendarPanel() {
  const [loading, setLoading] = useState(false);
  const [generatingReminders, setGeneratingReminders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalendarResponse | null>(null);
  const [reminderMessage, setReminderMessage] = useState("");
  const { activeProfileId, profile } = useActiveProfile();

  async function generateCalendar() {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generateCalendar();
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

  const itemsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarItem[]>();

    for (const day of orderedDays) {
      grouped.set(day.key, []);
    }

    for (const item of result?.result.items || []) {
      const current = grouped.get(item.dayOfWeek) || [];
      current.push(item);
      grouped.set(item.dayOfWeek, current);
    }

    return grouped;
  }, [result]);

  if (!profile) {
    return (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil e selecione uma semana antes de montar o calendario."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    );
  }

  return (
    <div style={shellStyle}>
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Gerar semana
            </p>
            <strong>Transforme as ideias selecionadas em um calendário visual pronto para execução.</strong>
          </div>

          <button type="button" onClick={generateCalendar} disabled={loading} style={buttonStyle}>
            {loading ? "Gerando..." : "Gerar semana"}
          </button>
        </div>

        {error ? <FeedbackBanner message={error} tone="error" /> : null}
      </section>

      {loading ? (
        <div className="skeleton" style={{ height: 360, borderRadius: 24 }} />
      ) : null}

      {result ? (
        <>
          <section style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <p style={{ margin: 0, color: "var(--muted)" }}>Semana planejada</p>
                <h2 style={{ margin: 0 }}>{getWeekRangeLabel(result.weekKey)}</h2>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <StatusBadge tone="accent">
                  {result.ideasUsedCount ?? 0} ideia(s) usadas
                </StatusBadge>
                <StatusBadge tone="success">
                  {(result.result.items || []).length} item(ns) no calendario
                </StatusBadge>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gap: 12,
              }}
              className="marketing-card-grid"
            >
              {orderedDays.map((day, index) => {
                const items = itemsByDay.get(day.key) || [];

                return (
                  <article key={day.key} style={calendarColumnStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "grid", gap: 2 }}>
                        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{day.short}</span>
                        <strong style={{ fontSize: "1.7rem" }}>{index + 1}</strong>
                      </div>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          background: "var(--surface-soft)",
                          color: "var(--accent-strong)",
                          fontWeight: 700,
                        }}
                      >
                        +
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {items.length > 0 ? (
                        items.map((item, itemIndex) => (
                          <div
                            key={`${item.dayOfWeek}-${item.title}-${itemIndex}`}
                            style={{
                              borderRadius: 16,
                              border: "1px solid var(--border-strong)",
                              padding: 10,
                              background: "rgba(139,92,246,0.14)",
                              display: "grid",
                              gap: 8,
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                color: "var(--accent-strong)",
                                fontWeight: 700,
                                lineHeight: 1.35,
                              }}
                            >
                              {item.title}
                            </p>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <StatusBadge tone="accent">{item.contentType}</StatusBadge>
                              <StatusBadge tone="neutral">{item.category}</StatusBadge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            minHeight: 90,
                            borderRadius: 14,
                            border: "1px dashed var(--border)",
                            background: "var(--surface-soft)",
                          }}
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <p style={{ margin: 0, color: "var(--muted)" }}>Execução</p>
                <strong>Gere lembretes automáticos a partir desta semana.</strong>
              </div>
              <button
                type="button"
                onClick={handleGenerateReminders}
                disabled={generatingReminders}
                style={buttonStyle}
              >
                {generatingReminders ? "Gerando lembretes..." : "Gerar lembretes"}
              </button>
            </div>
            {reminderMessage ? <FeedbackBanner message={reminderMessage} tone="success" /> : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
