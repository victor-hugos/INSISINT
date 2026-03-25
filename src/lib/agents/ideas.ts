import { getOpenAIClient } from "@/lib/openai";
import type { OnboardingInput } from "@/types/onboarding";
import { ideasResultSchema, type IdeasResult } from "@/types/ideas";

function extractJson(raw: string) {
  const trimmed = raw.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "");
  }

  return trimmed;
}

export async function generateIdeas(
  input: OnboardingInput
): Promise<IdeasResult> {
  const openai = getOpenAIClient();
  const prompt = `
Voce e um estrategista de conteudo para creators e especialistas.

Com base nas informacoes abaixo, gere 12 ideias de conteudo para redes sociais.

Nicho: ${input.niche}
Publico-alvo: ${input.targetAudience}
Objetivo: ${input.goal}
Tom de voz: ${input.tone}
Frequencia de postagem: ${input.postingFrequency}
Produtos/Servicos: ${input.productsServices || "Nao informado"}
Concorrentes: ${input.competitors || "Nao informado"}

Distribua as ideias entre as categorias:
- alcance
- autoridade
- venda
- relacionamento

Retorne APENAS JSON valido no formato:
{
  "ideas": [
    {
      "category": "alcance",
      "title": "...",
      "hook": "...",
      "description": "..."
    }
  ]
}

Regras:
- gerar exatamente 12 ideias
- category deve ser apenas: alcance, autoridade, venda ou relacionamento
- title deve ser curto e forte
- hook deve chamar atencao logo no inicio
- description deve explicar rapidamente a proposta do conteudo
`.trim();

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const parsed = JSON.parse(extractJson(response.output_text));

  return ideasResultSchema.parse(parsed);
}
