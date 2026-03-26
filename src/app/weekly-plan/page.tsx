import { AuthGuard } from "@/components/auth/auth-guard";
import { WeeklyPlanPanel } from "@/components/modules/weekly-plan-panel";

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "28px 20px 48px",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gap: 22,
};

export default function WeeklyPlanPage() {
  return (
    <AuthGuard>
      <main style={shellStyle}>
        <div style={contentStyle}>
          <section
            style={{
              padding: 28,
              borderRadius: 28,
              border: "1px solid var(--border)",
              background:
                "linear-gradient(135deg, rgba(255,250,244,0.96), rgba(244,230,214,0.92))",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
              Etapa 3
            </p>
            <h1 style={{ margin: "8px 0 12px" }}>Planejamento semanal</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 720 }}>
              Escolha exatamente quais ideias aprovadas entram no calendario desta
              semana antes de gerar o plano.
            </p>
          </section>

          <section className="marketing-card-grid">
            {[
              ["Curadoria", "Selecione apenas as ideias que merecem foco agora."],
              ["Prioridade", "Evite tentar executar tudo ao mesmo tempo."],
              ["Base da semana", "Essa escolha alimenta o calendario e os lembretes."],
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

          <WeeklyPlanPanel />
        </div>
      </main>
    </AuthGuard>
  );
}
