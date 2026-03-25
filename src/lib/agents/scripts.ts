import { getOpenAIClient } from "@/lib/ai/openai";
import { scriptResultSchema, type ScriptInput, type ScriptResult } from "@/types/scripts";

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

export async function generateScript(
  input: ScriptInput
): Promise<ScriptResult> {
  const openai = getOpenAIClient();
  const prompt = `
Voce e um estrategista de conteudo e copywriter para redes sociais.

Crie um roteiro curto e pratico para um conteudo de creator ou especialista.

Contexto:
Nicho: ${input.niche}
Publico-alvo: ${input.targetAudience}
Objetivo: ${input.goal}
Tom de voz: ${input.tone}
Frequencia de postagem: ${input.postingFrequency}
Produtos/Servicos: ${input.productsServices || "Nao informado"}
Concorrentes: ${input.competitors || "Nao informado"}

Ideia escolhida:
Categoria: ${input.category}
Titulo: ${input.title}
Hook base: ${input.hookBase}
Descricao: ${input.description}

Retorne APENAS JSON valido no formato:
{
  "hook": "...",
  "development": "...",
  "cta": "...",
  "caption": "..."
}

Regras:
- hook deve ser forte e direto
- development deve ser curto, claro e pronto para video curto ou reel
- cta deve combinar com o objetivo
- caption deve ser natural e publicavel
`.trim();

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const parsed = JSON.parse(extractJson(response.output_text));

  return scriptResultSchema.parse(parsed);
}
