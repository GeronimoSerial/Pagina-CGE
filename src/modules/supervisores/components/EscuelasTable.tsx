import React, { useCallback, memo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Escuela } from "./SupervisoresClient";
import { Eye, School } from "lucide-react";

interface EscuelasTableProps {
  escuelas: Escuela[];
  onSelectEscuela: (escuela: Escuela) => void;
}

const EscuelasTable = memo(
  ({ escuelas, onSelectEscuela }: EscuelasTableProps) => {
    const handleClick = useCallback(
      (e: React.MouseEvent, escuela: Escuela) => {
        e.stopPropagation();
        onSelectEscuela(escuela);
      },
      [onSelectEscuela]
    );

    // Función para alternar clases para filas pares e impares
    const getRowClass = (index: number) => {
      return index % 2 === 0 ? "bg-white" : "bg-gray-50";
    };

    // Versión móvil: tarjetas en lugar de tabla
    const MobileView = () => (
      <div className="space-y-3 sm:hidden">
        {escuelas.map((escuela, index) => (
          <div
            key={escuela.cue}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:border-[#217A4B]/30 transition-colors"
            onClick={() => onSelectEscuela(escuela)}
          >
            <div className="bg-[#217A4B]/10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
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
                className="h-8 rounded-full bg-white hover:bg-[#217A4B] hover:text-white border-[#217A4B]/30 text-[#217A4B] transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>
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
        <div className="bg-gray-50 py-3 px-4 border border-gray-200 rounded-md text-xs text-gray-500 text-center">
          Total de escuelas: {escuelas.length}
        </div>
      </div>
    );

    // Versión desktop: tabla completa
    const DesktopView = () => (
      <div className="hidden sm:block rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="bg-[#205C3B]/10 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#205C3B] h-12">
                  CUE
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B]">
                  Nombre
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B]">
                  Director
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B] text-center">
                  Matrícula 2024
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B] text-center">
                  Matrícula 2025
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B]">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-[#205C3B] text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escuelas.map((escuela, index) => (
                <TableRow
                  key={escuela.cue}
                  onClick={() => onSelectEscuela(escuela)}
                  className={`${getRowClass(
                    index
                  )} cursor-pointer transition-colors hover:bg-[#217A4B]/5`}
                >
                  <TableCell className="font-mono text-xs text-gray-600">
                    {escuela.cue}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <School className="h-4 w-4 text-[#217A4B] mr-2 flex-shrink-0" />
                      <span className="text-gray-800 line-clamp-2">
                        {escuela.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-[200px]">
                    <div className="line-clamp-2">
                      {escuela.director || "No especificado"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {escuela.matricula2024}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {escuela.matricula2025}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-[#217A4B]/10 text-[#217A4B] rounded-md text-xs font-medium">
                      {escuela.tipoEscuela || "No especificado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleClick(e, escuela)}
                      className="rounded-full bg-white hover:bg-[#217A4B] hover:text-white border-[#217A4B]/30 text-[#217A4B] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Ver detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-gray-50 py-3 px-4 border-t border-gray-200 text-sm text-gray-500">
          Total de escuelas: {escuelas.length}
        </div>
      </div>
    );

    return (
      <>
        <MobileView />
        <DesktopView />
      </>
    );
  }
);

EscuelasTable.displayName = "EscuelasTable";

export default EscuelasTable;
