import { getOpenAIClient } from "@/lib/ai/openai";
import {
  diagnosisResultSchema,
  type DiagnosisResult,
  type OnboardingInput,
} from "@/types/onboarding";

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

export async function generateDiagnosis(
  input: OnboardingInput
): Promise<DiagnosisResult> {
  const openai = getOpenAIClient();
  const prompt = `
Voce e um estrategista de conteudo e crescimento para redes sociais.

Analise este perfil com base nas informacoes abaixo:

Nicho: ${input.niche}
Publico-alvo: ${input.targetAudience}
Objetivo: ${input.goal}
Tom de voz: ${input.tone}
Frequencia de postagem: ${input.postingFrequency}
Produtos/Servicos: ${input.productsServices || "Nao informado"}
Concorrentes: ${input.competitors || "Nao informado"}

Retorne APENAS JSON valido no formato:
{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "opportunities": ["..."],
  "pillars": ["..."],
  "summary": "..."
}

Regras:
- strengths: 3 itens
- weaknesses: 3 itens
- opportunities: 3 itens
- pillars: 4 a 6 pilares
- summary: um resumo objetivo e pratico
`.trim();

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const parsed = JSON.parse(extractJson(response.output_text));

  return diagnosisResultSchema.parse(parsed);
}
