import Link from "next/link";

const benefits = [
  { icon: "◈", title: "14 dias gratuitos", desc: "Acesso completo ao sistema sem cartão de crédito." },
  { icon: "◉", title: "Acompanhamento 1:1", desc: "Primeira semana com suporte direto para configurar seu perfil." },
  { icon: "◆", title: "IA personalizada", desc: "Ideias e roteiros gerados com base no seu nicho e objetivo." },
  { icon: "◇", title: "Calendário executável", desc: "Da ideia ao calendário semanal em um único fluxo." },
];

const testimonials = [
  {
    quote: "Parei de ficar em branco toda segunda-feira. O INSISINT gera as ideias e eu só aprovo o que faz sentido.",
    name: "Ana Lima",
    role: "Nutricionista · 12k seguidores",
  },
  {
    quote: "Em 3 semanas postei mais do que nos 2 meses anteriores. A consistência que eu nunca consegui sozinha.",
    name: "Marcos Vieira",
    role: "Coach financeiro · Lançando infoproduto",
  },
];

export default function PilotPage() {
  return (
    <div style={{ display: "grid", gap: 72, maxWidth: 800, margin: "0 auto" }}>

      {/* ── Hero ── */}
      <section style={{ display: "grid", gap: 28 }}>
        <div style={{ display: "inline-flex", width: "fit-content" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--success)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            Vagas abertas para o piloto
          </span>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            14 dias para sair do improviso.<br />
            <span style={{ color: "var(--accent-strong)" }}>De graça.</span>
          </h1>
          <p style={{ margin: 0, fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 560 }}>
            Acesso completo ao INSISINT com acompanhamento pessoal na primeira semana.
            Para quem quer organizar o conteúdo de verdade, não só testar uma ferramenta.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/pilot/apply" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
            Quero entrar no piloto →
          </Link>
          <Link href="/signup" className="btn btn-secondary" style={{ padding: "14px 24px", fontSize: "1rem" }}>
            Criar conta direto
          </Link>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {["Sem cartão de crédito", "Cancele quando quiser", "Resposta em até 48h"].map((t) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "var(--muted)" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2">
                <path d="M3 8l4 4 6-6"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Benefícios ── */}
      <section style={{ display: "grid", gap: 16 }}>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)" }}>
          O que você ganha
        </p>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {benefits.map((b) => (
            <div
              key={b.title}
              style={{
                padding: "18px 20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                display: "grid",
                gap: 10,
              }}
            >
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
                  fontSize: "1rem",
                  color: "var(--accent-strong)",
                }}
              >
                {b.icon}
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.92rem" }}>{b.title}</p>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Para quem é ── */}
      <section
        style={{
          padding: "28px 32px",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-md)",
          background: "var(--bg-card)",
          display: "grid",
          gap: 20,
        }}
      >
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)" }}>Para quem é</p>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>O piloto é para você se…</h2>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {[
            "Você some do Instagram por semanas porque não sabe o que postar",
            "Você tem ideias mas não consegue transformar em calendário",
            "Você quer consistência mas não tem tempo para planejar tudo manualmente",
            "Você é criador, especialista ou pequeno negócio que quer crescer com conteúdo",
          ].map((item) => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent-strong)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M3 8l4 4 6-6"/>
              </svg>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section style={{ display: "grid", gap: 16 }}>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--subtle)" }}>
          O que dizem
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "20px 22px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-md)",
                background: "var(--bg-card)",
                display: "grid",
                gap: 14,
              }}
            >
              <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section
        style={{
          padding: "40px 32px",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-strong)",
          background: "var(--bg-card)",
          boxShadow: "var(--glow)",
          display: "grid",
          gap: 20,
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
            Pronto para organizar seu conteúdo?
          </h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem", maxWidth: 440 }}>
            Preencha o formulário em menos de 2 minutos. Analisamos sua aplicação e liberamos o acesso em até 48 horas.
          </p>
        </div>
        <Link href="/pilot/apply" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
          Aplicar para o piloto gratuito →
        </Link>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--subtle)" }}>
          Sem cartão de crédito · 14 dias grátis · Cancele quando quiser
        </p>
      </section>

    </div>
  );
}
