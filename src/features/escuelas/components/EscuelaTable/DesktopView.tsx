import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { School } from '@/shared/interfaces';
import { Button } from '@/shared/ui/button';
import { Eye, School as SchoolIcon } from 'lucide-react';

interface DesktopViewProps {
  escuelas: School[];
  onSelectEscuela: (escuela: School) => void;
}

export const DesktopView = React.memo(
  ({ escuelas, onSelectEscuela }: DesktopViewProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
      count: escuelas.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 60,
      overscan: 10,
    });

    const columnWidths = {
      cue: 10,
      nombre: 25,
      director: 18,
      categoria: 12,
      zona: 12,
      tipo: 13,
      acciones: 10,
    };

    return (
      <div className="hidden sm:block rounded-lg overflow-hidden border border-gray-200 shadow-xs">
        <div
          ref={parentRef}
          className="overflow-auto max-h-[500px] w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
          }}
        >
          <div className="w-full min-w-[900px] relative">
            <table className="w-full border-collapse table-fixed">
              <thead className="bg-[#217A4B]/10 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.cue}%` }}
                  >
                    CUE
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.nombre}%` }}
                  >
                    Nombre de la institución
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.director}%` }}
                  >
                    Nombre del Director
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.categoria}%` }}
                  >
                    Categoría
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.zona}%` }}
                  >
                    Zona
                  </th>
                  <th
                    className="px-9 py-4 text-left text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.tipo}%` }}
                  >
                    Tipo
                  </th>
                  <th
                    className="px-2 py-4 text-left text-sm font-semibold text-[#217A4B]"
                    style={{ width: `${columnWidths.acciones}%` }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
            </table>

            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const escuela = escuelas[virtualRow.index];
                const isEven = virtualRow.index % 2 === 0;

                return (
                  <div
                    key={escuela.cue}
                    className={`${isEven ? 'bg-white' : 'bg-gray-50'} 
                                 cursor-pointer hover:bg-[#217A4B]/5 transition-all`}
                    onClick={() => onSelectEscuela(escuela)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      display: 'flex',
                    }}
                  >
                    <div
                      className="px-6 py-4 font-mono text-xs text-gray-600 truncate flex items-center"
                      style={{ width: `${columnWidths.cue}%` }}
                    >
                      {escuela.cue}
                    </div>
                    <div
                      className="px-6 py-4 flex items-center"
                      style={{ width: `${columnWidths.nombre}%` }}
                    >
                      <SchoolIcon className="h-4 w-4 text-[#217A4B] mr-2 shrink-0" />
                      <span className="text-gray-800 line-clamp-2 font-medium">
                        {escuela.nombre}
                      </span>
                    </div>
                    <div
                      className="px-6 py-4 text-gray-600 flex items-center"
                      style={{ width: `${columnWidths.director}%` }}
                    >
                      <div className="line-clamp-2">
                        {escuela.director || 'No especificado'}
                      </div>
                    </div>
                    <div
                      className="px-6 py-4 text-center font-semibold text-[#217A4B] flex items-center justify-center"
                      style={{ width: `${columnWidths.categoria}%` }}
                    >
                      {escuela.categoria}
                    </div>
                    <div
                      className="px-6 py-4 text-center font-semibold text-[#217A4B] flex items-center justify-center"
                      style={{ width: `${columnWidths.zona}%` }}
                    >
                      {escuela.zona}
                    </div>
                    <div
                      className="px-6 py-4 flex items-center"
                      style={{ width: `${columnWidths.tipo}%` }}
                    >
                      <span className="px-3 py-1.5 bg-[#217A4B]/10 text-[#217A4B] rounded-md text-xs font-medium">
                        {escuela.tipoEscuela || 'No especificado'}
                      </span>
                    </div>
                    <div
                      className="px-6 py-4 flex items-center justify-end"
                      style={{ width: `${columnWidths.acciones}%` }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectEscuela(escuela)}
                        className="rounded-full bg-white hover:bg-[#217A4B] 
                                   hover:text-white border-[#217A4B]/40 text-[#217A4B] transition-all"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="underline bg-gray-50 py-3 px-6 border-t border-gray-200 text-sm text-gray-500 font-medium">
          Total de escuelas: <b>{escuelas.length}</b>
        </div>
      </div>
    );
  },
);

DesktopView.displayName = 'DesktopView';
