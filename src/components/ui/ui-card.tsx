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
        borderRadius: 20,
        padding: 20,
        display: "grid",
        gap: 12,
        background: "rgba(255,255,255,0.7)",
      }}
    >
      {title ? <h2 style={{ margin: 0 }}>{title}</h2> : null}
      {children}
    </section>
  );
}
