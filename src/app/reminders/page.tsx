import { AuthGuard } from "@/components/auth-guard";
import { RemindersPanel } from "@/components/reminders-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto 24px",
};

export default function RemindersPage() {
  return (
    <AuthGuard>
      <main style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ marginBottom: 8, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 5
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Lembretes
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Organize alertas importantes da rotina de conteudo e deixe a base
            pronta para futuras notificacoes reais.
          </p>
        </section>
        <RemindersPanel />
      </main>
    </AuthGuard>
  );
}
