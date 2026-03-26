import { AuthGuard } from "@/components/auth/auth-guard";
import { RemindersPanel } from "@/components/modules/reminders-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function RemindersPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 5"
        title="Lembretes"
        description="Organize alertas importantes da rotina de conteudo e deixe a base pronta para futuras notificacoes reais."
        maxWidth={1080}
        highlights={[
          { title: "Postagem", description: "Garanta que o conteudo certo sai no dia certo." },
          { title: "Producao", description: "Distribua revisao, gravacao e organizacao ao longo da semana." },
          { title: "Consistencia", description: "Use concluido x pendente para visualizar execucao real." },
        ]}
      >
        <RemindersPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
