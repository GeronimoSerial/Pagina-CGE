import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Escuela } from '@/shared/interfaces';
import { Button } from '@/shared/ui/button';
import { Eye, School } from 'lucide-react';

interface MobileViewProps {
  escuelas: Escuela[];
  onSelectEscuela: (escuela: Escuela) => void;
}

export const MobileView = React.memo(
  ({ escuelas, onSelectEscuela }: MobileViewProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const cardVirtualizer = useVirtualizer({
      count: escuelas.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 130,
      overscan: 5,
    });

    return (
      <div className="sm:hidden">
        <div
          ref={parentRef}
          className="max-h-[75vh] overflow-auto pb-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
          }}
        >
          <div
            style={{
              height: `${cardVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {cardVirtualizer.getVirtualItems().map((virtualRow) => {
              const escuela = escuelas[virtualRow.index];

              return (
                <div
                  key={escuela.cue}
                  className="bg-white rounded-lg border border-gray-200 shadow-xs 
                               overflow-hidden cursor-pointer hover:border-[#217A4B]/40 transition-all absolute"
                  style={{
                    top: 0,
                    left: 0,
                    width: 'calc(100% - 16px)',
                    height: `${virtualRow.size - 16}px`,
                    transform: `translateY(${virtualRow.start + 8}px)`,
                    margin: '0 8px',
                  }}
                  onClick={() => onSelectEscuela(escuela)}
                >
                  <div
                    className="bg-[#217A4B]/10 px-3 py-2 border-b border-gray-100 
                                 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <School className="h-3 w-3 text-[#217A4B] mr-1.5 shrink-0" />
                      <span className="font-mono text-xs text-gray-600 truncate">
                        CUE: {escuela.cue}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <h3 className="font-medium text-xs text-gray-800 mb-1.5 line-clamp-1">
                      {escuela.nombre}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <span className="truncate">
                        <span className="font-medium mr-1">Director:</span>
                        {escuela.director || 'No especificado'}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span
                        className="text-xs text-[#217A4B] underline decoration-[#217A4B]/70 cursor-pointer hover:text-[#217A4B]/80"
                        onClick={() => onSelectEscuela(escuela)}
                      >
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="bg-gray-50 py-3 px-4 border border-gray-200 rounded-md 
                       text-xs text-gray-500 text-center font-medium mt-4 underline"
        >
          Total de escuelas: {escuelas.length}
        </div>
      </div>
    );
  },
);

MobileView.displayName = 'MobileView';
