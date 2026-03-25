import { apiRequest } from "@/lib/api-client";
import type { ContentIdea, IdeasResult, IdeaStatus } from "@/types/ideas";
import type { ScriptResult } from "@/types/scripts";

type IdeasPayload = Record<string, unknown>;

export async function generateIdeasRequest(payload: IdeasPayload) {
  return apiRequest<{ result: IdeasResult }>("/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function listIdeas(profileId: string) {
  return apiRequest<{ ideas: ContentIdea[] }>(
    `/api/ideas/list?profileId=${encodeURIComponent(profileId)}`
  );
}

export async function updateIdeaStatusRequest(payload: {
  ideaId: string;
  profileId: string;
  status: IdeaStatus;
}) {
  return apiRequest<{ idea: ContentIdea }>("/api/ideas/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function generateScriptFromIdeaRequest(payload: IdeasPayload) {
  return apiRequest<{ result: ScriptResult }>("/api/ideas/generate-script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
