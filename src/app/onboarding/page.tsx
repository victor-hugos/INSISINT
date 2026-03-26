import { AuthGuard } from "@/components/auth/auth-guard";
import { OnboardingForm } from "@/components/modules/onboarding-form";
import { AppPageLayout } from "@/components/ui/app-page-layout";
import { UICard } from "@/components/ui/ui-card";

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 1"
        title="Configure seu perfil"
        description="Preencha as informacoes principais para que a IA entenda seu contexto e comece a montar seu sistema de conteudo."
        maxWidth={1080}
      >
        <section
          style={{
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
      </AppPageLayout>
    </AuthGuard>
  );
}
