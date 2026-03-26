import Link from "next/link";
import { UICard } from "@/components/ui/ui-card";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <section className="marketing-hero-grid">
        <div
          style={{
            padding: 34,
            borderRadius: 30,
            border: "1px solid var(--border)",
            background:
              "linear-gradient(140deg, rgba(255,250,244,0.96), rgba(241,224,205,0.94))",
            boxShadow: "var(--shadow)",
            display: "grid",
            gap: 18,
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <p
              style={{
                margin: 0,
                color: "var(--accent-strong)",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontSize: "0.8rem",
              }}
            >
              Sistema operacional de conteudo
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(2.7rem, 5vw, 4.6rem)", lineHeight: 0.98 }}>
              Pare de improvisar conteudo toda semana.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 700,
                color: "var(--muted)",
                fontSize: "1.1rem",
              }}
            >
              O INSISINT ajuda creators e especialistas a sair da confusao,
              transformar ideias em calendario e manter execucao com mais clareza.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                padding: "15px 20px",
                borderRadius: 16,
                background: "var(--accent)",
                color: "#fff8f2",
                fontWeight: 700,
                boxShadow: "var(--shadow-soft)",
              }}
            >
              Criar conta e comecar
            </Link>
            <Link
              href="/pilot"
              style={{
                padding: "15px 20px",
                borderRadius: 16,
                border: "1px solid var(--border-strong)",
                background: "rgba(255,255,255,0.7)",
                fontWeight: 700,
              }}
            >
              Ver piloto guiado
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {[
              ["Ideias alinhadas", "Receba propostas prontas para o seu perfil."],
              ["Semana definida", "Escolha o que entra em execucao agora."],
              ["Execucao visivel", "Use lembretes e dashboard para manter consistencia."],
            ].map(([title, description]) => (
              <article
                key={title}
                style={{
                  padding: 16,
                  borderRadius: 20,
                  border: "1px solid rgba(76,43,14,0.1)",
                  background: "rgba(255,255,255,0.62)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <strong>{title}</strong>
                <span style={{ color: "var(--muted)" }}>{description}</span>
              </article>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
            padding: 26,
            borderRadius: 28,
            border: "1px solid var(--border)",
            background: "var(--bg-panel)",
            boxShadow: "var(--shadow-soft)",
            alignContent: "start",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--accent-strong)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}
          >
            Resultado esperado
          </p>
          <h2 style={{ margin: 0 }}>Transforme conteudo em operacao semanal.</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              "Saiba o que postar e por que aquilo faz sentido.",
              "Escolha apenas as ideias que merecem entrar na semana.",
              "Veja calendario, lembretes e progresso no mesmo lugar.",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: "var(--accent)",
                    marginTop: 5,
                  }}
                />
                <p style={{ margin: 0, color: "var(--muted)" }}>{item}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 20,
              background: "rgba(217,111,45,0.08)",
              border: "1px solid rgba(217,111,45,0.12)",
            }}
          >
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Ideal para quem quer mais consistencia sem depender de improviso ou memoria.
            </p>
          </div>
        </div>
      </section>

      <section className="marketing-card-grid">
        {[
          [
            "Clareza",
            "Receba ideias alinhadas ao perfil e ao objetivo do negocio.",
          ],
          [
            "Organizacao",
            "Transforme selecao semanal em calendario acionavel.",
          ],
          [
            "Execucao",
            "Use lembretes e dashboard para manter o ritmo da semana.",
          ],
        ].map(([title, description]) => (
          <UICard key={title} title={title}>
            <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
          </UICard>
        ))}
      </section>

      <UICard title="Como funciona">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {[
            ["1. Configure", "Defina nicho, publico, objetivo e tom do perfil.", "/onboarding"],
            ["2. Planeje", "Gere ideias, aprove o que faz sentido e monte a semana.", "/ideas"],
            ["3. Execute", "Transforme em calendario, lembretes e acompanhe progresso.", "/dashboard"],
          ].map(([title, description, href]) => (
            <article
              key={title}
              style={{
                padding: 18,
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.58)",
                display: "grid",
                gap: 10,
              }}
            >
              <strong>{title}</strong>
              <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
              <Link href={href} style={{ color: "var(--accent-strong)", fontWeight: 700 }}>
                Ir para esta etapa
              </Link>
            </article>
          ))}
        </div>
      </UICard>

      <section className="marketing-split-grid">
        <UICard title="Fluxo recomendado do MVP">
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
            <li><Link href="/onboarding">Configure seu perfil</Link></li>
            <li><Link href="/ideas">Gere e aprove ideias</Link></li>
            <li><Link href="/weekly-plan">Escolha a semana</Link></li>
            <li><Link href="/calendar">Monte o calendario</Link></li>
            <li><Link href="/reminders">Execute com lembretes</Link></li>
            <li><Link href="/dashboard">Acompanhe o progresso</Link></li>
          </ol>
        </UICard>

        <UICard title="Piloto guiado">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Use o piloto como entrada comercial para mostrar valor, captar interessados
            e conduzir as primeiras demonstracoes.
          </p>
          <Link href="/pilot" style={{ color: "var(--accent-strong)", fontWeight: 700 }}>
            Abrir pagina do piloto
          </Link>
        </UICard>
      </section>
    </div>
  );
}
