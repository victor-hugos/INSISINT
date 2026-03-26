import { AuthGuard } from "@/components/auth/auth-guard";
import { CalendarPanel } from "@/components/modules/calendar-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "28px 20px 48px",
  display: "grid",
  gap: 22,
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  width: "100%",
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background:
    "linear-gradient(135deg, rgba(255,250,244,0.96), rgba(244,230,214,0.92))",
  boxShadow: "var(--shadow-soft)",
};

export default function CalendarPage() {
  return (
    <AuthGuard>
      <main style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ marginBottom: 8, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 4
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Calendario semanal
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Organize a semana com uma distribuicao equilibrada de conteudos por
            objetivo, formato e categoria.
          </p>
        </section>
        <section
          className="marketing-card-grid"
          style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}
        >
          {[
            ["Semana clara", "Visualize distribuicao de formatos e objetivos em um plano unico."],
            ["Equilibrio", "Misture alcance, autoridade, relacionamento e venda."],
            ["Execucao", "Use o calendario como base para gerar lembretes automaticos."],
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
        <CalendarPanel />
      </main>
    </AuthGuard>
  );
}
