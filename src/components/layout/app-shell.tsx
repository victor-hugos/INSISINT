"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { SessionBox } from "@/components/auth/session-box";
import { ActiveProfileBar } from "@/components/profile/active-profile-bar";

const appLinks = [
  { href: "/ideas", label: "Ideias" },
  { href: "/calendar", label: "Calendario" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reminders", label: "Lembretes" },
];

const workflowLinks = [
  { href: "/onboarding", label: "Onboarding" },
  { href: "/weekly-plan", label: "Plano semanal" },
];

const advancedLinks = [
  { href: "/scripts", label: "Roteiros" },
  { href: "/automation", label: "Automacao" },
  { href: "/analytics", label: "Analytics" },
  { href: "/automation/monitor", label: "Monitor" },
  { href: "/pilot/leads", label: "Leads" },
];

const sectionLabelStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--muted)",
  fontSize: "0.82rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
};

function getLinkStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: isActive ? "var(--accent)" : "rgba(255,255,255,0.78)",
    color: isActive ? "#fff8f2" : "var(--text)",
    fontWeight: 700,
    boxShadow: isActive ? "var(--shadow-soft)" : "none",
  };
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isMarketingPage = pathname === "/pilot" || pathname.startsWith("/pilot/");
  const isPublicHome = pathname === "/";
  const showMarketingShell = isPublicHome || isMarketingPage || isAuthPage;

  if (showMarketingShell) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            borderBottom: "1px solid var(--border)",
            background: "rgba(252,248,242,0.88)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ display: "grid", gap: 2 }}>
              <strong style={{ fontSize: 24 }}>INSISINT</strong>
              <span style={{ color: "var(--muted)" }}>
                Sistema operacional de conteudo com IA
              </span>
            </Link>

            <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/pilot" style={getLinkStyle(pathname === "/pilot")}>
                Piloto
              </Link>
              {user ? (
                <Link href="/dashboard" style={getLinkStyle(pathname === "/dashboard")}>
                  Abrir app
                </Link>
              ) : (
                <>
                  <Link href="/login" style={getLinkStyle(pathname === "/login")}>
                    Entrar
                  </Link>
                  <Link
                    href="/signup"
                    style={{
                      ...getLinkStyle(false),
                      background: "var(--accent)",
                      color: "#fff8f2",
                    }}
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main
          style={{
            width: "min(1180px, calc(100% - 32px))",
            margin: "0 auto",
            padding: "32px 0 48px",
            display: "grid",
            gap: 24,
            alignContent: "start",
          }}
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell-layout">
      <aside className="app-shell-sidebar">
        <div style={{ display: "grid", gap: 6 }}>
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
            Workspace
          </p>
          <h1 style={{ fontSize: 22, margin: 0 }}>INSISINT</h1>
          <p style={{ marginTop: 8, marginBottom: 0, color: "var(--muted)" }}>
            Seu sistema operacional de conteudo
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={sectionLabelStyle}>Essencial</p>
          <nav style={{ display: "grid", gap: 8 }}>
            {appLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link key={link.href} href={link.href} style={getLinkStyle(isActive)}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={sectionLabelStyle}>Fluxo</p>
          <nav style={{ display: "grid", gap: 8 }}>
            {workflowLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link key={link.href} href={link.href} style={getLinkStyle(isActive)}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={sectionLabelStyle}>Recursos</p>
          <nav style={{ display: "grid", gap: 8 }}>
            {advancedLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link key={link.href} href={link.href} style={getLinkStyle(isActive)}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {!loading ? (
          <div
            style={{
              padding: 14,
              borderRadius: 18,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.68)",
              display: "grid",
              gap: 8,
            }}
          >
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Fluxo recomendado
            </p>
            <strong>Perfil, ideias, semana, calendario e execucao.</strong>
          </div>
        ) : null}

        <SessionBox />
      </aside>

      <main className="app-shell-main">
        <ActiveProfileBar />
        {children}
      </main>
    </div>
  );
}
