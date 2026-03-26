"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";

const boxStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 14,
  borderRadius: 18,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.75)",
};

const linkStyle: React.CSSProperties = {
  padding: "11px 13px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  fontWeight: 700,
  textAlign: "center",
  background: "rgba(255,255,255,0.88)",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

export function SessionBox() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div style={boxStyle}>
        <div
          className="skeleton"
          style={{ height: 14, width: "45%", borderRadius: 999 }}
        />
        <div
          className="skeleton"
          style={{ height: 18, width: "80%", borderRadius: 999 }}
        />
        <div
          className="skeleton"
          style={{ height: 42, width: "100%", borderRadius: 14 }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={boxStyle}>
        <p
          style={{
            margin: 0,
            color: "var(--accent-strong)",
            fontSize: "0.78rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Conta
        </p>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Entre para salvar perfis e separar seus dados por conta.
        </p>
        <Link href="/login" style={linkStyle}>
          Entrar
        </Link>
        <Link href="/signup" style={linkStyle}>
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div style={boxStyle}>
      <div style={{ display: "grid", gap: 4 }}>
        <p
          style={{
            margin: 0,
            color: "var(--accent-strong)",
            fontSize: "0.78rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Sessao ativa
        </p>
        <p style={{ margin: 0, fontWeight: 700, wordBreak: "break-word" }}>
          {user.email ?? user.id}
        </p>
      </div>

      <button type="button" onClick={() => void signOut()} style={buttonStyle}>
        Sair
      </button>
    </div>
  );
}
