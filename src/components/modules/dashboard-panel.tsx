"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { fetchDashboard, fetchReminderProgress } from "@/lib/services/dashboard-service";
import type { DashboardData, ProgressData } from "@/types/dashboard";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        display: "grid",
        gap: 4,
      }}
    >
      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--subtle)" }}>{sub}</p>}
    </div>
  );
}

function WeekProgress({ progress }: { progress: ProgressData }) {
  const pct = Math.min(progress.percentage, 100);
  const color = pct >= 80 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--accent)";

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-md)",
        background: "var(--bg-card)",
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "1rem" }}>Execução da semana</p>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>Semana {progress.weekKey}</p>
        </div>
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color,
            lineHeight: 1,
          }}
        >
          {pct}%
        </span>
      </div>

      {/* Barra de progresso */}
      <div style={{ height: 8, borderRadius: 99, background: "var(--border-md)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            background: color,
            transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 0 10px ${color}55`,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          <strong style={{ color: "var(--text)" }}>{progress.completed}</strong> concluídos
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          <strong style={{ color: "var(--text)" }}>{progress.total - progress.completed}</strong> pendentes
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          Total: <strong style={{ color: "var(--text)" }}>{progress.total}</strong>
        </span>
      </div>
    </div>
  );
}

function QuickActions() {
  const links = [
    { href: "/ideas", label: "Gerar ideias", icon: "◈" },
    { href: "/weekly-plan", label: "Plano semanal", icon: "◉" },
    { href: "/calendar", label: "Calendário", icon: "◆" },
    { href: "/reminders", label: "Lembretes", icon: "◇" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            padding: "16px 12px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            background: "var(--bg-elevated)",
            transition: "border-color 140ms, background 140ms",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "1.2rem", color: "var(--accent-strong)" }}>{l.icon}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)" }}>{l.label}</span>
        </Link>
      ))}
    </div>
  );
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
    if (activeProfileId && profile) { void loadDashboard(); return; }
    setData(null); setProgress(null); setError(null);
  }, [activeProfileId, loadDashboard, profile]);

  if (!profile) {
    return (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Configure seu perfil para ver o dashboard da operação."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    );
  }

  const approvedIdeas = data?.ideasSummary?.filter((i) => i.status === "approved").length ?? 0;
  const completedReminders = data?.reminders.filter((r) => r.status === "completed").length ?? 0;
  const totalReminders = data?.reminders.length ?? 0;
  const sentAutomations = data?.automation?.filter((a) => a.status === "sent").length ?? 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>

      {/* ── Hero do perfil ── */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-md)",
          background: "var(--bg-card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "grid", gap: 2 }}>
          <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-strong)" }}>
            Perfil ativo
          </p>
          <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {profile.niche ?? "Meu perfil"}
          </h1>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
            {profile.goal ?? "—"} · {profile.posting_frequency ?? "—"}
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="btn btn-secondary"
          style={{ fontSize: "0.85rem", padding: "9px 16px" }}
        >
          {loading ? "Carregando…" : "↻ Atualizar"}
        </button>
      </div>

      {error && <FeedbackBanner message={error} tone="error" />}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: "grid", gap: 14 }}>
          <div className="skeleton" style={{ height: 120, borderRadius: "var(--radius-xl)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {[1,2,3,4].map((n) => <div key={n} className="skeleton" style={{ height: 88, borderRadius: "var(--radius-lg)" }} />)}
          </div>
          <div className="skeleton" style={{ height: 200, borderRadius: "var(--radius-xl)" }} />
        </div>
      )}

      {data && (
        <>
          {/* ── Progresso semanal ── */}
          {progress && <WeekProgress progress={progress} />}

          {/* ── Métricas ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            <MetricCard label="Ideias" value={data.ideas.length} />
            <MetricCard label="Aprovadas" value={approvedIdeas} />
            <MetricCard label="Roteiros" value={data.scripts.length} />
            <MetricCard
              label="Lembretes"
              value={`${completedReminders}/${totalReminders}`}
              sub={totalReminders > 0 ? `${Math.round((completedReminders / totalReminders) * 100)}% concluídos` : undefined}
            />
            <MetricCard label="Calendário" value={data.calendar.length} sub="itens" />
            <MetricCard label="Automações" value={sentAutomations} sub="enviadas" />
          </div>

          {/* ── Ações rápidas ── */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-md)",
              background: "var(--bg-card)",
              display: "grid",
              gap: 14,
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Ações rápidas</p>
            <QuickActions />
          </div>

          {/* ── Últimas ideias + roteiros ── */}
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

            <div
              style={{
                padding: "20px 22px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-md)",
                background: "var(--bg-card)",
                display: "grid",
                gap: 12,
                alignContent: "start",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Últimas ideias</p>
                <Link href="/ideas" style={{ fontSize: "0.78rem", color: "var(--accent-strong)" }}>Ver todas →</Link>
              </div>
              {data.ideas.length > 0 ? (
                <div style={{ display: "grid", gap: 8 }}>
                  {data.ideas.slice(0, 3).map((idea) => (
                    <div
                      key={idea.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--bg-elevated)",
                      }}
                    >
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.3 }}>{idea.title}</p>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>{idea.hook}</p>
                      <div style={{ marginTop: 6 }}>
                        <span className="badge badge-gray">{idea.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--subtle)" }}>Nenhuma ideia gerada ainda.</p>
              )}
            </div>

            <div
              style={{
                padding: "20px 22px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-md)",
                background: "var(--bg-card)",
                display: "grid",
                gap: 12,
                alignContent: "start",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Próximos lembretes</p>
                <Link href="/reminders" style={{ fontSize: "0.78rem", color: "var(--accent-strong)" }}>Ver todos →</Link>
              </div>
              {data.reminders.length > 0 ? (
                <div style={{ display: "grid", gap: 8 }}>
                  {data.reminders.slice(0, 4).map((reminder) => (
                    <div
                      key={reminder.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--bg-elevated)",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: reminder.status === "completed" ? "var(--success)" : "var(--warning)",
                          marginTop: 5,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.3 }}>{reminder.title}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--subtle)" }}>{formatDate(reminder.scheduled_for)}</p>
                      </div>
                      <StatusBadge tone={reminder.status === "completed" ? "success" : "warning"}>
                        {reminder.status === "completed" ? "Feito" : "Pendente"}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--subtle)" }}>Nenhum lembrete configurado.</p>
              )}
            </div>

          </div>

          {/* ── Diagnóstico ── */}
          {data.diagnosis?.result && (
            <div
              style={{
                padding: "20px 24px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-md)",
                background: "var(--bg-card)",
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Diagnóstico do perfil</p>
                <Link href="/onboarding" style={{ fontSize: "0.78rem", color: "var(--accent-strong)" }}>Atualizar →</Link>
              </div>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
                {data.diagnosis.result.summary}
              </p>
              {data.diagnosis.result.pillars && data.diagnosis.result.pillars.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {data.diagnosis.result.pillars.map((pillar) => (
                    <span key={pillar} className="badge badge-purple">{pillar}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Estado vazio (sem dados, sem loading, sem erro) */}
      {!loading && !data && !error && (
        <div
          style={{
            padding: "40px 24px",
            borderRadius: "var(--radius-xl)",
            border: "1px dashed var(--border-md)",
            textAlign: "center",
            display: "grid",
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700 }}>Carregue o dashboard</p>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted)" }}>
            Clique em "Atualizar" para buscar os dados mais recentes da sua operação.
          </p>
        </div>
      )}

    </div>
  );
}
