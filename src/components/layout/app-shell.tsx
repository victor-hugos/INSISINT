"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { SessionBox } from "@/components/auth/session-box";
import { ActiveProfileBar } from "@/components/profile/active-profile-bar";

/* ─── Ícones SVG ─────────────────────────────────────── */
const icons = {
  profile: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="10" cy="7" r="3.5"/><path d="M2.5 17c0-3.314 3.358-6 7.5-6s7.5 2.686 7.5 6"/>
    </svg>
  ),
  ideas: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M10 2a6 6 0 0 1 4 10.47V15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2.53A6 6 0 0 1 10 2z"/>
      <path d="M7 18h6"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v3M13 2v3"/>
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  reminders: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M10 2a6 6 0 0 1 6 6c0 3.5 1.5 5 1.5 5h-15S4 11.5 4 8a6 6 0 0 1 6-6z"/>
      <path d="M8.5 17a1.5 1.5 0 0 0 3 0"/>
    </svg>
  ),
  onboarding: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M10 17.5V11m0-8.5c2 2 5 3.5 7 4l-2 6H5L3 6.5c2-.5 5-2 7-4z"/>
    </svg>
  ),
  weeklyPlan: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 5h12M4 10h8M4 15h10"/>
    </svg>
  ),
  scripts: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
      <path d="M7 7h6M7 10h6M7 13h4"/>
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M11 2 7 10h6l-4 8"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 15l4-6 4 3 4-8"/>
      <path d="M3 17h14"/>
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2" y="3" width="16" height="11" rx="2"/><path d="M7 18h6M10 14v4"/>
    </svg>
  ),
  leads: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="7" cy="7" r="3"/><path d="M1 17c0-2.76 2.686-5 6-5"/>
      <circle cx="14" cy="8" r="3"/><path d="M11 17c0-2.76 1.343-5 3-5s3 2.24 3 5"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 5h14M3 10h14M3 15h14"/>
    </svg>
  ),
};

/* ─── Dados de navegação ─────────────────────────────── */
const essentialLinks = [
  { href: "/profile",   label: "Perfil",     icon: icons.profile },
  { href: "/ideas",     label: "Ideias",     icon: icons.ideas },
  { href: "/calendar",  label: "Calendário", icon: icons.calendar },
  { href: "/dashboard", label: "Dashboard",  icon: icons.dashboard },
  { href: "/reminders", label: "Lembretes",  icon: icons.reminders },
];

const workflowLinks = [
  { href: "/onboarding",   label: "Onboarding",     icon: icons.onboarding },
  { href: "/weekly-plan",  label: "Plano semanal",   icon: icons.weeklyPlan },
];

const advancedLinks = [
  { href: "/scripts",             label: "Roteiros",   icon: icons.scripts },
  { href: "/automation",          label: "Automação",  icon: icons.automation },
  { href: "/analytics",           label: "Analytics",  icon: icons.analytics },
  { href: "/automation/monitor",  label: "Monitor",    icon: icons.monitor },
  { href: "/pilot/leads",         label: "Leads",      icon: icons.leads },
];

const bottomNavLinks = [
  { href: "/profile",   label: "Perfil",     icon: icons.profile },
  { href: "/ideas",     label: "Ideias",     icon: icons.ideas },
  { href: "/calendar",  label: "Calendário", icon: icons.calendar },
  { href: "/dashboard", label: "Dashboard",  icon: icons.dashboard },
  { href: "/reminders", label: "Lembretes",  icon: icons.reminders },
];

/* ─── Componente de link na sidebar ─────────────────── */
function SidebarLink({ href, label, icon, active, onClick }: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`sidebar-link${active ? " active" : ""}`}
    >
      <span className="sidebar-link-icon">{icon}</span>
      {label}
    </Link>
  );
}

