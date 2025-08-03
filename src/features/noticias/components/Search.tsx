'use client';

import { Button } from '@/shared/ui/button';
import { Calendar, ChevronDown, Filter, Search, Tag, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  useNewsSearch,
  SearchParams,
} from '@/features/noticias/hooks/useNewsSearch';
import { useSearchCleaner } from '@/features/noticias/hooks/useSearchCleaner';
import NewsResultsSkeleton from '@/features/noticias/components/ui/NewsResultsSkeleton';
import { NewsCard } from './ui/NewsCard';

interface NewsSearchProps {
  categorias: Array<{ id: number; nombre: string }>;
  onSearchResults?: (results: any) => void;
  // showResults?: boolean;
}

export default function NewsSearch({
  categorias,
  onSearchResults,
  // showResults = false,
}: NewsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, loading, error, search, clearResults, retry } =
    useNewsSearch();

  const [filtros, setFiltros] = useState({
    q: '',
    categoria: '',
    desde: '',
    hasta: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Detectar si hay filtros activos para decidir si mostrar resultados
  const hasActiveFilters = Boolean(
    searchParams.get('q') ||
      searchParams.get('categoria') ||
      searchParams.get('desde') ||
      searchParams.get('hasta'),
  );

  // Mostrar resultados solo si showResults es true Y hay filtros activos
  const shouldShowResults = hasActiveFilters;

  // Determinar modo basado en props y filtros activos
  const currentSearchMode = shouldShowResults ? 'api' : 'navigation';

  // Hook para limpiar filtros automáticamente
  const { clearAllAndNavigate } = useSearchCleaner({
    onClearFilters: () => {
      setFiltros({
        q: '',
        categoria: '',
        desde: '',
        hasta: '',
      });
      clearResults();
    },
  });

  useEffect(() => {
    setFiltros({
      q: searchParams.get('q') || '',
      categoria: searchParams.get('categoria') || '',
      desde: searchParams.get('desde') || '',
      hasta: searchParams.get('hasta') || '',
    });
  }, [searchParams]);

  const handleSearch = useCallback(async () => {
    if (shouldShowResults) {
      // Modo API - búsqueda con resultados en componente
      const searchParams: SearchParams = {
        q: filtros.q || undefined,
        categoria: filtros.categoria || undefined,
        desde: filtros.desde || undefined,
        hasta: filtros.hasta || undefined,
        page: 1,
        pageSize: 6,
      };

      await search(searchParams);

      // Notificar al componente padre si hay callback
      if (onSearchResults && results) {
        onSearchResults(results);
      }
    } else {
      // Modo navegación - comportamiento original
      const params = new URLSearchParams();
      if (filtros.q) params.set('q', filtros.q);
      if (filtros.categoria) params.set('categoria', filtros.categoria);
      if (filtros.desde) params.set('desde', filtros.desde);
      if (filtros.hasta) params.set('hasta', filtros.hasta);
      params.set('page', '1');

      router.push(`/noticias?${params.toString()}`);
    }
  }, [filtros, router, shouldShowResults, search, onSearchResults, results]);

  useEffect(() => {
    if (filtros.categoria) {
      if (!shouldShowResults) {
        // Solo navegación automática cuando NO está en modo búsqueda
        const params = new URLSearchParams();
        if (filtros.q) params.set('q', filtros.q);
        if (filtros.categoria) params.set('categoria', filtros.categoria);
        if (filtros.desde) params.set('desde', filtros.desde);
        if (filtros.hasta) params.set('hasta', filtros.hasta);
        params.set('page', '1');
        router.push(`/noticias?${params.toString()}`);
      }
      // En modo API, no hacer búsqueda automática - esperar que el usuario presione buscar
    }
  }, [filtros.categoria, router, shouldShowResults]);

  // Efecto para ejecutar búsqueda automática SOLO al cargar página con filtros por primera vez
  useEffect(() => {
    if (shouldShowResults) {
      const hasActiveFilters =
        filtros.q || filtros.categoria || filtros.desde || filtros.hasta;

      if (hasActiveFilters) {
        const searchParams: SearchParams = {
          q: filtros.q || undefined,
          categoria: filtros.categoria || undefined,
          desde: filtros.desde || undefined,
          hasta: filtros.hasta || undefined,
          page: 1,
          pageSize: 6,
        };
        search(searchParams);
      }
    }
  }, [shouldShowResults]); // Solo cuando cambia shouldShowResults, no cuando cambian los filtros

  const handleInputChange = (field: string, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  const clearIndividualFilter = (field: string) => {
    const newFiltros = { ...filtros, [field]: '' };
    setFiltros(newFiltros);

    if (shouldShowResults) {
      // En modo API, simplemente actualizar estado
      if (Object.values(newFiltros).every((v) => !v)) {
        clearResults();
        if (onSearchResults) {
          onSearchResults(null);
        }
      }
    } else {
      // Modo navegación (comportamiento original)
      const params = new URLSearchParams(searchParams.toString());
      params.delete(field);
      const allEmpty = Object.entries(newFiltros).every(([, v]) => !v);
      if (allEmpty) {
        router.push('/noticias');
      } else {
        router.push(`/noticias?${params.toString()}`);
      }
    }
  };

  const clearAll = () => {
    clearAllAndNavigate();
    if (onSearchResults) {
      onSearchResults(null);
    }
  };

  const activeFiltersCount = [
    filtros.categoria,
    filtros.desde,
    filtros.hasta,
  ].filter(Boolean).length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const urlQuery = searchParams.get('q') || '';
  const hasPendingSearch = filtros.q !== urlQuery && filtros.q.length > 0;

  return (
    <>
      <div
        className="flex justify-center py-3 px-1 min-h-[60px]"
        style={{ minHeight: 60 }}
      >
        <div className="w-full max-w-[700px] p-2 rounded-lg bg-white border border-slate-200 transition-shadow duration-300 shadow-md">
          {/* Mobile-specific design */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-700 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={'Buscar noticias...'}
                value={filtros.q}
                onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
                onKeyDown={handleKeyDown}
                className="h-10 w-full pl-9 pr-10 text-sm rounded-md border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden shadow-2xs"
                autoFocus
                disabled={loading}
              />
              <Button
                onClick={() => clearIndividualFilter('q')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
                style={{ minWidth: 28, minHeight: 28 }}
                tabIndex={-1}
                aria-label="Limpiar búsqueda"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className={`flex-1 h-10 px-3 rounded-md text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden ${
                  hasPendingSearch
                    ? 'text-white bg-[#2d6b29] hover:bg-[#1f4d1c]'
                    : 'text-white bg-[#3D8B37] hover:bg-[#2d6b29]'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={loading}
                className="flex gap-1 items-center h-10 px-3 rounded-md text-sm font-medium text-[#3D8B37] bg-[#F3F4F6] border border-[#3D8B37]/20 hover:bg-[#e5e7eb] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden"
                aria-expanded={showAdvanced}
              >
                Filtros
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAll}
                disabled={loading}
                className="h-10 px-2 rounded-md border border-slate-300 text-sm text-slate-600 hover:text-[#3D8B37] hover:border-[#3D8B37]/50 hover:bg-[#F3F4F6] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Desktop-specific design */}
          <div className="hidden md:flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-700 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={'Buscar noticias...'}
                value={filtros.q}
                onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="h-9 w-full pl-9 pr-10 text-sm rounded-md border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden shadow-2xs disabled:opacity-50"
                autoFocus
              />
              <Button
                onClick={() => clearIndividualFilter('q')}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200 opacity-0 focus:opacity-100 disabled:opacity-25"
                style={{ minWidth: 28, minHeight: 28 }}
                tabIndex={-1}
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-row md:flex-row gap-2 items-center md:ml-1">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className={`flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px] ${
                  hasPendingSearch
                    ? 'text-white bg-[#2d6b29] hover:bg-[#1f4d1c]'
                    : 'text-white bg-[#3D8B37] hover:bg-[#2d6b29]'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ minHeight: 36 }}
                title={
                  hasPendingSearch
                    ? 'Presiona ENTER o haz clic para buscar'
                    : 'Buscar'
                }
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">
                  {loading ? 'Buscando...' : 'Buscar'}
                </span>
                {hasPendingSearch && !loading && (
                  <div className="ml-1 w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
                )}
              </Button>
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={loading}
                className="flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium text-[#3D8B37] bg-[#F3F4F6] border border-[#3D8B37]/20 hover:bg-[#e5e7eb] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px] disabled:opacity-50"
                style={{ minHeight: 36 }}
                aria-expanded={showAdvanced}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden md:inline">Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold text-white bg-[#3D8B37] rounded-full min-w-[16px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </Button>
              {(activeFiltersCount > 0 || filtros.q) && (
                <button
                  onClick={clearAll}
                  disabled={loading}
                  className="flex gap-1 items-center h-9 px-2 rounded-md border border-slate-300 text-xs text-slate-600 hover:text-[#3D8B37] hover:border-[#3D8B37]/50 hover:bg-[#F3F4F6] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minHeight: 36 }}
                >
                  <X className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>
          </div>
          <div
            className={`transition-all duration-300 ease-out overflow-visible ${showAdvanced ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
            style={{ willChange: 'max-height' }}
          >
            <div className="border-t border-slate-200 pt-3">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
                <div className="flex-1 min-w-0">
                  <label className="block mb-1 text-xs font-medium text-slate-700">
                    <Calendar className="inline mr-1 w-3 h-3" />
                    Desde
                  </label>
                  <input
                    type="date"
                    value={filtros.desde || ''}
                    onChange={(e) => handleInputChange('desde', e.target.value)}
                    disabled={loading}
                    className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden disabled:opacity-50"
                    style={{ minHeight: 32, maxWidth: '100%' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block mb-1 text-xs font-medium text-slate-700">
                    <Calendar className="inline mr-1 w-3 h-3" />
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={filtros.hasta || ''}
                    onChange={(e) => handleInputChange('hasta', e.target.value)}
                    disabled={loading}
                    className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden disabled:opacity-50"
                    style={{ minHeight: 32, maxWidth: '100%' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block mb-1 text-xs font-medium text-slate-700">
                    <Tag className="inline mr-1 w-3 h-3" />
                    Categoría
                  </label>
                  <select
                    value={filtros.categoria}
                    onChange={(e) =>
                      handleInputChange('categoria', e.target.value)
                    }
                    disabled={loading}
                    className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden disabled:opacity-50"
                    style={{ minHeight: 32, maxWidth: '100%' }}
                  >
                    <option value="">Todas</option>
                    {categorias
                      .filter(
                        (categoria, index, self) =>
                          index ===
                          self.findIndex((c) => c.nombre === categoria.nombre),
                      )
                      .map((categoria) => (
                        <option
                          key={`categoria-${categoria.id}-${categoria.nombre}`}
                          value={categoria.nombre}
                        >
                          {categoria.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de resultados de búsqueda (solo si hay filtros activos) */}
      {shouldShowResults && (
        <div className="mt-6">
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
                <Button
                  onClick={retry}
                  className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 transition-colors"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              <div className="text-center text-slate-600 text-sm mb-4">
                Buscando noticias...
              </div>
              <NewsResultsSkeleton count={6} />
            </div>
          )}

          {/* Resultados */}
          {results && !loading && (
            <div className="space-y-6">
              {/* Información de resultados */}
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm">
                  {results.pagination.totalItems > 0 ? (
                    <>
                      Mostrando{' '}
                      {(results.pagination.currentPage - 1) *
                        results.pagination.pageSize +
                        1}{' '}
                      -{' '}
                      {Math.min(
                        results.pagination.currentPage *
                          results.pagination.pageSize,
                        results.pagination.totalItems,
                      )}{' '}
                      de {results.pagination.totalItems} resultados
                    </>
                  ) : (
                    'No se encontraron noticias que coincidan con tu búsqueda.'
                  )}
                </p>
                {/* {results.meta.cached && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    
                  </span>
                )} */}
              </div>

              {/* Grid de noticias */}
              {results.data.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.data.map((noticia: any) => (
                    <NewsCard key={noticia.id} noticia={noticia} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No se encontraron noticias
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Intenta ajustar tus filtros o términos de búsqueda.
                  </p>
                  <Button
                    onClick={clearAll}
                    className="bg-[#3D8B37] text-white hover:bg-[#2d6b29]"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}

              {/* Paginación (básica) */}
              {results.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pt-6">
                  <Button
                    onClick={() => {
                      const newPage = Math.max(
                        1,
                        results.pagination.currentPage - 1,
                      );
                      search({
                        q: filtros.q || undefined,
                        categoria: filtros.categoria || undefined,
                        desde: filtros.desde || undefined,
                        hasta: filtros.hasta || undefined,
                        page: newPage,
                        pageSize: 6,
                      });
                    }}
                    disabled={!results.pagination.hasPrevPage || loading}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </Button>

                  <span className="text-sm text-slate-600">
                    Página {results.pagination.currentPage} de{' '}
                    {results.pagination.totalPages}
                  </span>

                  <Button
                    onClick={() => {
                      const newPage = Math.min(
                        results.pagination.totalPages,
                        results.pagination.currentPage + 1,
                      );
                      search({
                        q: filtros.q || undefined,
                        categoria: filtros.categoria || undefined,
                        desde: filtros.desde || undefined,
                        hasta: filtros.hasta || undefined,
                        page: newPage,
                        pageSize: 6,
                      });
                    }}
                    disabled={!results.pagination.hasNextPage || loading}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
