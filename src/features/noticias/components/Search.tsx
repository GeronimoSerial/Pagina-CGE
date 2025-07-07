'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Calendar, Tag, X, ChevronDown } from 'lucide-react';

interface SearchFilters {
  q: string;
  categoria: string;
  desde: string;
  hasta: string;
}

interface NewsSearchProps {
  categorias?: string[];
  autores?: string[];
  placeholder?: string;
  initialFilters?: SearchFilters;
}

export default function NewsSearch({
  categorias = [],
  autores = [],
  placeholder = 'Buscar noticias institucionales...',
  initialFilters = {
    q: '',
    categoria: '',
    desde: '',
    hasta: '',
  },
}: NewsSearchProps) {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Mantener filtros sincronizados con la URL
  useEffect(() => {
    setFilters(initialFilters);
    // eslint-disable-next-line
  }, [
    initialFilters.q,
    initialFilters.categoria,
    initialFilters.desde,
    initialFilters.hasta,
  ]);

  // Actualizar la URL con los filtros
  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.categoria) params.set('categoria', newFilters.categoria);
    if (newFilters.desde) params.set('desde', newFilters.desde);
    if (newFilters.hasta) params.set('hasta', newFilters.hasta);
    params.set('page', '1'); // Resetear a la primera página en cada búsqueda
    router.push(`?${params.toString()}`);
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    // Contar filtros activos (excluyendo q)
    const count = Object.entries(newFilters).filter(
      ([key, val]) => key !== 'query' && val.trim() !== '',
    ).length;
    setActiveFiltersCount(count);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      q: filters.q, // Mantener la búsqueda de texto
      categoria: '',
      desde: '',
      hasta: '',
      autor: '',
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    updateURL(clearedFilters);
  };

  const clearAll = () => {
    const emptyFilters = {
      q: '',
      categoria: '',
      desde: '',
      hasta: '',
      autor: '',
    };
    setFilters(emptyFilters);
    setActiveFiltersCount(0);
    updateURL(emptyFilters);
  };

  const clearIndividualFilter = (field: keyof SearchFilters) => {
    handleInputChange(field, '');
  };

  return (
    <div
      className="flex justify-center py-3 px-1 min-h-[60px]"
      style={{ minHeight: 60 }}
    >
      <div className="w-full max-w-[700px] p-2 rounded-lg bg-white border border-slate-200 transition-shadow duration-300 shadow-md">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-700 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={placeholder}
              value={filters.q}
              onChange={(e) => handleInputChange('q', e.target.value)}
              className="h-9 w-full pl-9 pr-10 text-sm rounded-md border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-none shadow-xs"
              autoFocus
              onFocus={(e) =>
                e.target.parentElement
                  ?.querySelector('.clear-btn')
                  ?.classList.remove('opacity-0')
              }
              onBlur={(e) =>
                e.target.parentElement
                  ?.querySelector('.clear-btn')
                  ?.classList.add('opacity-0')
              }
            />
            <button
              onClick={() => clearIndividualFilter('q')}
              className="clear-btn absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200 opacity-0 focus:opacity-100"
              style={{ minWidth: 28, minHeight: 28 }}
              tabIndex={-1}
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Filter Controls (horizontal on desktop, below on mobile) */}
          <div className="flex flex-row md:flex-row gap-2 items-center md:ml-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium text-[#3D8B37] bg-[#F3F4F6] border border-[#3D8B37]/20 hover:bg-[#e5e7eb] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-none min-w-[36px]"
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
            </button>
            {(activeFiltersCount > 0 || filters.q) && (
              <button
                onClick={clearAll}
                className="flex gap-1 items-center h-9 px-2 rounded-md border border-slate-300 text-xs text-slate-600 hover:text-[#3D8B37] hover:border-[#3D8B37]/50 hover:bg-[#F3F4F6] transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-none min-w-[36px]"
                style={{ minHeight: 36 }}
              >
                <X className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Chips */}
        {(activeFiltersCount > 0 || filters.q) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.q && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Search className="w-3 h-3" />
                <span>
                  "
                  {filters.q.length > 20
                    ? filters.q.substring(0, 20) + '...'
                    : filters.q}
                  "
                </span>
                <button
                  onClick={() => clearIndividualFilter('q')}
                  className="ml-1 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
                  style={{ minWidth: 24, minHeight: 24 }}
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.categoria && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Tag className="w-3 h-3" />
                <span>{filters.categoria}</span>
                <button
                  onClick={() => clearIndividualFilter('categoria')}
                  className="ml-1 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
                  style={{ minWidth: 24, minHeight: 24 }}
                  aria-label="Limpiar categoría"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.desde && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Calendar className="w-3 h-3" />
                <span>Desde: {filters.desde}</span>
                <button
                  onClick={() => clearIndividualFilter('desde')}
                  className="ml-1 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
                  style={{ minWidth: 24, minHeight: 24 }}
                  aria-label="Limpiar fecha desde"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.hasta && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Calendar className="w-3 h-3" />
                <span>Hasta: {filters.hasta}</span>
                <button
                  onClick={() => clearIndividualFilter('hasta')}
                  className="ml-1 text-slate-400 hover:text-[#3D8B37] transition-colors duration-200"
                  style={{ minWidth: 24, minHeight: 24 }}
                  aria-label="Limpiar fecha hasta"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Advanced Filters Section */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${showAdvanced ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
          style={{ willChange: 'max-height' }}
        >
          <div className="border-t border-slate-200 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Fecha Desde */}
              <div>
                <label className="block mb-1 text-xs font-medium text-slate-700">
                  <Calendar className="inline mr-1 w-3 h-3" />
                  Desde
                </label>
                <input
                  type="date"
                  value={filters.desde}
                  onChange={(e) => handleInputChange('desde', e.target.value)}
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-none"
                  style={{ minHeight: 32 }}
                />
              </div>
              {/* Fecha Hasta */}
              <div>
                <label className="block mb-1 text-xs font-medium text-slate-700">
                  <Calendar className="inline mr-1 w-3 h-3" />
                  Hasta
                </label>
                <input
                  type="date"
                  value={filters.hasta}
                  onChange={(e) => handleInputChange('hasta', e.target.value)}
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-none"
                  style={{ minHeight: 32 }}
                />
              </div>
              {/* Categoría */}
              <div>
                <label className="block mb-1 text-xs font-medium text-slate-700">
                  <Tag className="inline mr-1 w-3 h-3" />
                  Categoría
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) =>
                    handleInputChange('categoria', e.target.value)
                  }
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-none"
                  style={{ minHeight: 32 }}
                >
                  <option value="">Todas</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
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
