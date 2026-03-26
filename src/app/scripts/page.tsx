import { AuthGuard } from "@/components/auth/auth-guard";
import { ScriptsPanel } from "@/components/modules/scripts-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function ScriptsPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 3"
        title="Gerar roteiro"
        description="Transforme uma ideia em um roteiro curto, publicavel e alinhado ao objetivo do perfil."
        maxWidth={1080}
      >
        <ScriptsPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
