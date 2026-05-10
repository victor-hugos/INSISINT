"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tryCreateSupabaseBrowserClient } from "@/lib/db/supabase-browser";

export default function SignupPage() {
  const supabase = useMemo(() => tryCreateSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setError("Supabase não está configurado. Verifique as variáveis de ambiente.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este e-mail já está cadastrado. Tente fazer login.");
      } else if (authError.message.includes("Password should be")) {
        setError("A senha precisa ter pelo menos 6 caracteres.");
      } else {
        setError(authError.message);
      }
      return;
    }

    setSuccess(true);
  }

  if (success) {
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
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            display: "grid",
            gap: 20,
            padding: 32,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-md)",
            background: "var(--bg-card)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2">
              <path d="M3 8l4 4 6-6"/>
            </svg>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>Conta criada!</h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Verifique seu e-mail <strong style={{ color: "var(--text)" }}>{email}</strong> e
              clique no link de confirmação para ativar sua conta.
            </p>
          </div>
          <Link
            href="/login"
            className="btn btn-primary"
            style={{ justifyContent: "center", padding: "12px 16px" }}
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
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
            Criar conta grátis
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Comece a planejar seu conteúdo hoje
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
          onSubmit={handleSignup}
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
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>E-mail</label>
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
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Senha</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Confirmar senha</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
                Criando conta…
              </span>
            ) : "Criar conta grátis"}
          </button>

          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--subtle)", textAlign: "center" }}>
            Ao criar uma conta você concorda com os termos de uso.
          </p>
        </form>

        <p style={{ margin: 0, textAlign: "center", fontSize: "0.88rem", color: "var(--muted)" }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "var(--accent-strong)", fontWeight: 600 }}>
            Entrar
          </Link>
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
