"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ margin: 0 }}>Carregando...</p>;
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
