export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (typeof data === "string") {
      throw new Error(data || "Erro na requisicao");
    }

    throw new Error(data?.error || data?.details || "Erro na requisicao");
  }

  return data as T;
}
