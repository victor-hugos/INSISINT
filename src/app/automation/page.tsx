import { AuthGuard } from "@/components/auth/auth-guard";
import { AutomationPanel } from "@/components/modules/automation-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function AutomationPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 15"
        title="Automacao por comentario"
        description="Configure palavras-chave para resposta privada automatica no Instagram e prepare o webhook para eventos de comentario."
      >
        <AutomationPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
