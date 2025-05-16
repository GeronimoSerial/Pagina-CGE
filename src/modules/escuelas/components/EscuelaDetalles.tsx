import React, { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import type { Escuela } from "@src/interfaces";
import {
  School,
  MapPin,
  Info,
  BarChart3,
  Building2,
  Bookmark,
  Calendar,
  Map,
  ArrowRight,
} from "lucide-react";

interface EscuelaDetallesProps {
  escuela: Escuela;
  onClose: () => void;
  correoEscuela?: string;
}

// Componente de detalles de información - memoizado para evitar re-renderizados
const InfoDetail = memo(
  ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-[#217A4B]/40 transition-all hover:shadow-md group">
      <div className="bg-[#217A4B]/10 p-2.5 rounded-lg flex-shrink-0 group-hover:bg-[#217A4B]/20 transition-all duration-300">
        <Icon className="h-5 w-5 text-[#217A4B]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words mt-0.5">
          {value || "No especificado"}
        </p>
      </div>
    </div>
  )
);

InfoDetail.displayName = "InfoDetail";

// Componente de sección - memoizado para evitar re-renderizados
const Section = memo(
  ({
    title,
    icon: Icon,
    children,
    className = "",
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-semibold text-[#205C3B] flex items-center gap-2 border-b border-[#217A4B]/20 pb-2">
        <Icon className="h-5 w-5 text-[#217A4B]" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  )
);

Section.displayName = "Section";

// Estadísticas de matrícula
const MatriculaStats = memo(({ escuela }: { escuela: Escuela }) => {
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

MatriculaStats.displayName = "MatriculaStats";
// Componente principal - memoizado para máximo rendimiento
const EscuelaDetalles = memo(
  ({
    escuela,
    onClose,
    correoEscuela = "No disponible",
  }: EscuelaDetallesProps) => {
    if (!escuela) return null;

    const commonBadgeClasses =
      "bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-2 border border-gray-200 text-xs sm:text-sm";
    const commonIconClasses = "h-3 w-3 sm:h-4 sm:w-4 text-gray-600";
    ("bg-gray-50 p-1.5 sm:p-2 rounded-md sm:rounded-lg mt-0.5");

    return (
      <Dialog open={!!escuela} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden w-[95vw] md:w-[85vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl shadow-2xl border-0 max-h-[95vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-[2%] data-[state=open]:slide-in-from-bottom-[2%] duration-300">
          <div className="bg-white pt-6 pb-4 sm:pt-8 sm:pb-5 md:pt-10 md:pb-6 px-4 sm:px-5 md:px-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <School className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#217A4B]" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight break-words">
                {escuela.nombre}
              </DialogTitle>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
              <div className={commonBadgeClasses}>
                <Building2 className={commonIconClasses} />
                <span className="font-medium text-gray-700">
                  CUE: {escuela.cue}
                </span>
              </div>

              <div className={commonBadgeClasses}>
                <MapPin className={commonIconClasses} />
                <span className="font-medium text-gray-700 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">
                  {escuela.departamento}, {escuela.localidad}
                </span>
              </div>

              <div className={commonBadgeClasses}>
                <Bookmark className={commonIconClasses} />
                <span className="font-medium text-gray-700 truncate max-w-[120px] xs:max-w-[150px]">
                  {escuela.tipoEscuela}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-grow bg-gray-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(80vh-100px)] overflow-y-auto">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <MatriculaStats escuela={escuela} />

                <div className="space-y-4 mt-4">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-[#217A4B]" />
                      <h3 className="text-sm font-semibold text-[#205C3B]">
                        Información General
                      </h3>
                    </div>

                    <div className="space-y-2 px-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Fecha de Fundación:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.fechaFundacion || "No especificada"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Categoría:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.categoria || "No especificada"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Zona:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.zona || "No especificada"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Turno:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.turno}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-[#217A4B]" />
                    <h3 className="text-sm font-semibold text-[#205C3B]">
                      Ubicación y Contacto
                    </h3>
                  </div>

                  <div className="space-y-2 px-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Departamento:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.departamento}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ubicación:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.ubicacion}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Director/a:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.director}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Correo:</span>
                      <span className="text-sm font-medium text-gray-800 break-all">
                        {correoEscuela}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <a
                        href="http://mapa.mec.gob.ar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline text-[#217A4B] hover:text-[#205C3B] flex items-center gap-1.5"
                      >
                        <Map className="h-4 w-4" />
                        Consulte la ubicación exacta en el mapa escolar{" "}
                        <ArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-3 sm:p-4 md:p-5 border-t border-gray-200 bg-white flex flex-col xs:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500 order-2 xs:order-1">
              <span className="font-medium">Última actualización:</span>{" "}
              {new Date().toLocaleDateString()}
            </div>
            <DialogClose
              asChild
              className="order-1 xs:order-2 w-full xs:w-auto"
            >
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg font-medium shadow-sm hover:shadow transition-all w-full xs:w-auto text-sm sm:text-base"
              >
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

EscuelaDetalles.displayName = "EscuelaDetalles";

export default EscuelaDetalles;
