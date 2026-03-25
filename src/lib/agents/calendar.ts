import { getOpenAIClient } from "@/lib/openai";
import type { OnboardingInput } from "@/types/onboarding";
import { calendarResultSchema, type CalendarResult } from "@/types/calendar";

type IdeaReference = {
  category: string;
  title: string;
  hook: string;
  description: string | null;
};

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

export async function generateCalendar(
  input: OnboardingInput,
  savedIdeas: IdeaReference[] = []
): Promise<CalendarResult> {
  const openai = getOpenAIClient();
  const ideasSection =
    savedIdeas.length > 0
      ? `
Ideias ja existentes para esse perfil:
${savedIdeas
  .map(
    (idea, index) => `
${index + 1}. Categoria: ${idea.category}
Titulo: ${idea.title}
Hook: ${idea.hook}
Descricao: ${idea.description || ""}
`
  )
  .join("\n")}

Use essas ideias como base principal para montar o calendario.
Sempre que possivel, aproveite ideias salvas em vez de inventar novas.
`
      : `
Nao ha ideias salvas disponiveis para esse perfil.
Monte o calendario apenas com base no contexto estrategico.
`;

  const prompt = `
Voce e um estrategista de conteudo para creators, especialistas e negocios digitais.

Com base nas informacoes abaixo, crie um calendario semanal de conteudo.

Nicho: ${input.niche}
Publico-alvo: ${input.targetAudience}
Objetivo: ${input.goal}
Tom de voz: ${input.tone}
Frequencia de postagem: ${input.postingFrequency}
Produtos/Servicos: ${input.productsServices || "Nao informado"}
Concorrentes: ${input.competitors || "Nao informado"}

${ideasSection}

Retorne APENAS JSON valido no formato:
{
  "items": [
    {
      "dayOfWeek": "segunda",
      "category": "alcance",
      "contentType": "reel",
      "title": "...",
      "objective": "...",
      "notes": "...",
      "sourceIdeaTitle": "..."
    }
  ]
}

Regras:
- gerar entre 5 e 7 itens
- usar apenas os dias: segunda, terca, quarta, quinta, sexta, sabado, domingo
- category deve ser apenas: alcance, autoridade, venda ou relacionamento
- contentType pode ser: reel, carrossel, story, post, live, short, video
- objective deve explicar o objetivo daquele conteudo
- notes deve trazer uma instrucao pratica de execucao
- sourceIdeaTitle deve conter o titulo da ideia usada quando houver aproveitamento
- se criar algo novo sem ideia salva correspondente, use sourceIdeaTitle como string vazia
- o calendario precisa parecer equilibrado e estrategico
`.trim();

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const parsed = JSON.parse(extractJson(response.output_text));

  return calendarResultSchema.parse(parsed);
}
