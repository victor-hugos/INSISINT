"use client";

import { useCallback, useEffect, useState } from "react";

import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";

type Rule = {
  id: string;
  keyword: string;
  reply_message: string;
  is_active: boolean;
};

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

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.8)",
  padding: "14px 16px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "var(--muted)",
  fontSize: "0.95rem",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

export function AutomationPanel() {
  const { activeProfileId, profile } = useActiveProfile();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    keyword: "",
    replyMessage: "",
  });

  const loadRules = useCallback(async () => {
    if (!activeProfileId) {
      return;
    }

    setError(null);

    const response = await fetch(
      `/api/automation/rules?profileId=${encodeURIComponent(activeProfileId)}`
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erro ao carregar regras");
      return;
    }

    setRules(data.rules || []);
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      void loadRules();
    } else {
      setRules([]);
    }
  }, [activeProfileId, loadRules]);

  async function saveRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de criar regra.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/automation/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfileId,
          keyword: form.keyword,
          replyMessage: form.replyMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar regra");
      }

      setForm({ keyword: "", replyMessage: "" });
      await loadRules();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil antes de configurar regras de automacao."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={saveRule} style={cardStyle}>
        <label style={labelStyle}>
          Palavra-chave
          <input
            placeholder="Ex.: ebook"
            value={form.keyword}
            onChange={(event) =>
              setForm((current) => ({ ...current, keyword: event.target.value }))
            }
            style={fieldStyle}
          />
        </label>

        <label style={{ ...labelStyle, marginTop: 14 }}>
          Mensagem privada automatica
          <textarea
            rows={4}
            placeholder="Ex.: Te mandei os detalhes no privado."
            value={form.replyMessage}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                replyMessage: event.target.value,
              }))
            }
            style={{ ...fieldStyle, resize: "vertical" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ ...primaryButtonStyle, marginTop: 18 }}
        >
          {loading ? "Salvando..." : "Criar regra de comentario"}
        </button>

        {error ? <p style={{ color: "#8a2f12", marginTop: 16 }}>{error}</p> : null}
      </form>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Regras ativas</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {rules.length === 0 ? (
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Nenhuma regra criada ainda.
            </p>
          ) : (
            rules.map((rule) => (
              <article
                key={rule.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <p>
                  <strong>Palavra-chave:</strong> {rule.keyword}
                </p>
                <p>
                  <strong>Mensagem:</strong> {rule.reply_message}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Ativa:</strong> {rule.is_active ? "Sim" : "Nao"}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
    )
  );
}
