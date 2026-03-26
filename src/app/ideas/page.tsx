import { AuthGuard } from "@/components/auth/auth-guard";
import { IdeasPanel } from "@/components/modules/ideas-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function IdeasPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 2"
        title="Ideias de conteudo"
        description="Gere ideias com base no onboarding e no diagnostico do perfil, agrupadas por objetivo de negocio."
        maxWidth={1080}
        highlights={[
          { title: "Alcance", description: "Ideias para aumentar descoberta e entrada de novas pessoas." },
          { title: "Autoridade", description: "Temas para reforcar confianca e clareza sobre o que voce sabe." },
          { title: "Venda", description: "Conteudos para conectar problema, desejo e oferta." },
        ]}
      >
        <IdeasPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
