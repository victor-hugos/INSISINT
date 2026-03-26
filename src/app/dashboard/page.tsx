import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardPanel } from "@/components/modules/dashboard-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 6"
        title="Dashboard"
        description="Visao consolidada da operacao de conteudo com perfil, diagnostico, ideias, roteiros, calendario e lembretes em um unico lugar."
        maxWidth={1200}
        highlights={[
          { title: "Visao geral", description: "Entenda rapidamente o estado atual do perfil ativo." },
          { title: "Execucao", description: "Veja o progresso semanal e o que ainda precisa ser feito." },
          { title: "Prioridade", description: "Use o dashboard para decidir a proxima acao do fluxo." },
        ]}
      >
        <DashboardPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
