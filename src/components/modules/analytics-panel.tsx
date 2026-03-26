"use client";

import { useCallback, useEffect, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { fetchAnalytics } from "@/lib/services/analytics-service";
import type { AnalyticsData } from "@/types/analytics";

const shellStyle: React.CSSProperties = {
  maxWidth: 1100,
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

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const metricCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 18,
  background: "rgba(255,255,255,0.7)",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
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
      const data = await fetchAnalytics(activeProfileId);
      setData(data);
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

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para ver os analytics da operacao."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

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
              <p style={{ margin: 0, color: "var(--muted)" }}>Leitura da operacao</p>
              <strong>Veja rapidamente o volume e a execucao do perfil ativo.</strong>
            </div>
            <button type="button" onClick={loadAnalytics} disabled={loading} style={buttonStyle}>
              {loading ? "Atualizando..." : "Atualizar analytics"}
            </button>
          </div>
          {error ? <FeedbackBanner message={error} tone="error" /> : null}
        </section>

        {data ? (
          <div style={metricGridStyle}>
              <section style={metricCardStyle}>
                <StatusBadge tone="accent">Conteudo</StatusBadge>
                <h2 style={{ marginTop: 0 }}>Ideias</h2>
                <p><strong>Total:</strong> {data.ideas.total}</p>
                <p><strong>Aprovadas:</strong> {data.ideas.approved}</p>
                <p><strong>Rejeitadas:</strong> {data.ideas.rejected}</p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Aguardando decisao:</strong> {data.ideas.generated}
                </p>
              </section>

              <section style={metricCardStyle}>
                <StatusBadge tone="accent">Roteiro</StatusBadge>
                <h2 style={{ marginTop: 0 }}>Roteiros</h2>
                <p style={{ marginBottom: 0 }}>
                  <strong>Total:</strong> {data.scripts.total}
                </p>
              </section>

              <section style={metricCardStyle}>
                <StatusBadge tone="accent">Planejamento</StatusBadge>
                <h2 style={{ marginTop: 0 }}>Calendario</h2>
                <p style={{ marginBottom: 0 }}>
                  <strong>Itens planejados:</strong> {data.calendar.total}
                </p>
              </section>

              <section style={metricCardStyle}>
                <StatusBadge tone="success">Execucao</StatusBadge>
                <h2 style={{ marginTop: 0 }}>Execucao</h2>
                <p><strong>Total de lembretes:</strong> {data.reminders.total}</p>
                <p><strong>Concluidos:</strong> {data.reminders.completed}</p>
                <p><strong>Pendentes:</strong> {data.reminders.pending}</p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Taxa de execucao:</strong> {data.reminders.executionRate}%
                </p>
              </section>

              <section style={metricCardStyle}>
                <StatusBadge tone="warning">Automacao</StatusBadge>
                <h2 style={{ marginTop: 0 }}>Automacoes</h2>
                <p><strong>Total:</strong> {data.automations.total}</p>
                <p><strong>Enviadas:</strong> {data.automations.sent}</p>
                <p><strong>Pendentes:</strong> {data.automations.pending}</p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Falhadas:</strong> {data.automations.failed}
                </p>
              </section>
          </div>
        ) : loading ? (
          <div className="skeleton" style={{ height: 300, borderRadius: 24 }} />
        ) : null}
      </>
    </div>
    )
  );
}
