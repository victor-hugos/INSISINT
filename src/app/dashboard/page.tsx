import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardPanel } from "@/components/modules/dashboard-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto 24px",
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
        <DashboardPanel />
      </main>
    </AuthGuard>
  );
}
