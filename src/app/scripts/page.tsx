import { AuthGuard } from "@/components/auth/auth-guard";
import { ScriptsPanel } from "@/components/modules/scripts-panel";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px 20px 40px",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto 24px",
};

export default function ScriptsPage() {
  return (
    <AuthGuard>
      <main style={wrapperStyle}>
        <section style={headerStyle}>
          <p style={{ marginBottom: 8, color: "var(--accent-strong)", fontWeight: 700 }}>
            Etapa 3
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Gerar roteiro
          </h1>
          <p style={{ maxWidth: 740, color: "var(--muted)", fontSize: "1.05rem" }}>
            Transforme uma ideia em um roteiro curto, publicavel e alinhado ao
            objetivo do perfil.
          </p>
        </section>
        <ScriptsPanel />
      </main>
    </AuthGuard>
  );
}
