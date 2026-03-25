import { AuthGuard } from "@/components/auth/auth-guard";
import { CalendarPanel } from "@/components/modules/calendar-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto 24px",
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
        <CalendarPanel />
      </main>
    </AuthGuard>
  );
}
