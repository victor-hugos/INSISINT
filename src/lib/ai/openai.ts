import OpenAI from "openai";
import { getServerEnv } from "@/lib/config/env";

export function getOpenAIClient() {
  const env = getServerEnv();

  return new OpenAI({
    apiKey: env.groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export const AI_MODEL = "llama-3.3-70b-versatile";
