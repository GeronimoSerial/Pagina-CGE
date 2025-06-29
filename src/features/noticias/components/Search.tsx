'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SearchFilters {
  query: string;
  categoria: string;
  fechaDesde: string;
  fechaHasta: string;
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
    query: '',
    categoria: '',
    fechaDesde: '',
    fechaHasta: '',
  },
}: NewsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Mantener filtros sincronizados con la URL
  useEffect(() => {
    setFilters(initialFilters);
    // eslint-disable-next-line
  }, [
    initialFilters.query,
    initialFilters.categoria,
    initialFilters.fechaDesde,
    initialFilters.fechaHasta,
  ]);

  // Actualizar la URL con los filtros
  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.categoria) params.set('categoria', newFilters.categoria);
    if (newFilters.fechaDesde) params.set('desde', newFilters.fechaDesde);
    if (newFilters.fechaHasta) params.set('hasta', newFilters.fechaHasta);
    // if (newFilters.autor) params.set('autor', newFilters.autor);
    params.set('page', '1'); // Resetear a la primera página en cada búsqueda
    router.push(`?${params.toString()}`);
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    // Contar filtros activos (excluyendo query)
    const count = Object.entries(newFilters).filter(
      ([key, val]) => key !== 'query' && val.trim() !== '',
    ).length;
    setActiveFiltersCount(count);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: filters.query, // Mantener la búsqueda de texto
      categoria: '',
      fechaDesde: '',
      fechaHasta: '',
      autor: '',
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    updateURL(clearedFilters);
  };

  const clearAll = () => {
    const emptyFilters = {
      query: '',
      categoria: '',
      fechaDesde: '',
      fechaHasta: '',
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
    <div className="border-t border-slate-200">
      {/* Contenedor con altura fija para evitar saltos de layout */}
      <div className="overflow-hidden relative transition-all duration-300 ease-out">
        <div className="px-4 py-4 mx-auto max-w-lg">
          {/* Vista Colapsada - Solo Icono
          {!isExpanded && (
            <div className="flex justify-center items-center h-7">
              <button
                onClick={() => setIsExpanded(true)}
                className="flex gap-2 items-center px-4 py-2 bg-white rounded-full shadow-lg transition-all duration-200 text-slate-800 hover:text-slate-700 group"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm font-medium opacity-100 transition-opacity duration-200">
                  Buscar Noticias
                </span>
              </button>
            </div>
          )} */}

          {/* Vista Expandida - Componente Completo */}

          <div className="space-y-3 bg-white/35">
            {/* Búsqueda Principal con botón de cerrar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={filters.query}
                  onChange={(e) => handleInputChange('query', e.target.value)}
                  className="py-2.5 pr-10 pl-10 w-full text-sm rounded border transition-all duration-200 text-slate-700 bg-slate-50/50 border-slate-200 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200"
                  autoFocus
                />
                <div className="flex absolute right-3 top-1/2 gap-1 transform -translate-y-1/2">
                  {filters.query && (
                    <button
                      onClick={() => clearIndividualFilter('query')}
                      className="transition-colors duration-200 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Controles de Filtros */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex gap-1.5 items-center px-2 py-1.5 text-xs rounded transition-colors duration-200 group text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="font-medium">Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-white bg-slate-400 rounded-full min-w-[16px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>

              {(activeFiltersCount > 0 || filters.query) && (
                <div className="flex gap-2 items-center">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-2 py-1 text-xs rounded transition-colors duration-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      Limpiar filtros
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="flex gap-1 items-center px-2 py-1 text-xs rounded border transition-all duration-200 text-slate-500 hover:text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <X className="w-3 h-3" />
                    Limpiar
                  </button>
                </div>
              )}
            </div>

            {/* Filtros Activos Visibles */}
            {(activeFiltersCount > 0 || filters.query) && (
              <div className="flex flex-wrap gap-1.5">
                {filters.query && (
                  <div className="flex gap-1 items-center px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    <Search className="w-3 h-3" />
                    <span>
                      "
                      {filters.query.length > 20
                        ? filters.query.substring(0, 20) + '...'
                        : filters.query}
                      "
                    </span>
                    <button
                      onClick={() => clearIndividualFilter('query')}
                      className="ml-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.categoria && (
                  <div className="flex gap-1 items-center px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    <Tag className="w-3 h-3" />
                    <span>{filters.categoria}</span>
                    <button
                      onClick={() => clearIndividualFilter('categoria')}
                      className="ml-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.fechaDesde && (
                  <div className="flex gap-1 items-center px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>Desde: {filters.fechaDesde}</span>
                    <button
                      onClick={() => clearIndividualFilter('fechaDesde')}
                      className="ml-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.fechaHasta && (
                  <div className="flex gap-1 items-center px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>Hasta: {filters.fechaHasta}</span>
                    <button
                      onClick={() => clearIndividualFilter('fechaHasta')}
                      className="ml-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Filtros Avanzados */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                showAdvanced ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-slate-100">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Fecha Desde */}
                  <div>
                    <label className="block mb-1 text-xs font-medium text-slate-600">
                      <Calendar className="inline mr-1 w-3 h-3" />
                      Desde
                    </label>
                    <input
                      type="date"
                      value={filters.fechaDesde}
                      onChange={(e) =>
                        handleInputChange('fechaDesde', e.target.value)
                      }
                      className="px-2 py-1.5 w-full text-xs rounded border transition-all duration-200 text-slate-700 bg-slate-50/50 border-slate-200 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200"
                    />
                  </div>

                  {/* Fecha Hasta */}
                  <div>
                    <label className="block mb-1 text-xs font-medium text-slate-600">
                      <Calendar className="inline mr-1 w-3 h-3" />
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={filters.fechaHasta}
                      onChange={(e) =>
                        handleInputChange('fechaHasta', e.target.value)
                      }
                      className="px-2 py-1.5 w-full text-xs rounded border transition-all duration-200 text-slate-700 bg-slate-50/50 border-slate-200 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block mt-3 mb-1 text-xs font-medium text-slate-600">
                  <Tag className="inline mr-1 w-3 h-3" />
                  Categoría
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) =>
                    handleInputChange('categoria', e.target.value)
                  }
                  className="px-2 py-1.5 w-full text-xs rounded border transition-all duration-200 text-slate-700 bg-slate-50/50 border-slate-200 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200"
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

            {/* Separador Sutil */}
            {(activeFiltersCount > 0 || filters.query || showAdvanced) && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-center">
                  <div className="flex gap-1 items-center">
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <Search className="w-2.5 h-2.5 text-slate-300" />
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
