import { AuthGuard } from "@/components/auth-guard";
import { WeeklyPlanPanel } from "@/components/weekly-plan-panel";

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

export default function WeeklyPlanPage() {
  return (
    <AuthGuard>
      <main style={shellStyle}>
        <div style={contentStyle}>
          <div>
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Etapa 12
            </p>
            <h1 style={{ margin: "8px 0 12px" }}>Planejamento semanal</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
              Escolha exatamente quais ideias aprovadas entram no calendario desta
              semana antes de gerar o plano.
            </p>
          </div>

          <WeeklyPlanPanel />
        </div>
      </main>
    </AuthGuard>
  );
}
