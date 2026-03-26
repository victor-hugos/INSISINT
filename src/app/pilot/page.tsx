import Link from "next/link";

import { UICard } from "@/components/ui/ui-card";

const shellStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
  display: "grid",
  gap: 20,
};

const heroStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 28,
  borderRadius: 28,
  border: "1px solid var(--border)",
  background:
    "linear-gradient(145deg, rgba(26,19,42,0.96), rgba(14,11,24,0.98))",
  boxShadow: "var(--shadow)",
};

const ctaStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "fit-content",
  padding: "14px 18px",
  borderRadius: 16,
  background: "var(--accent)",
  color: "#f8f5ff",
  fontWeight: 700,
};

export default function PilotPage() {
  return (
    <div style={shellStyle}>
      <section style={heroStyle}>
        <p style={{ margin: 0, color: "var(--accent-strong)", fontWeight: 700 }}>
          Piloto INSISINT
        </p>
        <h1 style={{ margin: 0 }}>Sua equipe de social media com IA</h1>
        <p style={{ margin: 0, maxWidth: 680, color: "var(--muted)" }}>
          Organize ideias, escolha o que realmente entra na semana, monte
          calendario e acompanhe execucao em um so lugar.
        </p>
        <Link href="/pilot/apply" style={ctaStyle}>
          Quero entrar no piloto
        </Link>
      </section>

      <UICard title="Para quem e">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>Creators iniciantes</li>
          <li>Pequenos influenciadores</li>
          <li>Especialistas e autonomos</li>
          <li>Perfis que precisam de consistencia</li>
        </ul>
      </UICard>

      <UICard title="O que voce consegue fazer">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>Gerar ideias de conteudo alinhadas ao perfil</li>
          <li>Aprovar so o que faz sentido</li>
          <li>Selecionar ideias da semana</li>
          <li>Montar calendario</li>
          <li>Criar lembretes</li>
          <li>Acompanhar execucao</li>
        </ul>
      </UICard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <UICard title="Clareza">
          <p style={{ margin: 0 }}>
            Saiba o que postar e por que aquilo faz sentido para o seu perfil.
          </p>
        </UICard>

        <UICard title="Organizacao">
          <p style={{ margin: 0 }}>
            Escolha a semana, transforme em calendario e pare de depender de
            improviso.
          </p>
        </UICard>

        <UICard title="Execucao">
          <p style={{ margin: 0 }}>
            Use lembretes e dashboard para acompanhar consistencia de verdade.
          </p>
        </UICard>
      </div>

      <UICard title="Entre no piloto">
        <p style={{ margin: 0 }}>
          Quer testar a versao inicial com acompanhamento e ajudar a moldar o
          produto?
        </p>
        <Link href="/pilot/apply">Quero entrar no piloto</Link>
      </UICard>
    </div>
  );
}
