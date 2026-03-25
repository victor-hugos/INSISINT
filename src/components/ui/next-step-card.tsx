import Link from "next/link";

import { UICard } from "@/components/ui/ui-card";

export function NextStepCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <UICard title={title}>
      <p style={{ margin: 0, color: "var(--muted)" }}>{description}</p>
      <Link href={href} style={{ fontWeight: 700, color: "var(--accent-strong)" }}>
        {label}
      </Link>
    </UICard>
  );
}
