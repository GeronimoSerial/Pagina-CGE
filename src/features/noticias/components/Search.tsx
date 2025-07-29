'use client';

import { Button } from '@/shared/ui/button';
import { Calendar, ChevronDown, Filter, Search, Tag, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

interface NewsSearchProps {
  categorias: Array<{ id: number; nombre: string }>;
}

export default function NewsSearch({ categorias }: NewsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtros, setFiltros] = useState({
    q: '',
    categoria: '',
    desde: '',
    hasta: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setFiltros({
      q: searchParams.get('q') || '',
      categoria: searchParams.get('categoria') || '',
      desde: searchParams.get('desde') || '',
      hasta: searchParams.get('hasta') || '',
    });
  }, [searchParams]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (filtros.q) params.set('q', filtros.q);
    if (filtros.categoria) params.set('categoria', filtros.categoria);
    if (filtros.desde) params.set('desde', filtros.desde);
    if (filtros.hasta) params.set('hasta', filtros.hasta);
    params.set('page', '1');

    router.push(`/noticias?${params.toString()}`);
  }, [filtros, router]);

  useEffect(() => {
    if (filtros.categoria) {
      const params = new URLSearchParams();
      if (filtros.q) params.set('q', filtros.q);
      if (filtros.categoria) params.set('categoria', filtros.categoria);
      if (filtros.desde) params.set('desde', filtros.desde);
      if (filtros.hasta) params.set('hasta', filtros.hasta);
      params.set('page', '1');
      router.push(`/noticias?${params.toString()}`);
    }
  }, [filtros.categoria, filtros.q, filtros.desde, filtros.hasta, router]);

  const handleInputChange = (field: string, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  const clearIndividualFilter = (field: string) => {
    const newFiltros = { ...filtros, [field]: '' };
    setFiltros(newFiltros);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(field);
    const allEmpty = Object.entries(newFiltros).every(([, v]) => !v);
    if (allEmpty) {
      router.push('/noticias');
    } else {
      router.push(`/noticias?${params.toString()}`);
    }
  };

  const clearAll = () => {
    setFiltros({
      q: '',
      categoria: '',
      desde: '',
      hasta: '',
    });
    router.push('/noticias');
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
            />
            <Button
              onClick={() => clearIndividualFilter('q')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
              style={{ minWidth: 28, minHeight: 28 }}
              tabIndex={-1}
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              className={`flex-1 h-10 px-3 rounded-md text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden ${
                hasPendingSearch
                  ? 'text-white bg-[#2d6b29] hover:bg-[#1f4d1c]'
                  : 'text-white bg-[#3D8B37] hover:bg-[#2d6b29]'
              }`}
            >
              Buscar
            </Button>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
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
              className="h-10 px-2 rounded-md border border-slate-300 text-sm text-slate-600 hover:text-[#3D8B37] hover:border-[#3D8B37]/50 hover:bg-[#F3F4F6] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden"
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
              className="h-9 w-full pl-9 pr-10 text-sm rounded-md border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden shadow-2xs"
              autoFocus
            />
            <Button
              onClick={() => clearIndividualFilter('q')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200 opacity-0 focus:opacity-100"
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
              className={`flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px] ${
                hasPendingSearch
                  ? 'text-white bg-[#2d6b29] hover:bg-[#1f4d1c]'
                  : 'text-white bg-[#3D8B37] hover:bg-[#2d6b29]'
              }`}
              style={{ minHeight: 36 }}
              title={
                hasPendingSearch
                  ? 'Presiona ENTER o haz clic para buscar'
                  : 'Buscar'
              }
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Buscar</span>
              {hasPendingSearch && (
                <div className="ml-1 w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
              )}
            </Button>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium text-[#3D8B37] bg-[#F3F4F6] border border-[#3D8B37]/20 hover:bg-[#e5e7eb] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px]"
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
                className="flex gap-1 items-center h-9 px-2 rounded-md border border-slate-300 text-xs text-slate-600 hover:text-[#3D8B37] hover:border-[#3D8B37]/50 hover:bg-[#F3F4F6] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-hidden min-w-[36px]"
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
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden"
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
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden"
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
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-hidden"
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
  );
}
