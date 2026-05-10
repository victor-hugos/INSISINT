"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

export function SessionBox() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <div className="skeleton" style={{ height: 32, borderRadius: "var(--radius-md)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <Link href="/login" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "9px 14px" }}>
          Entrar
        </Link>
        <Link href="/signup" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "9px 14px" }}>
          Criar conta
        </Link>
      </div>
    );
  }

  const initial = (user.email ?? "U")[0].toUpperCase();
  const emailShort = user.email
    ? user.email.length > 22
      ? user.email.slice(0, 20) + "…"
      : user.email
    : user.id.slice(0, 12) + "…";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--accent-soft)",
          border: "1px solid rgba(124,58,237,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.85rem",
          color: "var(--accent-strong)",
          flexShrink: 0,
        }}
      >
        {initial}
      </div>

      {/* Email */}
      <span
        style={{
          flex: 1,
          fontSize: "0.78rem",
          color: "var(--muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {emailShort}
      </span>

      {/* Botão sair */}
      <button
        type="button"
        onClick={() => void signOut()}
        title="Sair"
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 140ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--subtle)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 8H3M6 5l-3 3 3 3"/>
          <path d="M10 3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3"/>
        </svg>
      </button>
    </div>
  );
}
