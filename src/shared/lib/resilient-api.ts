import { PERFORMANCE_CONFIG } from './config';

export interface SimpleFetchOptions extends RequestInit {
  timeout?: number;
  fallbackData?: any;
  cacheKey?: string; // Mantener para compatibilidad, pero ignorado
  retries?: number; // Mantener para compatibilidad, pero ignorado
}

export interface ApiResponse<T = any> {
  data: T;
  status: 'success' | 'fallback' | 'error';
}

// Simple fetch wrapper without rate limiting or circuit breaker
async function simpleFetch<T = any>(
  url: string,
  options: SimpleFetchOptions = {},
): Promise<ApiResponse<T>> {
  const { 
    timeout = PERFORMANCE_CONFIG.API_TIMEOUT, 
    fallbackData, 
    cacheKey, // Ignorado en esta implementación simple
    retries, // Ignorado en esta implementación simple
    ...fetchOptions 
  } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      data,
      status: 'success' as const,
    };
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);

    if (fallbackData !== undefined) {
      return {
        data: fallbackData,
        status: 'fallback' as const,
      };
    }

    return {
      data: fallbackData || null as T,
      status: 'error' as const,
    };
  }
}

// Export the simple fetch function with the same interface as resilientFetch
export const resilientFetch = simpleFetch;
