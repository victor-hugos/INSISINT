import { AuthGuard } from "@/components/auth/auth-guard";
import { ProfilePanel } from "@/components/modules/profile-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Perfil"
        title="Analise de perfil"
        description="Veja a leitura estrategica do perfil ativo com base no onboarding, diagnostico e sinais reais da operacao."
      >
        <ProfilePanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
