import { AuthGuard } from "@/components/auth/auth-guard";
import { CalendarPanel } from "@/components/modules/calendar-panel";
import { AppPageLayout } from "@/components/ui/app-page-layout";

export default function CalendarPage() {
  return (
    <AuthGuard>
      <AppPageLayout
        eyebrow="Etapa 4"
        title="Calendario semanal"
        description="Organize a semana com uma distribuicao equilibrada de conteudos por objetivo, formato e categoria."
        maxWidth={1080}
        highlights={[
          { title: "Semana clara", description: "Visualize distribuicao de formatos e objetivos em um plano unico." },
          { title: "Equilibrio", description: "Misture alcance, autoridade, relacionamento e venda." },
          { title: "Execucao", description: "Use o calendario como base para gerar lembretes automaticos." },
        ]}
      >
        <CalendarPanel />
      </AppPageLayout>
    </AuthGuard>
  );
}
