import { AuthGuard } from "@/components/auth-guard";
import { AutomationMonitorPanel } from "@/components/automation-monitor-panel";

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

export default function AutomationMonitorPage() {
  return (
    <AuthGuard>
      <main style={shellStyle}>
        <div style={contentStyle}>
          <div>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Etapa 16
            </p>
            <h1 style={{ margin: "8px 0 12px" }}>Monitor de automacoes</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
              Acompanhe eventos recebidos, respostas enviadas, falhas e tentativas
              de reprocessamento.
            </p>
          </div>

          <AutomationMonitorPanel />
        </div>
      </main>
    </AuthGuard>
  );
}
