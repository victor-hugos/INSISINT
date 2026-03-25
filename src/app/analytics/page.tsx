import { AuthGuard } from "@/components/auth-guard";
import { AnalyticsPanel } from "@/components/analytics-panel";

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "40px 20px 56px",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gap: 18,
};

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <main style={shellStyle}>
        <div style={contentStyle}>
          <div>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Etapa 17
            </p>
            <h1 style={{ margin: "8px 0 12px" }}>Analytics do produto</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
              Veja os numeros principais da operacao de conteudo, execucao e
              automacao por perfil ativo.
            </p>
          </div>

          <AnalyticsPanel />
        </div>
      </main>
    </AuthGuard>
  );
}
