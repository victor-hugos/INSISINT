import { AuthGuard } from "@/components/auth-guard";
import { OnboardingForm } from "@/components/onboarding-form";
import { UICard } from "@/components/ui-card";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto 24px",
};

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <div style={wrapperStyle}>
        <section style={headerStyle}>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Configure seu perfil
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Preencha as informacoes principais para que a IA entenda seu contexto
            e comece a montar seu sistema de conteudo.
          </p>
        </section>

        <section style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
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
