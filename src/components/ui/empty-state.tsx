import Link from "next/link";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 24,
        padding: 28,
        display: "grid",
        gap: 12,
        background: "var(--bg-panel)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "var(--accent-strong)",
          fontSize: "0.78rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Estado vazio
      </p>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          style={{
            width: "fit-content",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.8)",
            fontWeight: 700,
            color: "var(--accent-strong)",
          }}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
