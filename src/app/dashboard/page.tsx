import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardPanel } from "@/components/modules/dashboard-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "28px 20px 48px",
  display: "grid",
  gap: 22,
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background:
    "linear-gradient(135deg, rgba(255,250,244,0.96), rgba(244,230,214,0.92))",
  boxShadow: "var(--shadow-soft)",
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ marginBottom: 8, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 6
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Dashboard
          </h1>
          <p style={{ maxWidth: 760, color: "var(--muted)", fontSize: "1.05rem" }}>
            Visao consolidada da operacao de conteudo com perfil, diagnostico,
            ideias, roteiros, calendario e lembretes em um unico lugar.
          </p>
        </section>
        <section
          className="marketing-card-grid"
          style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}
        >
          {[
            ["Visao geral", "Entenda rapidamente o estado atual do perfil ativo."],
            ["Execucao", "Veja o progresso semanal e o que ainda precisa ser feito."],
            ["Prioridade", "Use o dashboard para decidir a proxima acao do fluxo."],
          ].map(([title, description]) => (
            <div
              key={title}
              style={{
                padding: 18,
                borderRadius: 22,
                border: "1px solid var(--border)",
                background: "var(--bg-panel)",
                boxShadow: "var(--shadow-soft)",
                display: "grid",
                gap: 8,
              }}
            >
              <strong>{title}</strong>
              <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
            </div>
          ))}
        </section>
        <DashboardPanel />
      </main>
    </AuthGuard>
  );
}
