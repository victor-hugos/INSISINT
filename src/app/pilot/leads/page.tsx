"use client";

import { useEffect, useState } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { UICard } from "@/components/ui/ui-card";

type Lead = {
  id: string;
  name: string;
  instagram?: string | null;
  niche?: string | null;
  pain?: string | null;
  goal?: string | null;
  source?: string | null;
  notes?: string | null;
  status: "new" | "contacted" | "approved" | "converted" | "rejected";
  created_at: string;
  contacted_at?: string | null;
  approved_at?: string | null;
  converted_at?: string | null;
  rejected_at?: string | null;
};

const shellStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  display: "grid",
  gap: 16,
};

const leadCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: 16,
  borderRadius: 18,
  background: "rgba(255,255,255,0.7)",
  display: "grid",
  gap: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.82)",
  color: "var(--text)",
  fontWeight: 700,
  cursor: "pointer",
};

export default function PilotLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "contacted" | "approved" | "converted" | "rejected"
  >("all");

  useEffect(() => {
    void loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pilot/leads");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar leads");
      }

      setLeads(data.leads || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar leads");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    status: "contacted" | "approved" | "converted" | "rejected"
  ) {
    setError(null);

    try {
      const response = await fetch("/api/pilot/leads/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar lead");
      }

      await loadLeads();
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Erro ao atualizar lead"
      );
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const searchValue = query.trim().toLowerCase();

    if (!searchValue) {
      return matchesStatus;
    }

    const haystack = [
      lead.name,
      lead.instagram,
      lead.niche,
      lead.goal,
      lead.pain,
      lead.source,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && haystack.includes(searchValue);
  });

  return (
    <AuthGuard>
      <div style={shellStyle}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Leads do piloto</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Acompanhe quem aplicou, quem ja foi contatado e quem virou piloto.
          </p>
        </div>

        <UICard title="Pipeline simples">
          <p style={{ margin: 0 }}>
            `new` para novas aplicacoes, `contacted` para quem ja recebeu contato,
            `approved` para piloto liberado e `converted` para quem virou cliente.
          </p>
        </UICard>

        <UICard title="Filtro e busca">
          <div className="responsive-filter-grid">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, nicho, Instagram ou objetivo"
              style={{
                borderRadius: 14,
                border: "1px solid var(--border)",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.82)",
              }}
            />
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | "new"
                    | "contacted"
                    | "approved"
                    | "converted"
                    | "rejected"
                )
              }
              style={{
                borderRadius: 14,
                border: "1px solid var(--border)",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.82)",
              }}
            >
              <option value="all">Todos os status</option>
              <option value="new">Novo</option>
              <option value="contacted">Contatado</option>
              <option value="approved">Aprovado</option>
              <option value="converted">Convertido</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </UICard>

        {error ? (
          <FeedbackBanner message={error} tone="error" />
        ) : null}

        <UICard title="Interessados">
          {loading ? (
            <div className="skeleton" style={{ height: 240, borderRadius: 20 }} />
          ) : filteredLeads.length === 0 ? (
            <p style={{ margin: 0 }}>Nenhuma aplicacao recebida ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {filteredLeads.map((lead) => (
                <div key={lead.id} style={leadCardStyle}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <StatusBadge
                      tone={
                        lead.status === "converted"
                          ? "success"
                          : lead.status === "rejected"
                            ? "danger"
                            : lead.status === "approved"
                              ? "accent"
                              : lead.status === "contacted"
                                ? "warning"
                                : "neutral"
                      }
                    >
                      {lead.status}
                    </StatusBadge>
                    <StatusBadge tone="accent">{lead.source || "pilot_landing"}</StatusBadge>
                  </div>
                  <p><strong>Nome:</strong> {lead.name}</p>
                  <p><strong>Instagram:</strong> {lead.instagram || "-"}</p>
                  <p><strong>Nicho:</strong> {lead.niche || "-"}</p>
                  <p><strong>Dor:</strong> {lead.pain || "-"}</p>
                  <p><strong>Objetivo:</strong> {lead.goal || "-"}</p>
                  <p><strong>Recebido em:</strong> {lead.created_at}</p>
                  {lead.contacted_at ? (
                    <p><strong>Contatado em:</strong> {lead.contacted_at}</p>
                  ) : null}
                  {lead.approved_at ? (
                    <p><strong>Aprovado em:</strong> {lead.approved_at}</p>
                  ) : null}
                  {lead.converted_at ? (
                    <p><strong>Convertido em:</strong> {lead.converted_at}</p>
                  ) : null}
                  {lead.rejected_at ? (
                    <p><strong>Rejeitado em:</strong> {lead.rejected_at}</p>
                  ) : null}
                  {lead.notes ? (
                    <p><strong>Notas:</strong> {lead.notes}</p>
                  ) : null}

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => updateStatus(lead.id, "contacted")} style={buttonStyle}>
                      Contatado
                    </button>
                    <button type="button" onClick={() => updateStatus(lead.id, "approved")} style={buttonStyle}>
                      Aprovado
                    </button>
                    <button type="button" onClick={() => updateStatus(lead.id, "converted")} style={buttonStyle}>
                      Virou cliente
                    </button>
                    <button type="button" onClick={() => updateStatus(lead.id, "rejected")} style={buttonStyle}>
                      Rejeitado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </UICard>
      </div>
    </AuthGuard>
  );
}
