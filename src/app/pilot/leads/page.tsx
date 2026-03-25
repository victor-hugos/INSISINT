"use client";

import { useEffect, useState } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { UICard } from "@/components/ui-card";

type Lead = {
  id: string;
  name: string;
  instagram?: string | null;
  niche?: string | null;
  pain?: string | null;
  goal?: string | null;
  status: "new" | "contacted" | "approved" | "converted" | "rejected";
  created_at: string;
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

        {error ? (
          <UICard title="Erro">
            <p style={{ margin: 0, color: "#8a2f12" }}>{error}</p>
          </UICard>
        ) : null}

        <UICard title="Interessados">
          {loading ? (
            <p style={{ margin: 0 }}>Carregando leads...</p>
          ) : leads.length === 0 ? (
            <p style={{ margin: 0 }}>Nenhuma aplicacao recebida ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {leads.map((lead) => (
                <div key={lead.id} style={leadCardStyle}>
                  <p><strong>Nome:</strong> {lead.name}</p>
                  <p><strong>Instagram:</strong> {lead.instagram || "-"}</p>
                  <p><strong>Nicho:</strong> {lead.niche || "-"}</p>
                  <p><strong>Dor:</strong> {lead.pain || "-"}</p>
                  <p><strong>Objetivo:</strong> {lead.goal || "-"}</p>
                  <p><strong>Status:</strong> {lead.status}</p>
                  <p><strong>Recebido em:</strong> {lead.created_at}</p>

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
