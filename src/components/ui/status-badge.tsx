import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneMap: Record<Tone, React.CSSProperties> = {
  neutral: {
    background: "rgba(76,43,14,0.08)",
    color: "var(--text)",
    border: "1px solid rgba(76,43,14,0.1)",
  },
  success: {
    background: "rgba(37,98,69,0.12)",
    color: "#256245",
    border: "1px solid rgba(37,98,69,0.18)",
  },
  warning: {
    background: "rgba(140,90,34,0.12)",
    color: "#8c5a22",
    border: "1px solid rgba(140,90,34,0.18)",
  },
  danger: {
    background: "rgba(138,47,18,0.12)",
    color: "#8a2f12",
    border: "1px solid rgba(138,47,18,0.18)",
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
