'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import NewsGrid from './NewsGrid';
import SimplePagination from './SimplePagination';
import { NewsItem } from '@/shared/interfaces';
import { useResilientLoading } from '@/shared/hooks/use-resilient-loading';
import { fetchNewsService } from '../services/news';
import { useDebounce } from '@/shared/hooks/use-debounce';

export default function FetchNewsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const desde = searchParams.get('desde') || '';
  const hasta = searchParams.get('hasta') || '';

  const debouncedQ = useDebounce(q, 500);

  const cacheBuster = useMemo(() => {
    const pageGroup = Math.floor((currentPage - 1) / 5);
    const hasFilters = debouncedQ || categoria || desde || hasta;
    return hasFilters ? `filtered-${pageGroup}` : `clean-${pageGroup}`;
  }, [currentPage, debouncedQ, categoria, desde, hasta]);

  const {
    loadingState,
    isLoading,
    canRecover,
    isFallback,
    setLoading,
    handleApiResponse,
    manualRetry,
    reset,
  } = useResilientLoading({
    storageKey: `dynamic-news-${cacheBuster}`,
    enableAutoRetry: true,
    maxRetries: 3,
  });

  const fetchNews = useCallback(async () => {
    try {
      const { news, totalPages } = await fetchNewsService({
        currentPage,
        debouncedQ,
        categoria,
        desde,
        hasta,
        cacheBuster,
        setLoading,
        handleApiResponse,
      });
      setNews(news);
      setTotalPages(totalPages);
    } catch (error: any) {
      setNews([]);
      setTotalPages(1);
      console.error('Error fetching noticias:', error);
    }
  }, [
    currentPage,
    debouncedQ,
    categoria,
    desde,
    hasta,
    cacheBuster,
    setLoading,
    handleApiResponse,
  ]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/noticias?${params.toString()}`);
  };

  useEffect(() => {
    reset();
  }, [debouncedQ, categoria, desde, hasta, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D8B37]"></div>
          <div className="text-gray-500 text-center max-w-md">
            {loadingState.message}
            {loadingState.estimatedWaitTime &&
              loadingState.estimatedWaitTime > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  Tiempo estimado:{' '}
                  {Math.ceil(loadingState.estimatedWaitTime / 1000)}s
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  if (loadingState.state === 'error' && !isFallback) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">{loadingState.message}</div>
          {loadingState.canRetry && (
            <button
              onClick={manualRetry}
              className="px-6 py-3 bg-[#3D8B37] text-white rounded-md hover:bg-[#2d6b29] transition-colors"
            >
              Reintentar ({loadingState.retryCount}/3)
            </button>
          )}
        </div>
      </div>
    );
  }

  const featuredNews = news.filter((item) => item.esImportante);
  const regularNews = news.filter((item) => !item.esImportante);

  return (
    <div className="space-y-8">
      {/* Status indicators */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {news.length > 0
            ? `${news.length} noticia${news.length !== 1 ? 's' : ''} encontrada${news.length !== 1 ? 's' : ''}`
            : 'No se encontraron noticias'}
        </div>

        {/* Fallback/Cache indicator */}
        {isFallback && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            {loadingState.state === 'offline'
              ? 'Datos guardados'
              : 'Datos de respaldo'}
          </div>
        )}

        {/* Throttled indicator */}
        {loadingState.state === 'throttled' && (
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Procesando solicitudes...
          </div>
        )}

        {/* Recovery indicator */}
        {canRecover && loadingState.state === 'retrying' && (
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Reconectando... ({loadingState.retryCount}/3)
          </div>
        )}
      </div>

      {/* Grid de noticias filtradas */}
      {news.length > 0 ? (
        <>
          <NewsGrid featuredNews={featuredNews} regularNews={regularNews} />

          {/* Paginación */}
          {totalPages > 1 && (
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {loadingState.state === 'offline'
              ? 'No hay noticias guardadas con estos filtros.'
              : 'No se encontraron noticias con los filtros aplicados.'}
          </div>
          {loadingState.canRetry && loadingState.state !== 'success' && (
            <button
              onClick={manualRetry}
              className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Buscar nuevamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
