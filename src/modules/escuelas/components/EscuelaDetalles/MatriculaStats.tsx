import { Escuela } from "@/src/interfaces";
import { BarChart3 } from "lucide-react";
import { memo } from "react";

export const MatriculaStats = memo(({ escuela }: { escuela: Escuela }) => {
    const porcentajeCambio = escuela.matricula2024
      ? (
          ((escuela.matricula2025 - escuela.matricula2024) /
            escuela.matricula2024) *
          100
        ).toFixed(1)
      : 0;
  
    const cambio = Number(porcentajeCambio);
    const tendenciaColor =
      cambio > 0
        ? "text-emerald-600"
        : cambio < 0
        ? "text-rose-600"
        : "text-gray-600";
    const tendenciaIcon = cambio > 0 ? "↑" : cambio < 0 ? "↓" : "→";
  
    return (
      <div className="border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-[#217A4B]" />
          <h3 className="text-sm font-semibold text-[#205C3B]">
            Matrícula Escolar
          </h3>
        </div>
  
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">2024:</span>
            <span className="text-lg font-semibold text-[#217A4B]">
              {escuela.matricula2024}
            </span>
          </div>
  
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">2025:</span>
            <span className="text-lg font-semibold text-[#217A4B]">
              {escuela.matricula2025}
            </span>
          </div>
  
          <div className="col-span-2 flex items-center justify-end mt-1">
            <div className={`flex items-center gap-1 ${tendenciaColor}`}>
              <span className="text-base font-semibold">{tendenciaIcon}</span>
              <span className="text-sm">
                {cambio === 0
                  ? "Sin cambios"
                  : `${cambio > 0 ? "+" : ""}${porcentajeCambio}% (${Math.abs(
                      escuela.matricula2025 - escuela.matricula2024
                    )} alumnos)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });