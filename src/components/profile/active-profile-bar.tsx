"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useActiveProfile } from "@/components/profile/profile-provider";

const barStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 18,
  display: "grid",
  gap: 12,
  background: "rgba(255,255,255,0.72)",
};

const inputStyle: React.CSSProperties = {
  minWidth: 260,
  borderRadius: 14,
  border: "1px solid var(--border)",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.88)",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "none",
  background: "var(--accent)",
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#e7d7c8",
  color: "var(--text)",
};

export function ActiveProfileBar() {
  const { user, loading } = useAuth();
  const {
    activeProfileId,
    profile,
    loadingProfile,
    setActiveProfileId,
    clearActiveProfile,
  } = useActiveProfile();

  const [inputValue, setInputValue] = useState(activeProfileId || "");

  function handleActivate() {
    if (!inputValue.trim()) {
      return;
    }

    setActiveProfileId(inputValue.trim());
  }

  if (loading) {
    return <div style={barStyle}>Carregando sessao...</div>;
  }

  if (!user) {
    return (
      <div style={barStyle}>
        <h2 style={{ margin: 0 }}>Perfil ativo</h2>
        <p style={{ margin: 0 }}>
          Entre na sua conta para ativar um perfil e continuar o fluxo de trabalho.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/login" style={{ ...buttonStyle, textDecoration: "none" }}>
            Entrar
          </Link>
          <Link
            href="/signup"
            style={{ ...secondaryButtonStyle, textDecoration: "none" }}
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={barStyle}>
      <h2 style={{ margin: 0 }}>Perfil ativo</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Informe o profileId"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          style={inputStyle}
        />

        <button type="button" onClick={handleActivate} style={buttonStyle}>
          Ativar perfil
        </button>

        <button
          type="button"
          onClick={() => {
            clearActiveProfile();
            setInputValue("");
          }}
          style={secondaryButtonStyle}
        >
          Limpar perfil
        </button>
      </div>

      {loadingProfile ? <p style={{ margin: 0 }}>Carregando perfil...</p> : null}

      {!loadingProfile && activeProfileId && profile ? (
        <div style={{ display: "grid", gap: 6 }}>
          <p style={{ margin: 0 }}>
            <strong>Profile ID:</strong> {activeProfileId}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Nicho:</strong> {profile.niche}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Publico:</strong> {profile.target_audience}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Objetivo:</strong> {profile.goal}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Tom:</strong> {profile.tone}
          </p>
        </div>
      ) : null}

      {!loadingProfile && activeProfileId && !profile ? (
        <p style={{ margin: 0 }}>Nao foi possivel carregar esse perfil.</p>
      ) : null}
    </div>
  );
}
