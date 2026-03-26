"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gap: 16,
          padding: 24,
          borderRadius: 24,
          border: "1px solid var(--border)",
          background: "var(--bg-panel)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div
          className="skeleton"
          style={{ height: 16, width: 120, borderRadius: 999 }}
        />
        <div
          className="skeleton"
          style={{ height: 28, width: "58%", borderRadius: 999 }}
        />
        <div
          className="skeleton"
          style={{ height: 86, width: "100%", borderRadius: 20 }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Voce precisa entrar para usar esta area"
        description="Acesse sua conta para salvar perfis, gerar conteudo e acompanhar a operacao."
        ctaLabel="Ir para login"
        ctaHref="/login"
      />
    );
  }

  return <>{children}</>;
}
