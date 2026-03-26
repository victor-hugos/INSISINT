import type { ReactNode } from "react";

type Highlight = {
  title: string;
  description: string;
};

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "28px 20px 48px",
  display: "grid",
  gap: 22,
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gap: 20,
};

const heroStyle: React.CSSProperties = {
  width: "100%",
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background: "linear-gradient(145deg, rgba(25,18,40,0.96), rgba(13,10,22,0.98))",
  boxShadow: "var(--shadow-soft)",
  display: "grid",
  gap: 8,
};

const highlightCardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 22,
  border: "1px solid var(--border)",
  background: "var(--bg-panel)",
  boxShadow: "var(--shadow-soft)",
  display: "grid",
  gap: 8,
};

export function AppPageLayout({
  eyebrow,
  title,
  description,
  children,
  highlights,
  maxWidth = 1120,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  highlights?: Highlight[];
  maxWidth?: number;
}) {
  return (
    <main style={wrapperStyle}>
      <div style={{ ...contentStyle, maxWidth }}>
        <section style={heroStyle}>
          <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
            {eyebrow}
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>{title}</h1>
          <p style={{ maxWidth: 760, color: "var(--muted)", fontSize: "1.05rem", margin: 0 }}>
            {description}
          </p>
        </section>

        {highlights && highlights.length > 0 ? (
          <section className="marketing-card-grid">
            {highlights.map((item) => (
              <div key={item.title} style={highlightCardStyle}>
                <strong>{item.title}</strong>
                <p style={{ margin: 0, color: "var(--muted)" }}>{item.description}</p>
              </div>
            ))}
          </section>
        ) : null}

        {children}
      </div>
    </main>
  );
}
