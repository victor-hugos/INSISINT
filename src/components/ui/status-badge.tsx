import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneMap: Record<Tone, React.CSSProperties> = {
  neutral: {
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
  success: {
    background: "rgba(34,197,94,0.1)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.16)",
  },
  warning: {
    background: "rgba(250,204,21,0.1)",
    color: "#fde68a",
    border: "1px solid rgba(250,204,21,0.16)",
  },
  danger: {
    background: "rgba(248,113,113,0.1)",
    color: "#fda4af",
    border: "1px solid rgba(248,113,113,0.16)",
  },
  accent: {
    background: "var(--accent-soft)",
    color: "var(--accent-strong)",
    border: "1px solid rgba(217,111,45,0.16)",
  },
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: "fit-content",
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: "0.9rem",
        ...toneMap[tone],
      }}
    >
      {children}
    </span>
  );
}
