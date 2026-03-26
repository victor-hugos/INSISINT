type FeedbackTone = "error" | "success" | "info";

const toneStyles: Record<FeedbackTone, React.CSSProperties> = {
  error: {
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.18)",
    color: "#fda4af",
  },
  success: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.18)",
    color: "#86efac",
  },
  info: {
    background: "rgba(139,92,246,0.1)",
    border: "1px solid rgba(139,92,246,0.18)",
    color: "var(--accent-strong)",
  },
};

export function FeedbackBanner({
  message,
  tone,
}: {
  message: string;
  tone: FeedbackTone;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 18,
        fontWeight: 600,
        ...toneStyles[tone],
      }}
    >
      {message}
    </div>
  );
}
