"use client";

import { useState } from "react";

const shellStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  display: "grid",
  gap: 20,
};

const cardStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 24,
  borderRadius: 24,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.82)",
  padding: "14px 16px",
  outline: "none",
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

export default function PilotApplyPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    instagram: "",
    niche: "",
    pain: "",
    frequency: "",
    goal: "",
    feedback: "sim",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/pilot/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar");
      }

      setSent(true);
    } catch {
      setError("Erro ao enviar aplicacao.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div style={shellStyle}>
        <section style={cardStyle}>
          <h1 style={{ margin: 0 }}>Aplicacao enviada</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Recebemos suas informacoes. Agora e so seguir para a analise do piloto.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Aplicar para o piloto</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Responda rapidamente para eu entender se este piloto faz sentido para
          o seu momento.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <input
          placeholder="Seu nome"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="@instagram"
          value={form.instagram}
          onChange={(event) => setForm({ ...form, instagram: event.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Seu nicho"
          value={form.niche}
          onChange={(event) => setForm({ ...form, niche: event.target.value })}
          style={inputStyle}
        />

        <textarea
          rows={4}
          placeholder="O que mais te trava hoje no conteudo?"
          value={form.pain}
          onChange={(event) => setForm({ ...form, pain: event.target.value })}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <input
          placeholder="Quantas vezes voce posta por semana?"
          value={form.frequency}
          onChange={(event) => setForm({ ...form, frequency: event.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Seu objetivo principal: crescer, vender ou organizar?"
          value={form.goal}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
          style={inputStyle}
        />

        <select
          value={form.feedback}
          onChange={(event) => setForm({ ...form, feedback: event.target.value })}
          style={inputStyle}
        >
          <option value="sim">Aceito dar feedback durante o piloto</option>
          <option value="nao">Prefiro usar sem acompanhamento</option>
        </select>

        <button type="submit" style={buttonStyle} disabled={sending}>
          {sending ? "Enviando..." : "Enviar aplicacao"}
        </button>

        {error ? <p style={{ margin: 0, color: "#8a2f12" }}>{error}</p> : null}
      </form>
    </div>
  );
}
