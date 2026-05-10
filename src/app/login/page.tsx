"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tryCreateSupabaseBrowserClient } from "@/lib/db/supabase-browser";

export default function LoginPage() {
  const supabase = useMemo(() => tryCreateSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setError("Supabase não está configurado. Verifique as variáveis de ambiente.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, display: "grid", gap: 24 }}>

        {/* Header */}
        <div style={{ textAlign: "center", display: "grid", gap: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--accent-soft)",
              border: "1px solid rgba(124,58,237,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="var(--accent-strong)" opacity="0.9"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
            Entrar no INSISINT
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Acesse sua conta e continue planejando
          </p>
        </div>

        {/* Aviso sem Supabase */}
        {!supabase && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              fontSize: "0.85rem",
              color: "var(--danger)",
            }}
          >
            ⚠ Supabase não configurado. Verifique o arquivo <code>.env.local</code>.
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleLogin}
          style={{
            display: "grid",
            gap: 12,
            padding: 24,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-md)",
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
              E-mail
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
              Senha
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

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
            disabled={loading || !supabase}
            className="btn btn-primary"
            style={{ marginTop: 4, padding: "12px 16px", fontSize: "0.95rem", justifyContent: "center" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Entrando…
              </span>
            ) : "Entrar"}
          </button>
        </form>

        <p style={{ margin: 0, textAlign: "center", fontSize: "0.88rem", color: "var(--muted)" }}>
          Não tem conta?{" "}
          <Link href="/signup" style={{ color: "var(--accent-strong)", fontWeight: 600 }}>
            Criar conta grátis
          </Link>
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
