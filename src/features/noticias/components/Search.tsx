'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Calendar, Tag, X, ChevronDown } from 'lucide-react';

interface SearchFilters {
  query: string;
  categoria: string;
  fechaDesde: string;
  fechaHasta: string;
  autor: string;
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
    autor: '',
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
    initialFilters.autor,
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
    <div className="bg-white border-t-2 border-b border-l border-r border-slate-200 border-t-slate-300 shadow-lg shadow-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Búsqueda Principal */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-slate-700 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-300 ease-out text-lg rounded-sm"
            />
            {filters.query && (
              <button
                onClick={() => clearIndividualFilter('query')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {/* Controles de Filtros */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="group flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-300 rounded-sm hover:bg-slate-50"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtros Avanzados</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-semibold text-white bg-slate-500 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>
          {(activeFiltersCount > 0 || filters.query) && (
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300 px-2 py-1 rounded hover:bg-slate-50"
                >
                  Limpiar filtros
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 hover:border-slate-400 transition-all duration-300 rounded-sm hover:bg-slate-50"
              >
                <X className="w-3 h-3" />
                Limpiar todo
              </button>
            </div>
          )}
        </div>
        {/* Filtros Activos Visibles */}
        {(activeFiltersCount > 0 || filters.query) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.query && (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                <Search className="w-3 h-3" />
                <span>"{filters.query}"</span>
                <button
                  onClick={() => clearIndividualFilter('query')}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.categoria && (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                <Tag className="w-3 h-3" />
                <span>{filters.categoria}</span>
                <button
                  onClick={() => clearIndividualFilter('categoria')}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.autor && (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                <span>{filters.autor}</span>
                <button
                  onClick={() => clearIndividualFilter('autor')}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.fechaDesde && (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                <Calendar className="w-3 h-3" />
                <span>Desde: {filters.fechaDesde}</span>
                <button
                  onClick={() => clearIndividualFilter('fechaDesde')}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.fechaHasta && (
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                <Calendar className="w-3 h-3" />
                <span>Hasta: {filters.fechaHasta}</span>
                <button
                  onClick={() => clearIndividualFilter('fechaHasta')}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
        {/* Filtros Avanzados */}
        <div
          className={`transition-all duration-500 ease-out overflow-hidden ${
            showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Categoría
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) =>
                    handleInputChange('categoria', e.target.value)
                  }
                  className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-300 rounded-sm"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Autor
                </label>
                <select
                  value={filters.autor}
                  onChange={(e) => handleInputChange('autor', e.target.value)}
                  className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-300 rounded-sm"
                >
                  <option value="">Todos los autores</option>
                  {autores.map((autor) => (
                    <option key={autor} value={autor}>
                      {autor}
                    </option>
                  ))}
                </select>
              </div>
              {/* Fecha Desde */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Desde
                </label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) =>
                    handleInputChange('fechaDesde', e.target.value)
                  }
                  className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-300 rounded-sm"
                />
              </div>
              {/* Fecha Hasta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Hasta
                </label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) =>
                    handleInputChange('fechaHasta', e.target.value)
                  }
                  className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:outline-none transition-all duration-300 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Separador Elegante */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full">
              <div className="border-t border-slate-300 mb-1"></div>
              <div className="border-t border-slate-200"></div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-6 flex items-center gap-3">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <Search className="w-3 h-3 text-slate-400" />
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
