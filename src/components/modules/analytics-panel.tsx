"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { fetchAnalytics } from "@/lib/services/analytics-service";
import type { AnalyticsData } from "@/types/analytics";

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

const chartCardStyle: React.CSSProperties = {
  ...cardStyle,
  display: "grid",
  gap: 18,
};

const rowCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 16,
  background: "var(--surface-soft)",
  display: "grid",
  gap: 10,
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#f8f5ff",
  fontWeight: 700,
  cursor: "pointer",
};

type MonitoringRow = {
  title: string;
  label: string;
  value: number;
  tone: "accent" | "success" | "warning" | "danger" | "neutral";
  detail: string;
};

export function AnalyticsPanel() {
  const { activeProfileId, profile } = useActiveProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!activeProfileId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAnalytics(activeProfileId);
      setData(response);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      void loadAnalytics();
    } else {
      setData(null);
    }
  }, [activeProfileId, loadAnalytics]);

  const rows = useMemo<MonitoringRow[]>(() => {
    if (!data) return [];

    return [
      {
        title: "Ideias aprovadas",
        label: "conteúdo",
        value: data.ideas.approved,
        tone: "accent",
        detail: `${data.ideas.total} ideias totais / ${data.ideas.rejected} descartadas`,
      },
      {
        title: "Roteiros gerados",
        label: "produção",
        value: data.scripts.total,
        tone: "success",
        detail: "Base pronta para criação e gravação",
      },
      {
        title: "Itens no calendário",
        label: "planejamento",
        value: data.calendar.total,
        tone: "warning",
        detail: "Distribuição atual da semana ativa",
      },
      {
        title: "Execução da rotina",
        label: "operação",
        value: data.reminders.executionRate,
        tone: data.reminders.executionRate >= 60 ? "success" : "danger",
        detail: `${data.reminders.completed} concluídos / ${data.reminders.pending} pendentes`,
      },
    ];
  }, [data]);

  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  if (!profile) {
    return (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para ver o monitoramento da operação."
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
              Monitoramento operacional
            </p>
            <strong>Acompanhe o ritmo de produção, planejamento e execução do perfil ativo.</strong>
          </div>
          <button type="button" onClick={loadAnalytics} disabled={loading} style={buttonStyle}>
            {loading ? "Atualizando..." : "Atualizar monitoramento"}
          </button>
        </div>
        {error ? <FeedbackBanner message={error} tone="error" /> : null}
      </section>

      {loading && !data ? (
        <div className="skeleton" style={{ height: 320, borderRadius: 24 }} />
      ) : null}

      {data ? (
        <>
          <section style={chartCardStyle}>
            <h2 style={{ margin: 0 }}>Performance da operação</h2>
            <div
              style={{
                minHeight: 240,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                alignItems: "end",
                gap: 18,
              }}
              className="marketing-card-grid"
            >
              {rows.map((row) => (
                <div
                  key={row.title}
                  style={{
                    display: "grid",
                    gap: 10,
                    alignItems: "end",
                  }}
                >
                  <div
                    style={{
                      height: `${Math.max((row.value / maxValue) * 190, 28)}px`,
                      borderRadius: "16px 16px 6px 6px",
                      background:
                        row.tone === "danger"
                          ? "linear-gradient(180deg, #fb7185, #be123c)"
                          : row.tone === "success"
                            ? "linear-gradient(180deg, #34d399, #059669)"
                            : row.tone === "warning"
                              ? "linear-gradient(180deg, #a855f7, #7c3aed)"
                              : "linear-gradient(180deg, #a855f7, #7c3aed)",
                      boxShadow: "0 18px 40px rgba(124,58,237,0.28)",
                    }}
                  />
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: "1.1rem" }}>
                      {row.tone === "danger" ? `${row.value}%` : row.value}
                    </strong>
                    <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{row.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 12 }}>
            {rows
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((row) => (
                <article key={row.title} style={rowCardStyle}>
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
                      <h3 style={{ margin: 0 }}>{row.title}</h3>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <StatusBadge tone="neutral">{row.label}</StatusBadge>
                        <StatusBadge tone={row.tone}>
                          {row.tone === "danger" ? `${row.value}%` : row.value}
                        </StatusBadge>
                      </div>
                    </div>
                    <div style={{ color: "var(--muted)", textAlign: "right" }}>
                      <p style={{ margin: 0 }}>{row.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
          </section>

          <section style={cardStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <article style={rowCardStyle}>
                <span style={{ color: "var(--muted)" }}>Automações enviadas</span>
                <strong style={{ fontSize: "1.7rem" }}>{data.automations.sent}</strong>
              </article>
              <article style={rowCardStyle}>
                <span style={{ color: "var(--muted)" }}>Automações pendentes</span>
                <strong style={{ fontSize: "1.7rem" }}>{data.automations.pending}</strong>
              </article>
              <article style={rowCardStyle}>
                <span style={{ color: "var(--muted)" }}>Automações falhadas</span>
                <strong style={{ fontSize: "1.7rem" }}>{data.automations.failed}</strong>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
