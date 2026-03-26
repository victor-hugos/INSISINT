import { AuthGuard } from "@/components/auth/auth-guard";
import { AutomationMonitorPanel } from "@/components/modules/automation-monitor-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function AutomationMonitorPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 16"
        title="Monitor de automacoes"
        description="Acompanhe eventos recebidos, respostas enviadas, falhas e tentativas de reprocessamento."
      >
        <AutomationMonitorPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
