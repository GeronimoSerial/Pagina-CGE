import React, { useState, useCallback, useEffect } from 'react';
import type { Escuela } from '@/shared/interfaces';
import { buscarEscuelasAvanzado } from '../utils/searchUtils';
import { Info, MapPin, School, Search } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

interface BuscadorEscuelasProps {
  escuelas: Escuela[];
  onSelectEscuela: (escuela: Escuela) => void;
}

const BuscadorEscuelas: React.FC<BuscadorEscuelasProps> = ({
  escuelas,
  onSelectEscuela,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState<Escuela[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() === '') {
      setResultados([]);
      setShowResults(false);
      return;
    }

    const results = buscarEscuelasAvanzado(escuelas, searchTerm);
    setResultados(results);
    setShowResults(true);
  }, [escuelas, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setResultados([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setResultados([]);
    setShowResults(false);
  }, []);

  const handleSelectEscuela = useCallback(
    (escuela: Escuela) => {
      onSelectEscuela(escuela);
      setShowResults(false);
    },
    [onSelectEscuela],
  );

  return (
    <div className="w-full space-y-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
        <input
          type="search"
          placeholder="Buscar por nombre, director, CUE, departamento o localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className={`w-full pl-10 bg-white border-2 border-gray-300 rounded-xl py-2.5 px-4 
            focus:outline-none focus:ring-2 focus:ring-[#3D8B37]/30 focus:border-[#3D8B37] 
            transition-all duration-200 ease-in-out text-sm placeholder:text-gray-500 
            hover:border-[#3D8B37] shadow-sm`}
        />
      </div>

      {showResults && resultados.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-[100] overflow-hidden max-h-[350px] overflow-y-auto"
          style={{ filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.1))' }}
        >
          <div className="p-3 bg-[#217A4B]/5 border-b border-gray-100 flex justify-between items-center">
            <Badge
              variant="secondary"
              className="bg-[#217A4B]/10 text-[#217A4B] border-[#217A4B]/20 hover:bg-[#217A4B]/20"
            >
              {resultados.length} escuelas encontradas
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </Button>
          </div>
          <ul className="divide-y divide-gray-100">
            {resultados.map((escuela) => (
              <li
                key={escuela.cue}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleSelectEscuela(escuela)}
              >
                <div className="p-3">
                  <div className="flex items-start">
                    <div className="bg-[#217A4B]/10 p-2 rounded-lg mr-3 flex-shrink-0">
                      <School className="h-4 w-4 text-[#217A4B]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {escuela.nombre}
                      </p>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge className="bg-[#217A4B] text-white border-0 px-3 py-1 flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          <span className="font-mono">CUE: {escuela.cue}</span>
                        </Badge>

                        <Badge
                          variant="outline"
                          className="px-3 py-1 flex items-center gap-1 border-gray-200"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>
                            {escuela.departamento} - {escuela.localidad}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          Directora: <b>{escuela.director || 'Sin director'}</b>
                        </span>

                        <span>{escuela.tipoEscuela || 'Sin tipo'}</span>
                        <span>Turno: {escuela.turno}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensaje de no resultados */}
      {showResults && searchTerm && resultados.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-[100] p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-medium mb-1">
              No se encontraron escuelas
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              No hay resultados para "{searchTerm}". Intenta con otro término.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs"
            >
              Limpiar búsqueda
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscadorEscuelas;
