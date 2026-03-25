import Link from "next/link";
import { UICard } from "@/components/ui-card";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section>
        <h1 style={{ marginBottom: 8 }}>Sua equipe de social media com IA</h1>
        <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)" }}>
          Organize seu conteudo, selecione ideias da semana, monte calendario
          e acompanhe a execucao em um unico fluxo.
        </p>
      </section>

      <UICard title="O que voce consegue fazer aqui">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>Gerar ideias alinhadas ao perfil e ao objetivo do negocio</li>
          <li>Aprovar apenas o que faz sentido para a semana</li>
          <li>Selecionar ideias e transformar em calendario</li>
          <li>Criar lembretes de execucao automaticamente</li>
          <li>Acompanhar consistencia e progresso no dashboard</li>
        </ul>
      </UICard>

      <UICard title="Fluxo recomendado do MVP">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li><Link href="/onboarding">Configure seu perfil</Link></li>
          <li><Link href="/ideas">Gere e aprove ideias</Link></li>
          <li><Link href="/weekly-plan">Escolha a semana</Link></li>
          <li><Link href="/calendar">Monte o calendario</Link></li>
          <li><Link href="/reminders">Execute com lembretes</Link></li>
          <li><Link href="/dashboard">Acompanhe o progresso</Link></li>
        </ol>
      </UICard>

      <UICard title="Piloto guiado">
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Quer mostrar o produto para um potencial cliente ou captar os primeiros
          interessados? Use a pagina do piloto como entrada comercial.
        </p>
        <Link href="/pilot">Abrir pagina do piloto</Link>
      </UICard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <UICard title="Planejamento">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Foco principal da demonstracao do MVP.
          </p>
          <Link href="/onboarding">Configurar perfil</Link>
          <Link href="/ideas">Gerar ideias</Link>
          <Link href="/weekly-plan">Selecionar semana</Link>
          <Link href="/calendar">Gerar calendario</Link>
        </UICard>

        <UICard title="Execucao">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Onde o usuario percebe progresso e consistencia.
          </p>
          <Link href="/reminders">Gerenciar lembretes</Link>
          <Link href="/dashboard">Ver progresso</Link>
          <Link href="/analytics">Ver numeros</Link>
        </UICard>

        <UICard title="Recursos avancados">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Podem aparecer na demo, mas nao precisam conduzir a conversa inicial.
          </p>
          <Link href="/scripts">Roteiros</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/automation">Automacao</Link>
          <Link href="/automation/monitor">Monitor</Link>
        </UICard>
      </div>
    </div>
  );
}
