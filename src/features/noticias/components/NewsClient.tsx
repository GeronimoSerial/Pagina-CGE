'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import NewsGrid from './NewsGrid';
import NewsSearch from './Search';
import SimplePagination from './SimplePagination';
import { Noticia } from '@/shared/interfaces';

// Hook optimizado para debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface NewsClientProps {}

export default function NewsClient({}: NewsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [destacadas, setDestacadas] = useState<Noticia[]>([]);
  const [categorias, setCategorias] = useState<
    Array<{ id: number; nombre: string }>
  >([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const desde = searchParams.get('desde') || '';
  const hasta = searchParams.get('hasta') || '';

  // Ultra-aggressive debouncing for load testing
  const debouncedQ = useDebounce(q, 500); // Increased from 300ms

  // Simplified cache key - reduce uniqueness for better cache hits
  const cacheBuster = useMemo(() => {
    // Group pages to reduce cache fragmentation
    const pageGroup = Math.floor((currentPage - 1) / 5);
    const hasFilters = debouncedQ || categoria || desde || hasta;
    return hasFilters ? `filtered-${pageGroup}` : `clean-${pageGroup}`;
  }, [currentPage, debouncedQ, categoria, desde, hasta]);

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Ultra-optimized request with timeout and retry-friendly headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const noticiasRes = await fetch(
        `/api/noticias?${new URLSearchParams({
          page: String(currentPage),
          ...(debouncedQ && { q: debouncedQ }),
          ...(categoria && { categoria }),
          ...(desde && { desde }),
          ...(hasta && { hasta }),
          _cache: cacheBuster,
        }).toString()}`,
        {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'max-age=90', // Browser cache hint
          },
        },
      );

      clearTimeout(timeoutId);

      if (!noticiasRes.ok) {
        throw new Error(
          `HTTP ${noticiasRes.status}: Error al cargar las noticias`,
        );
      }

      const noticiasData = await noticiasRes.json();

      const mapeadas: Noticia[] = noticiasData.noticias.map((noticia: any) => ({
        id: noticia.id,
        autor: noticia.autor || 'Redacción CGE',
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        categoria: noticia.categoria,
        esImportante: noticia.esImportante || false,
        portada: noticia.portada || { url: '' },
        slug: noticia.slug,
        contenido: noticia.contenido || '',
        imagen: noticia.imagen || [],
        publicado: noticia.publicado || true,
        fecha: noticia.fecha,
        metaTitle: noticia.metaTitle || noticia.titulo,
        metaDescription: noticia.metaDescription || noticia.resumen,
        createdAt: noticia.createdAt,
        updatedAt: noticia.updatedAt,
      }));

      const dest = mapeadas
        .filter((noticia) => noticia.esImportante)
        .slice(0, 3);

      const idsDests = new Set(dest.map((n) => n.id));
      const regulares = mapeadas.filter((noticia) => !idsDests.has(noticia.id));

      setDestacadas(dest);
      setNoticias(regulares);
      setTotalPages(noticiasData.totalPages || 1);
    } catch (err) {
      console.error('News fetch error:', err);
      // More specific error handling for load testing
      const error = err as Error;
      const isRetryingRef = useRef(false);
      if (error.name === 'AbortError') {
        setError('Tiempo de espera agotado - servidor sobrecargado');
      } else if (error.message?.includes('HTTP 5') && !isRetryingRef.current) {
        isRetryingRef.current = true;
        // Retry logic for server errors
        // console.warn('Retrying fetch due to server error...');

        setError('Error del servidor - reintentando automáticamente...');
        // Auto-retry on server errors with exponential backoff
        setTimeout(() => {
          isRetryingRef.current = false;
          if (!loading) fetchNoticias();
        }, 2000);
      } else {
        setError(error.message || 'Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedQ, categoria, desde, hasta, cacheBuster]);

  
  // Separate effect for categories to avoid unnecessary refetches
  useEffect(() => {
    if (categorias.length === 0) {
      fetch(`/api/noticias/categorias?_cache=static`)
        .then((res) => res.json())
        .then((data) => setCategorias(data.categorias || []))
        .catch(() => {}); // Silent fail for categories
    }
  }, []);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/noticias?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D8B37]"></div>
          <div className="text-gray-500">Cargando noticias...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error: {error}</div>
          <button
            onClick={fetchNoticias}
            className="px-4 py-2 bg-[#3D8B37] text-white rounded-md hover:bg-[#2d6b29] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const searchBar = (
    <div className="px-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <NewsSearch
            categorias={categorias}
            placeholder="Buscar noticias institucionales..."
          />
        </div>
      </div>
    </div>
  );

  if (!loading && noticias.length === 0 && destacadas.length === 0) {
    return (
      <>
        {searchBar}
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-gray-500 mb-2">No se encontraron noticias</div>
            <div className="text-sm text-gray-400">
              Prueba cambiando los filtros de búsqueda
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {searchBar}
      <NewsGrid noticiasDestacadas={destacadas} noticiasRegulares={noticias} />
      {totalPages > 1 && (
        <SimplePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </>
  );
}
