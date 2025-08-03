import { useState, useCallback, useRef } from 'react';

interface SearchParams {
  q?: string;
  categoria?: string;
  desde?: string;
  hasta?: string;
  page?: number;
  pageSize?: number;
}

interface NewsSearchResult {
  data: Array<{
    id: number;
    titulo: string;
    resumen: string;
    fecha: string;
    categoria: string;
    esImportante: boolean;
    slug: string;
    portada?: {
      url: string | null;
      title?: string;
      width?: number;
      height?: number;
    } | null;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    timestamp: string;
    cached: boolean;
    searchParams: SearchParams;
  };
}

interface UseNewsSearchReturn {
  results: NewsSearchResult | null;
  loading: boolean;
  error: string | null;
  search: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
  retry: () => void;
}

// Cache simple en memoria para la sesión
const sessionCache = new Map<
  string,
  { data: NewsSearchResult; timestamp: number }
>();
const CACHE_TTL = 30 * 1000; // 30 segundos

function getCacheKey(params: SearchParams): string {
  const normalized = {
    q: params.q || '',
    categoria: params.categoria || '',
    desde: params.desde || '',
    hasta: params.hasta || '',
    page: params.page || 1,
    pageSize: params.pageSize || 6,
  };
  return JSON.stringify(normalized);
}

function getCachedResult(key: string): NewsSearchResult | null {
  const cached = sessionCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, meta: { ...cached.data.meta, cached: true } };
  }
  if (cached) {
    sessionCache.delete(key);
  }
  return null;
}

function setCachedResult(key: string, data: NewsSearchResult): void {
  // Limitar el tamaño del cache
  if (sessionCache.size > 10) {
    const firstKey = sessionCache.keys().next().value;
    if (firstKey) sessionCache.delete(firstKey);
  }
  sessionCache.set(key, { data, timestamp: Date.now() });
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.ok) {
        return response;
      }

      // Si es rate limit (429), esperar más tiempo
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('retry-after') || '60',
          10,
        );
        const waitTime = Math.min(retryAfter * 1000, attempt * 2000);

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
      }

      // Para otros errores HTTP, lanzar inmediatamente
      if (response.status >= 400) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Error desconocido');

      // No reintentar en errores que no son de red
      if (lastError.name !== 'TypeError' && attempt < maxRetries) {
        // Backoff exponencial
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  throw (
    lastError || new Error('Error en la búsqueda después de varios intentos')
  );
}

export function useNewsSearch(): UseNewsSearchReturn {
  const [results, setResults] = useState<NewsSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSearchParams = useRef<SearchParams>({});
  const abortController = useRef<AbortController | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    // Validar que hay al menos un parámetro de búsqueda
    if (!params.q && !params.categoria && !params.desde && !params.hasta) {
      setError('Al menos un parámetro de búsqueda es requerido.');
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (abortController.current) {
      abortController.current.abort();
    }

    // Crear nuevo controller para esta búsqueda
    abortController.current = new AbortController();

    // Guardar parámetros para retry
    lastSearchParams.current = params;

    // Verificar cache
    const cacheKey = getCacheKey(params);
    const cachedResult = getCachedResult(cacheKey);

    if (cachedResult) {
      setResults(cachedResult);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Construir URL de búsqueda
      const searchUrl = new URL('/api/noticias/search', window.location.origin);

      if (params.q) searchUrl.searchParams.set('q', params.q);
      if (params.categoria)
        searchUrl.searchParams.set('categoria', params.categoria);
      if (params.desde) searchUrl.searchParams.set('desde', params.desde);
      if (params.hasta) searchUrl.searchParams.set('hasta', params.hasta);
      if (params.page)
        searchUrl.searchParams.set('page', params.page.toString());
      if (params.pageSize)
        searchUrl.searchParams.set('pageSize', params.pageSize.toString());

      // Realizar búsqueda con retry
      const response = await fetchWithRetry(searchUrl.toString(), {
        signal: abortController.current.signal,
      });

      const result: NewsSearchResult = await response.json();

      // Cachear resultado
      setCachedResult(cacheKey, result);

      setResults(result);
      setError(null);
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        // No mostrar error si fue cancelado
        if (fetchError.name === 'AbortError') {
          return;
        }

        // Errores específicos con mensajes amigables
        if (fetchError.message.includes('429')) {
          setError(
            'Demasiadas búsquedas. Por favor, espera un momento antes de intentar de nuevo.',
          );
        } else if (
          fetchError.message.includes('502') ||
          fetchError.message.includes('503')
        ) {
          setError(
            'Servicio temporalmente no disponible. Inténtalo de nuevo en unos momentos.',
          );
        } else if (
          fetchError.message.includes('Failed to fetch') ||
          fetchError.name === 'TypeError'
        ) {
          setError(
            'Error de conexión. Verifica tu internet e inténtalo de nuevo.',
          );
        } else {
          setError(fetchError.message || 'Error al realizar la búsqueda.');
        }
      } else {
        setError('Error desconocido al realizar la búsqueda.');
      }

      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);

    // Cancelar búsqueda en curso si existe
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const retry = useCallback(() => {
    if (lastSearchParams.current) {
      search(lastSearchParams.current);
    }
  }, [search]);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
    retry,
  };
}

export type { SearchParams, NewsSearchResult };
