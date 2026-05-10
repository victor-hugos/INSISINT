import type { ReactNode } from "react";

type Highlight = {
  title: string;
  description: string;
};

export function AppPageLayout({
  eyebrow,
  title,
  description,
  children,
  highlights,
  maxWidth = 1120,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  highlights?: Highlight[];
  maxWidth?: number;
}) {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth, width: "100%" }}>

      {/* Cabeçalho da página */}
      <div className="page-header">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>

      {/* Cards de destaque */}
      {highlights && highlights.length > 0 && (
        <div className="highlight-grid">
          {highlights.map((item) => (
            <div key={item.title} className="highlight-card">
              <p className="highlight-card-title">{item.title}</p>
              <p className="highlight-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo principal */}
      {children}
    </div>
  );
}
