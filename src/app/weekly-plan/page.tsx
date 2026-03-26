import { AuthGuard } from "@/components/auth/auth-guard";
import { WeeklyPlanPanel } from "@/components/modules/weekly-plan-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function WeeklyPlanPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 3"
        title="Planejamento semanal"
        description="Escolha exatamente quais ideias aprovadas entram no calendario desta semana antes de gerar o plano."
        highlights={[
          { title: "Curadoria", description: "Selecione apenas as ideias que merecem foco agora." },
          { title: "Prioridade", description: "Evite tentar executar tudo ao mesmo tempo." },
          { title: "Base da semana", description: "Essa escolha alimenta o calendario e os lembretes." },
        ]}
      >
        <WeeklyPlanPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
