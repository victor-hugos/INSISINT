"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { tryCreateSupabaseBrowserClient } from "@/lib/db/supabase-browser";

const shellStyle: React.CSSProperties = {
  maxWidth: 440,
  margin: "0 auto",
  display: "grid",
  gap: 18,
};

const cardStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 24,
  borderRadius: 20,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow)",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.84)",
  padding: "13px 15px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

export default function LoginPage() {
  const supabase = useMemo(() => tryCreateSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase nao configurado neste ambiente.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main style={shellStyle}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Entrar</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Acesse sua conta para trabalhar com seus perfis e dados reais.
        </p>
      </div>

      <form onSubmit={handleLogin} style={cardStyle}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={fieldStyle}
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={fieldStyle}
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {!supabase ? (
          <p style={{ margin: 0, color: "#8a2f12" }}>
            Configure NEXT_PUBLIC_SUPABASE_URL e a chave publica do Supabase para usar o login.
          </p>
        ) : null}
        {error ? <p style={{ margin: 0, color: "#8a2f12" }}>{error}</p> : null}
      </form>

      <p style={{ margin: 0 }}>
        Ainda nao tem conta? <Link href="/signup">Criar conta</Link>
      </p>
    </main>
  );
}
