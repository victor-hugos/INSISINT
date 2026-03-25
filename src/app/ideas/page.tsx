import { AuthGuard } from "@/components/auth-guard";
import { IdeasPanel } from "@/components/ideas-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto 24px",
};

export default function IdeasPage() {
  return (
    <AuthGuard>
      <main style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ marginBottom: 8, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 2
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Ideias de conteudo
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Gere ideias com base no onboarding e no diagnostico do perfil,
            agrupadas por objetivo de negocio.
          </p>
        </section>
        <IdeasPanel />
      </main>
    </AuthGuard>
  );
}
