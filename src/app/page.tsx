import Link from "next/link";

const steps = [
  { n: "01", title: "Configure seu perfil", desc: "Defina nicho, público, objetivo e tom de voz. O sistema usa isso como base para tudo.", href: "/onboarding" },
  { n: "02", title: "Gere e aprove ideias", desc: "A IA cria propostas alinhadas ao seu perfil. Você aprova só o que faz sentido.", href: "/ideas" },
  { n: "03", title: "Monte o plano semanal", desc: "Escolha quais ideias entram na semana. Sem multitarefa, sem improviso.", href: "/weekly-plan" },
  { n: "04", title: "Calendário + Execução", desc: "Transforme a seleção em calendário, lembretes e acompanhe o progresso no dashboard.", href: "/dashboard" },
];

const pillars = [
  { icon: "◈", title: "Clareza", desc: "Ideias geradas pelo perfil e objetivo do negócio — sem palpites." },
  { icon: "◉", title: "Organização", desc: "Da ideia ao calendário semanal em um único fluxo." },
  { icon: "◆", title: "Execução", desc: "Lembretes, progresso e dashboard para manter o ritmo." },
];

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 80 }}>

      {/* ── Hero ─── */}
      <section style={{ display: "grid", gap: 40, maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-strong)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Sistema operacional de conteúdo com IA
          </span>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text)",
            }}
          >
            Pare de improvisar<br />
            <span style={{ color: "var(--accent-strong)" }}>conteúdo</span> toda semana.
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            O INSISINT transforma ideias dispersas em calendário executável — com IA, sem improviso,
            sem depender de memória.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary" style={{ padding: "13px 24px", fontSize: "0.95rem" }}>
            Criar conta grátis
          </Link>
          <Link href="/pilot" className="btn btn-secondary" style={{ padding: "13px 24px", fontSize: "0.95rem" }}>
            Ver demo guiada →
          </Link>
        </div>

        {/* Trust bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            paddingTop: 4,
          }}
        >
          {["Setup em 5 min", "Sem cartão de crédito", "Cancele quando quiser"].map((t) => (
            <span
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.82rem",
                color: "var(--muted)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2">
                <path d="M3 8l4 4 6-6"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Pilares ─── */}
      <section style={{ display: "grid", gap: 16 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--subtle)",
          }}
        >
          Por que funciona
        </p>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {pillars.map((p) => (
            <div key={p.title} className="card" style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--accent-soft)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  color: "var(--accent-strong)",
                }}
              >
                {p.icon}
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.95rem" }}>{p.title}</p>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ─── */}
      <section style={{ display: "grid", gap: 24 }}>
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--subtle)",
            }}
          >
            Como funciona
          </p>
          <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            4 etapas. Resultado toda semana.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: 2,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {steps.map((s, i) => (
            <Link
              key={s.n}
              href={s.href}
              className="step-card"
              style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--accent-strong)",
                  opacity: 0.6,
                }}
              >
                {s.n}
              </span>
              <div>
                <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: "0.95rem" }}>{s.title}</p>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>{s.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--subtle)" strokeWidth="2">
                <path d="M6 4l4 4-4 4"/>
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Pricing ─── */}
      <section style={{ display: "grid", gap: 24 }}>
        <div style={{ textAlign: "center", display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)" }}>
            Planos
          </p>
          <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Simples. Sem surpresa.
          </h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
            Comece grátis por 14 dias. Sem cartão de crédito.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

          {/* Piloto */}
          <div className="card" style={{ display: "grid", gap: 20, padding: 28 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Piloto</p>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Grátis</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>14 dias · sem cartão</p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {["1 perfil de conteúdo", "Geração de ideias com IA", "Calendário semanal", "Acompanhamento 1:1 na primeira semana"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M3 8l4 4 6-6"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/pilot/apply" className="btn btn-secondary" style={{ justifyContent: "center", padding: "12px 16px" }}>
              Aplicar para o piloto
            </Link>
          </div>

          {/* Pro — destaque */}
          <div
            style={{
              display: "grid",
              gap: 20,
              padding: 28,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-card)",
              boxShadow: "var(--glow)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--accent)",
                color: "#fff",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 14px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              Mais popular
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-strong)" }}>Pro</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>R$97</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>/mês</p>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Cancele quando quiser</p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {["Perfis ilimitados", "Ideias e roteiros ilimitados", "Calendário + lembretes automáticos", "Dashboard de operação completo", "Automação de DMs no Instagram"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M3 8l4 4 6-6"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn btn-primary" style={{ justifyContent: "center", padding: "12px 16px" }}>
              Começar agora
            </Link>
          </div>

          {/* Agência */}
          <div className="card" style={{ display: "grid", gap: 20, padding: 28 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Agência</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>R$297</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>/mês</p>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>Para times e múltiplos clientes</p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {["Tudo do Pro", "Até 20 perfis de clientes", "Painel de gestão de clientes", "Relatório semanal por email", "Suporte prioritário via WhatsApp"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M3 8l4 4 6-6"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn btn-secondary" style={{ justifyContent: "center", padding: "12px 16px" }}>
              Falar com a equipe
            </Link>
          </div>

        </div>
      </section>

      {/* ── CTA final ─── */}
      <section
        style={{
          padding: "48px 40px",
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border-md)",
          display: "grid",
          gap: 24,
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
            Pronto para sair do improviso?
          </h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "1rem", maxWidth: 480 }}>
            Crie sua conta em 1 minuto e comece a planejar com estrutura real.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup" className="btn btn-primary" style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
            Começar agora — é grátis
          </Link>
          <Link href="/pilot" className="btn btn-secondary" style={{ padding: "13px 24px", fontSize: "0.95rem" }}>
            Quero o piloto guiado
          </Link>
        </div>
      </section>

    </div>
  );
}
