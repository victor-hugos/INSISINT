import OpenAI from "openai";
import { getServerEnv } from "@/lib/config/env";

export function getOpenAIClient() {
  const env = getServerEnv();

  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
}
