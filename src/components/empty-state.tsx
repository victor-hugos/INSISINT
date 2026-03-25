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
        borderRadius: 20,
        padding: 24,
        display: "grid",
        gap: 10,
        background: "rgba(255,255,255,0.6)",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref} style={{ fontWeight: 700, color: "var(--accent-strong)" }}>
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
