import { AuthGuard } from "@/components/auth/auth-guard";
import { AnalyticsPanel } from "@/components/modules/analytics-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Monitoramento"
        title="Monitoramento"
        description="Acompanhe a performance da sua operacao de conteudo com base nos sinais reais do perfil ativo."
      >
        <AnalyticsPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
