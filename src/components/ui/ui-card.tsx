import type { ReactNode } from "react";

export function UICard({
  title,
  children,
  noPadding = false,
}: {
  title?: string;
  children: ReactNode;
  noPadding?: boolean;
}) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: noPadding ? 0 : 20,
        display: "grid",
        gap: 16,
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-sm)",
        overflow: noPadding ? "hidden" : undefined,
      }}
    >
      {title ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}
