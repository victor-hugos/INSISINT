import type { ReactNode } from "react";

export function UICard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: 22,
        display: "grid",
        gap: 14,
        background: "var(--bg-panel)",
        boxShadow: "var(--shadow-soft), var(--glow)",
        backdropFilter: "blur(10px)",
      }}
    >
      {title ? (
        <div style={{ display: "grid", gap: 6 }}>
          <p
            style={{
              margin: 0,
              color: "var(--accent-strong)",
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Painel
          </p>
          <h2 style={{ margin: 0 }}>{title}</h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}
