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

    // Versión móvil: tarjetas virtualizadas
    const MobileView = () => {
      const parentRef = useRef<HTMLDivElement>(null);

      const cardVirtualizer = useVirtualizer({
        count: escuelas.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 130, // altura estimada más reducida
        overscan: 5,
      });

      return (
        <div className="sm:hidden">
          <div
            ref={parentRef}
            className="max-h-[75vh] overflow-auto pb-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f9fafb",
            }}
          >
            {/* Contenedor con altura total para el scroll */}
            <div
              style={{
                height: `${cardVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {cardVirtualizer.getVirtualItems().map((virtualRow) => {
                const escuela = escuelas[virtualRow.index];

                return (
                  <div
                    key={escuela.cue}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm 
                              overflow-hidden cursor-pointer hover:border-[#217A4B]/40 transition-all absolute"
                    style={{
                      top: 0,
                      left: 0,
                      width: "calc(100% - 16px)",
                      height: `${virtualRow.size - 16}px`,
                      transform: `translateY(${virtualRow.start + 8}px)`,
                      margin: "0 8px",
                    }}
                    onClick={() => onSelectEscuela(escuela)}
                  >
                    {/* Encabezado de la tarjeta */}
                    <div
                      className="bg-[#217A4B]/10 px-3 py-2 border-b border-gray-100 
                                flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <School className="h-3 w-3 text-[#217A4B] mr-1.5 flex-shrink-0" />
                        <span className="font-mono text-xs text-gray-600 truncate">
                          CUE: {escuela.cue}
                        </span>
                      </div>
                    </div>

                    {/* Cuerpo de la tarjeta simplificado */}
                    <div className="px-3 py-2">
                      <h3 className="font-medium text-xs text-gray-800 mb-1.5 line-clamp-1">
                        {escuela.nombre}
                      </h3>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <span className="truncate">
                          <span className="font-medium mr-1">Director:</span>
                          {escuela.director || "No especificado"}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span
                          className="text-xs text-[#217A4B] underline decoration-[#217A4B]/70 cursor-pointer hover:text-[#217A4B]/80"
                          onClick={(e) => handleClick(e, escuela)}
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
    };

    // Versión desktop: tabla completa con virtualización
    const DesktopView = () => {
      const parentRef = useRef<HTMLDivElement>(null);

      const rowVirtualizer = useVirtualizer({
        count: escuelas.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60, // altura estimada de cada fila
        overscan: 10,
      });

      // Definir proporciones de las columnas (en porcentaje)
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
        <div className="hidden sm:block rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <div
            ref={parentRef}
            className="overflow-auto max-h-[500px] w-full"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f9fafb",
            }}
          >
            {/* Contenedor principal que mantiene la alineación */}
            <div className="w-full min-w-[900px] relative">
              {/* Encabezado de tabla */}
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

              {/* Cuerpo de la tabla virtualizado */}
              <div
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
                    <div
                      key={escuela.cue}
                      className={`${isEven ? "bg-white" : "bg-gray-50"} 
                               cursor-pointer hover:bg-[#217A4B]/5 transition-all`}
                      onClick={() => onSelectEscuela(escuela)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        display: "flex",
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
                        <School className="h-4 w-4 text-[#217A4B] mr-2 flex-shrink-0" />
                        <span className="text-gray-800 line-clamp-2 font-medium">
                          {escuela.nombre}
                        </span>
                      </div>
                      <div
                        className="px-6 py-4 text-gray-600 flex items-center"
                        style={{ width: `${columnWidths.director}%` }}
                      >
                        <div className="line-clamp-2">
                          {escuela.director || "No especificado"}
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
                          {escuela.tipoEscuela || "No especificado"}
                        </span>
                      </div>
                      <div
                        className="px-6 py-4 flex items-center justify-end"
                        style={{ width: `${columnWidths.acciones}%` }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleClick(e, escuela)}
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

          {/* Pie de tabla con contador */}
          <div className="underline bg-gray-50 py-3 px-6 border-t border-gray-200 text-sm text-gray-500 font-medium">
            Total de escuelas: <b>{escuelas.length}</b>
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
