'use client';

import { Calendar, ChevronDown, Filter, Search, Tag, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

interface NewsSearchProps {
  categorias: Array<{ id: number; nombre: string }>;
  placeholder?: string;
}

export default function NewsSearch({
  categorias,
  placeholder,
}: NewsSearchProps) {
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
    // Solo inicializa con lo que hay en la URL al montar
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
    params.set('page', '1'); // siempre reiniciar a la primera página

    router.push(`/noticias?${params.toString()}`);
  }, [filtros, router]);

  // AUTO-SEARCH REMOVIDO - Solo manual con ENTER o botón BUSCAR
  // Esto reduce drásticamente los requests a la VPS
  
  // Auto-search SOLO para filtros (no para texto libre)
  useEffect(() => {
    // Solo ejecutar búsqueda automática para filtros de fecha y categoría
    // El texto (q) requiere acción manual
    const hasFilters = filtros.categoria || filtros.desde || filtros.hasta;
    
    if (hasFilters) {
      const params = new URLSearchParams();
      if (filtros.q) params.set('q', filtros.q); // Mantener texto actual
      if (filtros.categoria) params.set('categoria', filtros.categoria);
      if (filtros.desde) params.set('desde', filtros.desde);
      if (filtros.hasta) params.set('hasta', filtros.hasta);
      params.set('page', '1');

      router.push(`/noticias?${params.toString()}`);
    }
  }, [filtros.categoria, filtros.desde, filtros.hasta, router]); // NO incluir filtros.q

  const handleInputChange = (field: string, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  const clearIndividualFilter = (field: string) => {
    setFiltros({ ...filtros, [field]: '' });
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

  // Verificar si hay texto pendiente de búsqueda (indicador sutil)
  const urlQuery = searchParams.get('q') || '';
  const hasPendingSearch = filtros.q !== urlQuery && filtros.q.length > 0;
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
              placeholder={placeholder || "Escribe y presiona ENTER para buscar..."}
              value={filtros.q}
              onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
              onKeyDown={handleKeyDown}
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
              onClick={handleSearch}
              className={`flex gap-1 items-center h-9 px-3 rounded-md text-xs font-medium transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/50 focus:outline-none min-w-[36px] ${
                hasPendingSearch 
                  ? 'text-white bg-[#2d6b29] hover:bg-[#1f4d1c]' 
                  : 'text-white bg-[#3D8B37] hover:bg-[#2d6b29]'
              }`}
              style={{ minHeight: 36 }}
              title={hasPendingSearch ? "Presiona ENTER o haz clic para buscar" : "Buscar"}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Buscar</span>
              {hasPendingSearch && (
                <div className="ml-1 w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
              )}
            </button>
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
            {(activeFiltersCount > 0 || filtros.q) && (
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
        {(activeFiltersCount > 0 || filtros.q) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filtros.q && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Search className="w-3 h-3" />
                <span>
                  "
                  {filtros.q.length > 20
                    ? filtros.q.substring(0, 20) + '...'
                    : filtros.q}
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
            {filtros.categoria && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Tag className="w-3 h-3" />
                <span>{filtros.categoria}</span>
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
            {filtros.desde && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Calendar className="w-3 h-3" />
                <span>Desde: {filtros.desde}</span>
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
            {filtros.hasta && (
              <div className="flex gap-1 items-center px-2 py-0.5 text-xs rounded-full bg-[#F3F4F6] text-slate-700 border border-slate-200 shadow-xs">
                <Calendar className="w-3 h-3" />
                <span>Hasta: {filtros.hasta}</span>
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
                  value={filtros.desde}
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
                  value={filtros.hasta}
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
                  value={filtros.categoria}
                  onChange={(e) =>
                    handleInputChange('categoria', e.target.value)
                  }
                  className="h-8 px-2 w-full text-xs rounded border border-slate-300 bg-slate-50 text-slate-800 transition-all duration-200 focus:ring-2 focus:ring-[#3D8B37]/70 focus:border-[#3D8B37]/70 focus:bg-white outline-none"
                  style={{ minHeight: 32 }}
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
