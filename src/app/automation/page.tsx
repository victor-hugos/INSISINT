import { AuthGuard } from "@/components/auth-guard";
import { AutomationPanel } from "@/components/automation-panel";

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

export default function AutomationPage() {
  return (
    <AuthGuard>
      <main style={shellStyle}>
        <div style={contentStyle}>
          <div>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Etapa 15
            </p>
            <h1 style={{ margin: "8px 0 12px" }}>Automacao por comentario</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
              Configure palavras-chave para resposta privada automatica no
              Instagram e prepare o webhook para eventos de comentario.
            </p>
          </div>

          <AutomationPanel />
        </div>
      </main>
    </AuthGuard>
  );
}
