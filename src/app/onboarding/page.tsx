import { AuthGuard } from "@/components/auth/auth-guard";
import { OnboardingForm } from "@/components/modules/onboarding-form";
import { UICard } from "@/components/ui/ui-card";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "28px 20px 48px",
  display: "grid",
  gap: 22,
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  width: "100%",
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background:
    "linear-gradient(135deg, rgba(255,250,244,0.96), rgba(244,230,214,0.92))",
  boxShadow: "var(--shadow-soft)",
};

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <div style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 1
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Configure seu perfil
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Preencha as informacoes principais para que a IA entenda seu contexto
            e comece a montar seu sistema de conteudo.
          </p>
        </section>

        <section
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 18,
          }}
          className="marketing-split-grid"
        >
          <UICard title="Por que isso importa">
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Quanto melhor o contexto do perfil, mais util fica a geracao de ideias,
              o diagnostico e o restante do fluxo semanal.
            </p>
          </UICard>
          <UICard title="O que sera definido aqui">
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
              <li>Nicho e publico-alvo</li>
              <li>Objetivo principal do perfil</li>
              <li>Tom de voz</li>
              <li>Frequencia ideal de postagem</li>
              <li>Produtos, servicos e concorrentes</li>
            </ul>
          </UICard>
        </section>

        <OnboardingForm />
      </div>
    </AuthGuard>
  );
}