/* ─── Conteúdo da sidebar ────────────────────────────── */
function SidebarContent({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  function isActive(href: string) {
    return pathname === href || (href.length > 1 && pathname.startsWith(`${href}/`));
  }

  return (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo" onClick={onNav}>
          <div className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="var(--accent-strong)"/>
            </svg>
          </div>
          <span>INSISINT</span>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Essencial</p>
        {essentialLinks.map((l) => (
          <SidebarLink key={l.href} {...l} active={isActive(l.href)} onClick={onNav} />
        ))}

        <p className="sidebar-section-label">Fluxo</p>
        {workflowLinks.map((l) => (
          <SidebarLink key={l.href} {...l} active={isActive(l.href)} onClick={onNav} />
        ))}

        <p className="sidebar-section-label">Recursos</p>
        {advancedLinks.map((l) => (
          <SidebarLink key={l.href} {...l} active={isActive(l.href)} onClick={onNav} />
        ))}
      </nav>

      {/* Sessão */}
      <div className="sidebar-footer">
        <SessionBox />
      </div>
    </>
  );
}

/* ─── AppShell principal ─────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuth = pathname === "/login" || pathname === "/signup";
  const isPilot = pathname === "/pilot" || pathname.startsWith("/pilot/");
  const isHome = pathname === "/";
  const showMarketing = isHome || isPilot || isAuth;

  useEffect(() => { setDrawerOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* ── Shell de marketing / auth ─── */
  if (showMarketing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header className="marketing-header">
          <div className="marketing-header-inner">
            <Link href="/" className="marketing-logo">
              <span className="marketing-logo-dot" />
              INSISINT
            </Link>
            <nav className="marketing-nav">
              <Link href="/pilot" className={`marketing-nav-link${pathname === "/pilot" ? " active" : ""}`}>
                Piloto
              </Link>
              {user ? (
                <Link href="/dashboard" className="marketing-nav-link accent">
                  Abrir app
                </Link>
              ) : (
                <>
                  <Link href="/login" className={`marketing-nav-link${pathname === "/login" ? " active" : ""}`}>
                    Entrar
                  </Link>
                  <Link href="/signup" className="marketing-nav-link accent">
                    Criar conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="marketing-main" style={{ flex: 1, paddingTop: 48 }}>
          {children}
        </main>
      </div>
    );
  }

  /* ── Shell de app autenticado ─── */
  function isActive(href: string) {
    return pathname === href || (href.length > 1 && pathname.startsWith(`${href}/`));
  }

  return (
    <div className="app-shell-layout">
      {/* Sidebar desktop */}
      <aside className="app-shell-sidebar">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Header mobile */}
      <header className="app-shell-mobile-header">
        <Link href="/dashboard" className="sidebar-logo" style={{ textDecoration: "none" }}>
          <div className="sidebar-logo-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="var(--accent-strong)"/>
            </svg>
          </div>
          <span style={{ fontSize: "0.95rem" }}>INSISINT</span>
        </Link>
        <button
          className="hamburger-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Overlay */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* Drawer mobile */}
      <aside className={`app-shell-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{ padding: "14px 14px 0", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setDrawerOpen(false)}
            className="btn btn-ghost"
            style={{ fontSize: "0.85rem", padding: "6px 12px" }}
          >
            ✕ Fechar
          </button>
        </div>
        <SidebarContent pathname={pathname} onNav={() => setDrawerOpen(false)} />
      </aside>

      {/* Conteúdo */}
      <main className="app-shell-main">
        <ActiveProfileBar />
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {bottomNavLinks.map((l) => (
          <Link key={l.href} href={l.href} className={`bottom-nav-item${isActive(l.href) ? " active" : ""}`}>
            <span className="bottom-nav-icon">{l.icon}</span>
            <span className="bottom-nav-label">{l.label}</span>
          </Link>
        ))}
        <button className="bottom-nav-item" onClick={() => setDrawerOpen(true)}>
          <span className="bottom-nav-icon">{icons.menu}</span>
          <span className="bottom-nav-label">Menu</span>
        </button>
      </nav>
    </div>
  );
}
