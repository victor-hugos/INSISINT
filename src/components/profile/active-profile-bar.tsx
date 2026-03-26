"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useActiveProfile } from "@/components/profile/profile-provider";

const barStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 24,
  padding: 20,
  display: "grid",
  gap: 14,
  background: "var(--bg-panel)",
  boxShadow: "var(--shadow-soft)",
  backdropFilter: "blur(10px)",
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
    return (
      <div style={barStyle}>
        <div
          className="skeleton"
          style={{ height: 14, width: 120, borderRadius: 999 }}
        />
        <div
          className="skeleton"
          style={{ height: 44, width: "100%", borderRadius: 16 }}
        />
        <div
          className="skeleton"
          style={{ height: 58, width: "100%", borderRadius: 18 }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={barStyle}>
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
            Perfil
          </p>
          <h2 style={{ margin: 0 }}>Entre para continuar o fluxo</h2>
        </div>
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "start",
        }}
      >
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
            Perfil ativo
          </p>
          <h2 style={{ margin: 0 }}>
            {profile ? profile.niche : "Ative um perfil para continuar"}
          </h2>
        </div>

        {profile ? (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--accent-strong)",
              fontWeight: 700,
            }}
          >
            Perfil pronto para uso
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Cole o profileId de um perfil existente"
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

      {loadingProfile ? (
        <div
          className="skeleton"
          style={{ height: 68, width: "100%", borderRadius: 18 }}
        />
      ) : null}

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
        <p style={{ margin: 0, color: "#8a2f12" }}>
          Nao foi possivel carregar esse perfil. Confira o `profileId` ou crie um novo onboarding.
        </p>
      ) : null}
    </div>
  );
}
