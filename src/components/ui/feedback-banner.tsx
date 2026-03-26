type FeedbackTone = "error" | "success" | "info";

const toneStyles: Record<FeedbackTone, React.CSSProperties> = {
  error: {
    background: "rgba(138,47,18,0.08)",
    border: "1px solid rgba(138,47,18,0.16)",
    color: "#8a2f12",
  },
  success: {
    background: "rgba(37,98,69,0.08)",
    border: "1px solid rgba(37,98,69,0.16)",
    color: "#256245",
  },
  info: {
    background: "rgba(217,111,45,0.08)",
    border: "1px solid rgba(217,111,45,0.16)",
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
