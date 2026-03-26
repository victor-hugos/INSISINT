"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  fetchDashboard,
  fetchReminderProgress,
} from "@/lib/services/dashboard-service";
import { UICard } from "@/components/ui/ui-card";
import type { DashboardData, ProgressData } from "@/types/dashboard";

const shellStyle: React.CSSProperties = {
  maxWidth: 1200,
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

const metricGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};

const metricCardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid var(--border)",
  padding: 16,
  background: "rgba(255,255,255,0.72)",
};

const sectionGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 18,
};

const panelStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid var(--border)",
  padding: 18,
  background: "rgba(255,255,255,0.68)",
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function DashboardPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const { activeProfileId, profile } = useActiveProfile();

  const loadDashboard = useCallback(async () => {
    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de carregar o dashboard.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setProgress(null);

    try {
      const [responseData, progressData] = await Promise.all([
        fetchDashboard(activeProfileId),
        fetchReminderProgress(activeProfileId),
      ]);

      setProgress(progressData);
      setData(responseData);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, profile]);

  useEffect(() => {
    if (activeProfileId && profile) {
      void loadDashboard();
      return;
    }

    setData(null);
    setProgress(null);
    setError(null);
  }, [activeProfileId, loadDashboard, profile]);

  const metrics = data
    ? [
        { label: "Ideias", value: data.ideas.length },
        { label: "Roteiros", value: data.scripts.length },
        { label: "Calendario", value: data.calendar.length },
        { label: "Lembretes", value: data.reminders.length },
      ]
    : [];

  const approvedIdeasCount = data?.ideasSummary
    ? data.ideasSummary.filter((item) => item.status === "approved").length
    : 0;

  const sentAutomationCount = data?.automation
    ? data.automation.filter((item) => item.status === "sent").length
    : 0;

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para ver o dashboard consolidado da operacao."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>Sincronizacao</p>
            <strong>Atualize o painel para refletir a operacao mais recente.</strong>
          </div>
          <button onClick={loadDashboard} disabled={loading} style={buttonStyle}>
            {loading ? "Carregando..." : "Atualizar dashboard"}
          </button>
        </div>
        {error ? <FeedbackBanner message={error} tone="error" /> : null}
      </section>

      {loading ? (
        <section
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <div className="skeleton" style={{ height: 180, borderRadius: 24 }} />
          <div className="skeleton" style={{ height: 260, borderRadius: 24 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 24 }} />
        </section>
      ) : null}

      {data ? (
        <>
          <UICard title="Proxima acao recomendada">
            <p style={{ margin: 0 }}>
              Se voce ainda nao selecionou as ideias da semana, va para o plano
              semanal e escolha o que realmente quer executar agora.
            </p>
            <Link href="/weekly-plan">Ir para plano semanal</Link>
          </UICard>

          {progress ? (
            <UICard title="Progresso da semana">
              <div style={metricGridStyle}>
                <article style={metricCardStyle}>
                  <p style={{ margin: 0, color: "var(--muted)" }}>Semana</p>
                  <strong>{progress.weekKey}</strong>
                </article>
                <article style={metricCardStyle}>
                  <p style={{ margin: 0, color: "var(--muted)" }}>Total</p>
                  <strong>{progress.total}</strong>
                </article>
                <article style={metricCardStyle}>
                  <p style={{ margin: 0, color: "var(--muted)" }}>Concluidos</p>
                  <strong>{progress.completed}</strong>
                </article>
                <article style={metricCardStyle}>
                  <p style={{ margin: 0, color: "var(--muted)" }}>Execucao</p>
                  <strong>{progress.percentage}%</strong>
                </article>
              </div>
            </UICard>
          ) : null}

          <section style={cardStyle}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--accent-strong)",
                    fontWeight: 700,
                  }}
                >
                  Visao geral
                </p>
                <h2 style={{ margin: "8px 0 0" }}>
                  {data.profile?.niche || "Perfil nao encontrado"}
                </h2>
              </div>
              <div style={{ color: "var(--muted)" }}>
                <p style={{ margin: 0 }}>
                  <strong>Objetivo:</strong> {data.profile?.goal || "-"}
                </p>
                <p style={{ margin: "6px 0 0" }}>
                  <strong>Frequencia:</strong>{" "}
                  {data.profile?.posting_frequency || "-"}
                </p>
              </div>
            </div>

            <div style={metricGridStyle}>
              {metrics.map((metric) => (
                <article key={metric.label} style={metricCardStyle}>
                  <p style={{ margin: 0, color: "var(--muted)" }}>
                    {metric.label}
                  </p>
                  <strong style={{ fontSize: "1.9rem" }}>{metric.value}</strong>
                </article>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <StatusBadge tone="success">{approvedIdeasCount} ideias aprovadas</StatusBadge>
              <StatusBadge tone="accent">{sentAutomationCount} automacoes enviadas</StatusBadge>
            </div>
          </section>

          <div style={sectionGridStyle}>
            <UICard title="Resumo rapido">
              <p>
                <strong>Ideias aprovadas:</strong>{" "}
                {data.ideasSummary
                  ? data.ideasSummary.filter((item) => item.status === "approved").length
                  : 0}
              </p>
              <p>
                <strong>Execucao dos lembretes:</strong>{" "}
                {data.reminders.length > 0
                  ? `${Math.round(
                      (data.reminders.filter((item) => item.status === "completed")
                        .length /
                        data.reminders.length) *
                        100
                    )}%`
                  : "0%"}
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>Automacoes enviadas:</strong>{" "}
                {data.automation
                  ? data.automation.filter((item) => item.status === "sent").length
                  : 0}
              </p>
            </UICard>

            <UICard title="Resumo de automacoes">
              {data.automation && data.automation.length > 0 ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <p>
                    <strong>Pendentes:</strong>{" "}
                    {data.automation.filter((item) => item.status === "pending").length}
                  </p>
                  <p>
                    <strong>Enviadas:</strong>{" "}
                    {data.automation.filter((item) => item.status === "sent").length}
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Falhadas:</strong>{" "}
                    {data.automation.filter((item) => item.status === "failed").length}
                  </p>
                </div>
              ) : (
                <p>Nenhuma automacao processada ainda.</p>
              )}
            </UICard>

            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Perfil</h3>
              {data.profile ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <p>
                    <strong>Nicho:</strong> {data.profile.niche}
                  </p>
                  <p>
                    <strong>Publico:</strong> {data.profile.target_audience}
                  </p>
                  <p>
                    <strong>Tom:</strong> {data.profile.tone}
                  </p>
                  <p>
                    <strong>Produtos:</strong>{" "}
                    {data.profile.products_services || "-"}
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Concorrentes:</strong>{" "}
                    {data.profile.competitors || "-"}
                  </p>
                </div>
              ) : (
                <p>Perfil nao encontrado.</p>
              )}
            </section>

            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Ultimo diagnostico</h3>
              {data.diagnosis?.result ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <p style={{ margin: 0 }}>
                    {data.diagnosis.result.summary || "Sem resumo."}
                  </p>
                  <div>
                    <strong>Pilares</strong>
                    <ul style={{ marginBottom: 0 }}>
                      {(data.diagnosis.result.pillars || []).map((pillar) => (
                        <li key={pillar}>{pillar}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p>Nenhum diagnostico encontrado.</p>
              )}
            </section>
          </div>

          <div style={sectionGridStyle}>
            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Ultimas ideias</h3>
              {data.ideas.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {data.ideas.map((idea) => (
                    <article key={idea.id} style={metricCardStyle}>
                      <h4 style={{ marginTop: 0, marginBottom: 8 }}>{idea.title}</h4>
                      <p>
                        <strong>Categoria:</strong> {idea.category}
                      </p>
                      <p>
                        <strong>Hook:</strong> {idea.hook}
                      </p>
                      <p style={{ marginBottom: 0 }}>{idea.description}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Nenhuma ideia encontrada.</p>
              )}
            </section>

            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Ultimos roteiros</h3>
              {data.scripts.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {data.scripts.map((script) => (
                    <article key={script.id} style={metricCardStyle}>
                      <h4 style={{ marginTop: 0, marginBottom: 8 }}>
                        {script.idea_title}
                      </h4>
                      <p>
                        <strong>Categoria:</strong> {script.category}
                      </p>
                      <p>
                        <strong>Hook:</strong> {script.hook}
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        <strong>CTA:</strong> {script.cta}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Nenhum roteiro encontrado.</p>
              )}
            </section>
          </div>

          <div style={sectionGridStyle}>
            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Calendario</h3>
              {data.calendar.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {data.calendar.map((item) => (
                    <article key={item.id} style={metricCardStyle}>
                      <StatusBadge tone="accent">{item.content_type}</StatusBadge>
                      <h4 style={{ marginTop: 0, marginBottom: 8 }}>
                        {item.day_of_week} - {item.title}
                      </h4>
                      <p>
                        <strong>Formato:</strong> {item.content_type}
                      </p>
                      <p>
                        <strong>Ideia de origem:</strong>{" "}
                        {item.source_idea_title || "Sem ideia associada"}
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        <strong>Objetivo:</strong> {item.objective}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Nenhum item no calendario.</p>
              )}
            </section>

            <section style={panelStyle}>
              <h3 style={{ marginTop: 0 }}>Proximos lembretes</h3>
              {data.reminders.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {data.reminders.map((reminder) => (
                    <article key={reminder.id} style={metricCardStyle}>
                      <StatusBadge
                        tone={
                          reminder.status === "completed" ? "success" : "warning"
                        }
                      >
                        {reminder.status}
                      </StatusBadge>
                      <h4 style={{ marginTop: 0, marginBottom: 8 }}>
                        {reminder.title}
                      </h4>
                      <p>
                        <strong>Tipo:</strong> {reminder.reminder_type}
                      </p>
                      <p>
                        <strong>Quando:</strong>{" "}
                        {formatDate(reminder.scheduled_for)}
                      </p>
                      <p>
                        <strong>Origem:</strong>{" "}
                        {reminder.calendar_item_id ? "Calendario" : "Manual"}
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        <strong>Status:</strong> {reminder.status}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Nenhum lembrete encontrado.</p>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
    )
  );
}
