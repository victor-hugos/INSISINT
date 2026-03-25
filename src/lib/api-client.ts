export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Erro na requisicao");
  }

  return data as T;
}
