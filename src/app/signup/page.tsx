"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

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

export default function SignupPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Conta criada com sucesso. Verifique seu e-mail se a confirmacao estiver habilitada."
    );
    router.push("/login");
    router.refresh();
  }

  return (
    <main style={shellStyle}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Criar conta</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Crie seu acesso para salvar perfis, planejamentos e automacoes por usuario.
        </p>
      </div>

      <form onSubmit={handleSignup} style={cardStyle}>
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
          {loading ? "Criando..." : "Criar conta"}
        </button>

        {error ? <p style={{ margin: 0, color: "#8a2f12" }}>{error}</p> : null}
        {message ? <p style={{ margin: 0, color: "var(--muted)" }}>{message}</p> : null}
      </form>

      <p style={{ margin: 0 }}>
        Ja tem conta? <Link href="/login">Entrar</Link>
      </p>
    </main>
  );
}
