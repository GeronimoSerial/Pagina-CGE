import React, { useCallback, memo, useRef } from "react";
import { Button } from "@components/ui/button";
import type { Escuela } from "@/src/interfaces";
import { Eye, School } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

/**
 * Props para el componente EscuelasTable
 */
interface EscuelasTableProps {
  escuelas: Escuela[];
  onSelectEscuela: (escuela: Escuela) => void;
}

/**
 * Componente EscuelasTable para mostrar listado de escuelas
 * Incluye vista responsiva para móvil y desktop con virtualización
 */
const EscuelasTable = memo(
  ({ escuelas, onSelectEscuela }: EscuelasTableProps) => {
    const handleClick = useCallback(
      (e: React.MouseEvent, escuela: Escuela) => {
        e.stopPropagation();
        onSelectEscuela(escuela);
      },
      [onSelectEscuela]
    );

    // Versión móvil: tarjetas en lugar de tabla
    const MobileView = () => (
      <div className="space-y-3 sm:hidden">
        {escuelas.map((escuela) => (
          <div
            key={escuela.cue}
            className="bg-white rounded-lg border border-gray-200 shadow-sm 
                     overflow-hidden cursor-pointer hover:border-[#217A4B]/30 transition-colors"
            onClick={() => onSelectEscuela(escuela)}
          >
            {/* Encabezado de la tarjeta */}
            <div
              className="bg-[#217A4B]/10 px-4 py-3 border-b border-gray-100 
                          flex items-center justify-between"
            >
              <div className="flex items-center">
                <School className="h-4 w-4 text-[#217A4B] mr-2 flex-shrink-0" />
                <span className="font-mono text-xs text-gray-600 truncate">
                  CUE: {escuela.cue}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleClick(e, escuela)}
                className="h-8 rounded-full bg-white hover:bg-[#217A4B] 
                         hover:text-white border-[#217A4B]/30 text-[#217A4B] transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="p-3">
              <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                {escuela.nombre}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Director:</p>
                  <p className="truncate">
                    {escuela.director || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tipo:</p>
                  <p className="truncate">
                    {escuela.tipoEscuela || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Matrícula 2024:</p>
                  <p className="font-semibold">{escuela.matricula2024}</p>
                </div>
                <div>
                  <p className="text-gray-500">Matrícula 2025:</p>
                  <p className="font-semibold">{escuela.matricula2025}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div
          className="bg-gray-50 py-3 px-4 border border-gray-200 rounded-md 
                      text-xs text-gray-500 text-center"
        >
          Total de escuelas: {escuelas.length}
        </div>
      </div>
    );

    // Versión desktop: tabla completa con virtualización
    const DesktopView = () => {
      const parentRef = useRef<HTMLDivElement>(null);

      const rowVirtualizer = useVirtualizer({
        count: escuelas.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56, // altura estimada de cada fila
        overscan: 10,
      });

      return (
        <div className="hidden sm:block rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <div ref={parentRef} className="overflow-auto max-h-[500px]">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Encabezado de la tabla */}
                  <thead className="bg-[#205C3B]/10 sticky top-0 z-10">
                    <tr>
                      <th className="w-[120px] px-6 py-3 text-left text-sm font-semibold text-[#205C3B]">
                        CUE
                      </th>
                      <th className="w-[300px] px-6 py-3 text-left text-sm font-semibold text-[#205C3B]">
                        Nombre
                      </th>
                      <th className="w-[200px] px-6 py-3 text-left text-sm font-semibold text-[#205C3B]">
                        Director
                      </th>
                      <th className="w-[130px] px-6 py-3 text-center text-sm font-semibold text-[#205C3B]">
                        Matrícula 2024
                      </th>
                      <th className="w-[130px] px-6 py-3 text-center text-sm font-semibold text-[#205C3B]">
                        Matrícula 2025
                      </th>
                      <th className="w-[150px] px-6 py-3 text-left text-sm font-semibold text-[#205C3B]">
                        Tipo
                      </th>
                      <th className="w-[140px] px-6 py-3 text-right text-sm font-semibold text-[#205C3B]">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  {/* Cuerpo de la tabla virtualizado */}
                  <tbody
                    className="divide-y divide-gray-200 bg-white"
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const escuela = escuelas[virtualRow.index];
                      const isEven = virtualRow.index % 2 === 0;

                      return (
                        <tr
                          key={escuela.cue}
                          className={`${isEven ? "bg-white" : "bg-gray-50"} 
                                   cursor-pointer hover:bg-[#217A4B]/5 transition-colors`}
                          onClick={() => onSelectEscuela(escuela)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <td className="w-[120px] px-6 py-4 font-mono text-xs text-gray-600 truncate">
                            {escuela.cue}
                          </td>
                          <td className="w-[300px] px-6 py-4">
                            <div className="flex items-center">
                              <School className="h-4 w-4 text-[#217A4B] mr-2 flex-shrink-0" />
                              <span className="text-gray-800 line-clamp-2">
                                {escuela.nombre}
                              </span>
                            </div>
                          </td>
                          <td className="w-[200px] px-6 py-4 text-gray-600">
                            <div className="line-clamp-2">
                              {escuela.director || "No especificado"}
                            </div>
                          </td>
                          <td className="w-[130px] px-6 py-4 text-center font-semibold">
                            {escuela.matricula2024}
                          </td>
                          <td className="w-[130px] px-6 py-4 text-center font-semibold">
                            {escuela.matricula2025}
                          </td>
                          <td className="w-[150px] px-6 py-4">
                            <span className="px-2 py-1 bg-[#217A4B]/10 text-[#217A4B] rounded-md text-xs font-medium">
                              {escuela.tipoEscuela || "No especificado"}
                            </span>
                          </td>
                          <td className="w-[140px] px-6 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleClick(e, escuela)}
                              className="rounded-full bg-white hover:bg-[#217A4B] 
                                     hover:text-white border-[#217A4B]/30 text-[#217A4B] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pie de tabla con contador */}
          <div className="bg-gray-50 py-3 px-4 border-t border-gray-200 text-sm text-gray-500">
            Total de escuelas: {escuelas.length}
          </div>
        </div>
      );
    };

    // Renderizar ambas vistas (móvil y desktop)
    return (
      <>
        <MobileView />
        <DesktopView />
      </>
    );
  }
);

export default EscuelasTable;
