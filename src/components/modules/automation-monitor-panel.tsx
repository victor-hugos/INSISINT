"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";

type AutomationEvent = {
  id: string;
  event_type: string;
  comment_text: string;
  external_comment_id?: string;
  external_from_id?: string;
  matched_rule_id?: string | null;
  created_at: string;
};

type AutomationAction = {
  id: string;
  action_type: string;
  status: "pending" | "sent" | "failed";
  error_message?: string | null;
  retry_count?: number;
  created_at: string;
  automation_events?: {
    id: string;
    comment_text?: string;
    external_comment_id?: string;
    external_from_id?: string;
    created_at?: string;
  } | null;
  automation_rules?: {
    id: string;
    keyword?: string;
    reply_message?: string;
  } | null;
};

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

const buttonStyle: React.CSSProperties = {
  padding: "14px 18px",
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
  border: "1px solid var(--border)",
};

const selectStyle: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  color: "var(--text)",
  padding: "12px 14px",
};

export function AutomationMonitorPanel() {
  const { activeProfileId, profile } = useActiveProfile();
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "sent" | "failed">(
    "all"
  );
  const [events, setEvents] = useState<AutomationEvent[]>([]);
  const [actions, setActions] = useState<AutomationAction[]>([]);

  const loadLogs = useCallback(async () => {
    if (!activeProfileId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/automation/logs?profileId=${encodeURIComponent(activeProfileId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar logs");
      }

      setEvents(data.events || []);
      setActions(data.actions || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      void loadLogs();
    } else {
      setEvents([]);
      setActions([]);
    }
  }, [activeProfileId, loadLogs]);

  async function retryAction(actionId: string) {
    if (!activeProfileId) {
      setError("Ative um perfil antes de reprocessar.");
      return;
    }

    setRetryingId(actionId);
    setError(null);

    try {
      const response = await fetch("/api/automation/actions/retry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId,
          profileId: activeProfileId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reprocessar acao");
      }

      await loadLogs();
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Erro inesperado.");
    } finally {
      setRetryingId(null);
    }
  }

  const filteredActions = useMemo(() => {
    if (filter === "all") {
      return actions;
    }

    return actions.filter((action) => action.status === filter);
  }, [actions, filter]);

  return (
    <div style={shellStyle}>
      {!profile ? (
        <EmptyState
          title="Nenhum perfil ativo"
          description="Ative um perfil para acompanhar eventos, respostas enviadas e falhas."
          ctaLabel="Ir para onboarding"
          ctaHref="/onboarding"
        />
      ) : (
        <>
          <section style={cardStyle}>
            <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
              <p style={{ margin: 0, color: "var(--muted)" }}>Monitor operacional</p>
              <strong>Acompanhe eventos, respostas enviadas e falhas de automacao.</strong>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={loadLogs} disabled={loading} style={buttonStyle}>
                {loading ? "Atualizando..." : "Atualizar logs"}
              </button>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as "all" | "pending" | "sent" | "failed"
                  )
                }
                style={selectStyle}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="sent">Enviados</option>
                <option value="failed">Falhados</option>
              </select>
            </div>

            {error ? <FeedbackBanner message={error} tone="error" /> : null}
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Eventos recebidos</h2>

            {loading && events.length === 0 ? (
              <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
            ) : events.length === 0 ? (
              <p style={{ margin: 0 }}>Nenhum evento recebido ainda.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {events.map((event) => (
                  <article
                    key={event.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 18,
                      padding: 16,
                      background: "var(--surface-soft)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <StatusBadge tone="accent">{event.event_type}</StatusBadge>
                      <StatusBadge tone={event.matched_rule_id ? "success" : "neutral"}>
                        {event.matched_rule_id ? "Regra encontrada" : "Sem regra"}
                      </StatusBadge>
                    </div>
                    <p><strong>Tipo:</strong> {event.event_type}</p>
                    <p><strong>Comentario:</strong> {event.comment_text || "-"}</p>
                    <p><strong>Comment ID:</strong> {event.external_comment_id || "-"}</p>
                    <p><strong>From ID:</strong> {event.external_from_id || "-"}</p>
                    <p><strong>Regra casada:</strong> {event.matched_rule_id ? "Sim" : "Nao"}</p>
                    <p style={{ marginBottom: 0 }}><strong>Recebido em:</strong> {event.created_at}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Acoes automaticas</h2>

            {loading && filteredActions.length === 0 ? (
              <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
            ) : filteredActions.length === 0 ? (
              <p style={{ margin: 0 }}>Nenhuma acao encontrada para esse filtro.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {filteredActions.map((action) => (
                  <article
                    key={action.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 18,
                      padding: 16,
                      background: "var(--surface-soft)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <StatusBadge
                        tone={
                          action.status === "sent"
                            ? "success"
                            : action.status === "failed"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {action.status}
                      </StatusBadge>
                      <StatusBadge tone="accent">{action.action_type}</StatusBadge>
                    </div>
                    <p><strong>Status:</strong> {action.status}</p>
                    <p><strong>Tipo:</strong> {action.action_type}</p>
                    <p><strong>Keyword:</strong> {action.automation_rules?.keyword || "-"}</p>
                    <p><strong>Comentario:</strong> {action.automation_events?.comment_text || "-"}</p>
                    <p><strong>Tentativas:</strong> {action.retry_count || 0}</p>
                    <p><strong>Criada em:</strong> {action.created_at}</p>

                    {action.error_message ? (
                      <p><strong>Erro:</strong> {action.error_message}</p>
                    ) : null}

                    {action.status === "failed" ? (
                      <button
                        type="button"
                        onClick={() => retryAction(action.id)}
                        disabled={retryingId === action.id}
                        style={secondaryButtonStyle}
                      >
                        {retryingId === action.id ? "Reprocessando..." : "Reprocessar"}
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
