"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  instagram: string;
  niche: string;
  pain: string;
  goal: string;
};

export default function PilotApplyPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    instagram: "",
    niche: "",
    pain: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pilot/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, feedback: "sim", source: "pilot_landing" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar. Tente novamente.");
        return;
      }

      setSent(true);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Sucesso ── */
  if (sent) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "40px 24px",
          display: "grid",
          gap: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2">
            <path d="M3 8l4 4 6-6"/>
          </svg>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Aplicação recebida!</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, fontSize: "0.92rem" }}>
            Enviamos uma confirmação para <strong style={{ color: "var(--text)" }}>{form.email}</strong>.
            Entraremos em contato em até 48 horas para liberar seu acesso ao piloto.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary" style={{ padding: "12px 20px" }}>
            Criar conta agora →
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ padding: "12px 20px" }}>
            Voltar para a home
          </Link>
        </div>
      </div>
    );
  }

  /* ── Formulário ── */
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", display: "grid", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "grid", gap: 6 }}>
        <Link href="/pilot" style={{ fontSize: "0.82rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
          ← Voltar
        </Link>
        <h1 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
          Aplicar para o piloto
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
          14 dias gratuitos com acompanhamento 1:1 na primeira semana.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 14,
          padding: 28,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-md)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Nome + Email */}
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Nome *</label>
            <input
              className="input"
              required
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>E-mail *</label>
            <input
              className="input"
              type="email"
              required
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>

        {/* Instagram + Nicho */}
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Instagram</label>
            <input
              className="input"
              placeholder="@seuperfil"
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Nicho *</label>
            <input
              className="input"
              required
              placeholder="Ex.: nutrição, marketing, finanças"
              value={form.niche}
              onChange={(e) => set("niche", e.target.value)}
            />
          </div>
        </div>

        {/* Dor */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>O que mais te trava hoje no conteúdo? *</label>
          <textarea
            className="input"
            required
            rows={3}
            placeholder="Ex.: não sei o que postar, não tenho consistência, perco muito tempo planejando..."
            value={form.pain}
            onChange={(e) => set("pain", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Objetivo */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Objetivo principal *</label>
          <select
            className="input"
            required
            value={form.goal}
            onChange={(e) => set("goal", e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="crescer seguidores">Crescer seguidores</option>
            <option value="gerar leads">Gerar leads</option>
            <option value="vender produto ou serviço">Vender produto ou serviço</option>
            <option value="organizar a produção de conteúdo">Organizar a produção de conteúdo</option>
          </select>
        </div>

        {/* Erro */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              fontSize: "0.85rem",
              color: "var(--danger)",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: "12px 16px", fontSize: "0.95rem", justifyContent: "center", marginTop: 4 }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              Enviando…
            </span>
          ) : "Enviar aplicação →"}
        </button>

        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--subtle)", textAlign: "center" }}>
          Sem cartão de crédito. Analisamos em até 48 horas.
        </p>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
