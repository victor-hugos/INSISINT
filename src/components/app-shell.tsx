"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ActiveProfileBar } from "@/components/active-profile-bar";
import { SessionBox } from "@/components/session-box";

const primaryLinks = [
  { href: "/", label: "Inicio" },
  { href: "/pilot", label: "Piloto" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/ideas", label: "Ideias" },
  { href: "/weekly-plan", label: "Plano semanal" },
  { href: "/calendar", label: "Calendario" },
  { href: "/reminders", label: "Lembretes" },
  { href: "/dashboard", label: "Dashboard" },
];

const advancedLinks = [
  { href: "/pilot/leads", label: "Leads" },
  { href: "/scripts", label: "Roteiros" },
  { href: "/automation", label: "Automacao" },
  { href: "/analytics", label: "Analytics" },
  { href: "/automation/monitor", label: "Monitor" },
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
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: isActive ? "var(--accent)" : "rgba(255,255,255,0.75)",
    color: isActive ? "#fff8f2" : "var(--text)",
    fontWeight: 700,
  };
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isMarketingPage = pathname === "/pilot" || pathname.startsWith("/pilot/");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid var(--border)",
          padding: 20,
          display: "grid",
          gap: 16,
          alignContent: "start",
          background: "rgba(255,255,255,0.66)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Creator Copilot</h1>
          <p style={{ marginTop: 8, marginBottom: 0, color: "var(--muted)" }}>
            Equipe de social media com IA
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={sectionLabelStyle}>Principal</p>
          <nav style={{ display: "grid", gap: 8 }}>
            {primaryLinks.map((link) => {
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
          <p style={sectionLabelStyle}>Avancado</p>
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

        <SessionBox />
      </aside>

      <main style={{ padding: 24, display: "grid", gap: 20, alignContent: "start" }}>
        {!isAuthPage && !isMarketingPage ? <ActiveProfileBar /> : null}
        {children}
      </main>
    </div>
  );
}
