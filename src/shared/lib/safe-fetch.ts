export async function safeFetchJson<T = any>(
  url: string,
  init: RequestInit = {},
  options: { timeoutMs?: number; retries?: number } = {},
): Promise<T> {
  const { timeoutMs = 7000, retries = 2 } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Respuesta no JSON del origen');
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error && error.name === 'AbortError'
          ? new Error('Timeout al consultar el origen')
          : error;

      // Último intento o error de timeout: salir
      if (attempt === retries) {
        break;
      }

      // Backoff lineal sencillo
      const waitMs = 300 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Error desconocido en safeFetchJson');
}
