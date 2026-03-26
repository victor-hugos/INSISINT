"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchDashboard, fetchReminderProgress } from "@/lib/services/dashboard-service";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import type { DashboardData, ProgressData } from "@/types/dashboard";

const shellStyle: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gap: 20,
};

const heroStyle: React.CSSProperties = {
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow)",
  display: "grid",
  gap: 18,
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const statCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 18,
  background: "var(--surface-soft)",
  display: "grid",
  gap: 8,
};

const splitGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 16,
};

const panelStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 22,
  padding: 20,
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow-soft)",
  display: "grid",
  gap: 14,
};

const tagWrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

function toTags(...values: Array<string | null | undefined>) {
  const normalized = values
    .flatMap((value) => (value || "").split(/[\s,;/]+/))
    .map((item) =>
      item
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
    )
    .filter((item) => item.length >= 4);

  return Array.from(new Set(normalized)).slice(0, 10);
}

export function ProfilePanel() {
  const { activeProfileId, profile } = useActiveProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  const loadProfileView = useCallback(async () => {
    if (!activeProfileId || !profile) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [dashboardData, reminderProgress] = await Promise.all([
        fetchDashboard(activeProfileId),
        fetchReminderProgress(activeProfileId),
      ]);

      setData(dashboardData);
      setProgress(reminderProgress);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, profile]);

  useEffect(() => {
    if (activeProfileId && profile) {
      void loadProfileView();
      return;
    }

    setData(null);
    setProgress(null);
    setError(null);
  }, [activeProfileId, loadProfileView, profile]);

  const approvedIdeas = data?.ideasSummary?.filter((item) => item.status === "approved").length ?? 0;
  const completedReminders =
    data?.reminders.filter((item) => item.status === "completed").length ?? 0;
  const competitorsCount = data?.profile?.competitors
    ? data.profile.competitors.split(",").map((item) => item.trim()).filter(Boolean).length
    : 0;

  const strategicTags = useMemo(
    () =>
      toTags(
        data?.profile?.niche,
        data?.profile?.target_audience,
        data?.profile?.goal,
        data?.profile?.tone
      ),
    [data]
  );

  if (!profile) {
    return (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para ver a leitura consolidada do posicionamento e do diagnóstico."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    );
  }

  if (loading && !data) {
    return (
      <div style={shellStyle}>
        <div className="skeleton" style={{ height: 220, borderRadius: 28 }} />
        <div className="skeleton" style={{ height: 240, borderRadius: 24 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 24 }} />
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <section style={heroStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <StatusBadge tone="accent">Perfil ativo</StatusBadge>
              <StatusBadge tone="neutral">{data?.profile?.posting_frequency || profile.posting_frequency}</StatusBadge>
            </div>
            <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {data?.profile?.niche || profile.niche}
            </h2>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 760 }}>
              {data?.diagnosis?.result.summary ||
                "Veja a leitura estratégica do seu perfil com base no onboarding, diagnóstico e execução atual."}
            </p>
          </div>

          <button
            type="button"
            onClick={loadProfileView}
            style={{
              padding: "14px 18px",
              borderRadius: 16,
              border: "none",
              background: "var(--accent)",
              color: "#f8f5ff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Atualizar análise
          </button>
        </div>

        {error ? <FeedbackBanner message={error} tone="error" /> : null}

        <div style={statsGridStyle}>
          <article style={statCardStyle}>
            <span style={{ color: "var(--muted)" }}>Ideias aprovadas</span>
            <strong style={{ fontSize: "1.8rem" }}>{approvedIdeas}</strong>
            <span style={{ color: "var(--muted)" }}>Validadas para o perfil</span>
          </article>
          <article style={statCardStyle}>
            <span style={{ color: "var(--muted)" }}>Execução semanal</span>
            <strong style={{ fontSize: "1.8rem" }}>{progress?.percentage ?? 0}%</strong>
            <span style={{ color: "var(--muted)" }}>{completedReminders} lembrete(s) concluído(s)</span>
          </article>
          <article style={statCardStyle}>
            <span style={{ color: "var(--muted)" }}>Roteiros gerados</span>
            <strong style={{ fontSize: "1.8rem" }}>{data?.scripts.length ?? 0}</strong>
            <span style={{ color: "var(--muted)" }}>Base criativa do perfil</span>
          </article>
          <article style={statCardStyle}>
            <span style={{ color: "var(--muted)" }}>Referências mapeadas</span>
            <strong style={{ fontSize: "1.8rem" }}>{competitorsCount}</strong>
            <span style={{ color: "var(--muted)" }}>Concorrentes ou benchmarks</span>
          </article>
        </div>
      </section>

      <div className="marketing-split-grid" style={splitGridStyle}>
        <section style={panelStyle}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Identidade do perfil
            </p>
            <h3 style={{ margin: 0 }}>Base estratégica</h3>
          </div>

          <div style={statsGridStyle}>
            <article style={statCardStyle}>
              <span style={{ color: "var(--muted)" }}>Público</span>
              <strong>{data?.profile?.target_audience || profile.target_audience}</strong>
            </article>
            <article style={statCardStyle}>
              <span style={{ color: "var(--muted)" }}>Objetivo</span>
              <strong>{data?.profile?.goal || profile.goal}</strong>
            </article>
            <article style={statCardStyle}>
              <span style={{ color: "var(--muted)" }}>Tom</span>
              <strong>{data?.profile?.tone || profile.tone}</strong>
            </article>
            <article style={statCardStyle}>
              <span style={{ color: "var(--muted)" }}>Frequência</span>
              <strong>{data?.profile?.posting_frequency || profile.posting_frequency}</strong>
            </article>
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Tags estratégicas
            </p>
            <h3 style={{ margin: 0 }}>Leitura rápida do posicionamento</h3>
          </div>

          <div style={tagWrapStyle}>
            {strategicTags.length > 0 ? (
              strategicTags.map((tag) => (
                <StatusBadge key={tag} tone="accent">
                  #{tag}
                </StatusBadge>
              ))
            ) : (
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Complete o onboarding para gerar mais sinais estratégicos do perfil.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="marketing-split-grid" style={splitGridStyle}>
        <section style={panelStyle}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Pontos fortes
            </p>
            <h3 style={{ margin: 0 }}>O que mais sustenta o perfil hoje</h3>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {(data?.diagnosis?.result.strengths || []).length > 0 ? (
              data?.diagnosis?.result.strengths?.map((item) => (
                <article key={item} style={statCardStyle}>
                  <p style={{ margin: 0 }}>{item}</p>
                </article>
              ))
            ) : (
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Ainda não há pontos fortes registrados no diagnóstico.
              </p>
            )}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Oportunidades
            </p>
            <h3 style={{ margin: 0 }}>Onde o perfil pode crescer mais</h3>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {(data?.diagnosis?.result.opportunities || []).length > 0 ? (
              data?.diagnosis?.result.opportunities?.map((item) => (
                <article key={item} style={statCardStyle}>
                  <p style={{ margin: 0 }}>{item}</p>
                </article>
              ))
            ) : (
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Gere ou atualize o diagnóstico para ver oportunidades estratégicas.
              </p>
            )}
          </div>
        </section>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "grid", gap: 6 }}>
          <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
            Conteúdo recomendado
          </p>
          <h3 style={{ margin: 0 }}>Pilares que mais combinam com esse perfil</h3>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {(data?.diagnosis?.result.pillars || []).length > 0 ? (
            data?.diagnosis?.result.pillars?.map((pillar) => (
              <article key={pillar} style={statCardStyle}>
                <p style={{ margin: 0 }}>{pillar}</p>
              </article>
            ))
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Nenhum pilar foi gerado ainda para este perfil.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
