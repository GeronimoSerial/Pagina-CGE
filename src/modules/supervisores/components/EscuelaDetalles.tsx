import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Escuela } from "./SupervisoresClient";
import {
  School,
  User,
  Users,
  MapPin,
  Calendar,
  Building,
  Clock,
  Wifi,
  Info,
  BookOpen,
  MonitorSmartphone,
  Home,
  BookText,
  X,
} from "lucide-react";

interface EscuelaDetallesProps {
  escuela: Escuela;
  onClose: () => void;
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
    <div className="flex items-start">
      <Icon className="h-4 w-4 mt-1 mr-3 text-[#217A4B] flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-700">{label}:</p>
        <p className="text-sm text-gray-800 break-words">
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
    light = false,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    light?: boolean;
  }) => (
    <div
      className={`rounded-xl p-4 sm:p-5 border ${
        light
          ? "bg-white border-gray-100"
          : "bg-[#217A4B]/5 border-[#217A4B]/20"
      }`}
    >
      <h3 className="text-base sm:text-lg font-semibold text-[#205C3B] mb-3 sm:mb-4 flex items-center">
        <div className="bg-[#217A4B]/20 p-1.5 rounded-lg mr-3 flex-shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#217A4B]" />
        </div>
        <span className="truncate">{title}</span>
      </h3>
      {children}
    </div>
  )
);

Section.displayName = "Section";

// Estadísticas de matrícula
const MatriculaStats = memo(({ escuela }: { escuela: Escuela }) => {
  // Calcular el cambio porcentual en la matrícula de 2024 a 2025
  const porcentajeCambio = escuela.matricula2024
    ? (
        ((escuela.matricula2025 - escuela.matricula2024) /
          escuela.matricula2024) *
        100
      ).toFixed(1)
    : 0;

  // Determinar si hubo aumento, disminución o sin cambio
  const cambio = Number(porcentajeCambio);
  const tendencia =
    cambio > 0 ? "aumento" : cambio < 0 ? "disminución" : "sin cambios";
  const tendenciaColor =
    cambio > 0
      ? "text-green-600"
      : cambio < 0
      ? "text-red-500"
      : "text-gray-500";

  return (
    <Section title="Matrícula" icon={Users} light>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center p-3 sm:p-4 bg-[#217A4B]/5 rounded-lg border border-[#217A4B]/10">
          <p className="text-xs text-gray-600 mb-1">Matrícula 2024</p>
          <p className="text-xl sm:text-2xl font-bold text-[#217A4B]">
            {escuela.matricula2024}
          </p>
        </div>
        <div className="text-center p-3 sm:p-4 bg-[#217A4B]/5 rounded-lg border border-[#217A4B]/10">
          <p className="text-xs text-gray-600 mb-1">Matrícula 2025</p>
          <p className="text-xl sm:text-2xl font-bold text-[#217A4B]">
            {escuela.matricula2025}
          </p>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
        <p>
          <span className="font-medium">Variación matrícula: </span>
          <span className={tendenciaColor}>
            {cambio === 0
              ? "Sin cambios"
              : `${cambio > 0 ? "+" : ""}${porcentajeCambio}% (${Math.abs(
                  escuela.matricula2025 - escuela.matricula2024
                )} alumnos)`}
          </span>
        </p>
      </div>
    </Section>
  );
});

MatriculaStats.displayName = "MatriculaStats";

// Componente principal - memoizado para máximo rendimiento
const EscuelaDetalles = memo(({ escuela, onClose }: EscuelaDetallesProps) => {
  if (!escuela) return null;

  return (
    <Dialog open={!!escuela} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[90vh] w-[95vw] md:w-auto rounded-xl">
        <DialogHeader className="bg-gradient-to-r from-[#205C3B]/10 to-[#217A4B]/10 p-4 sm:p-6 border-b border-gray-200 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 text-gray-500 hover:text-gray-700 hover:bg-[#217A4B]/10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-gradient-to-br from-[#217A4B] to-[#205C3B] rounded-xl p-3 inline-flex shadow-md">
              <School className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-[#205C3B] break-words leading-tight">
                {escuela.nombre}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 text-sm sm:text-base">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-xs sm:text-sm">
                  CUE: {escuela.cue}
                </span>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                  <span className="break-all">
                    {escuela.departamento}, {escuela.localidad}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:border-[#217A4B]/50 transition-all flex items-center">
              <div className="bg-[#217A4B]/10 p-2 rounded-lg mr-3">
                <User className="h-5 w-5 text-[#217A4B]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Director/a</p>
                <p className="font-semibold text-sm truncate">
                  {escuela.director || "No especificado"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:border-[#217A4B]/50 transition-all flex items-center">
              <div className="bg-[#217A4B]/10 p-2 rounded-lg mr-3">
                <BookText className="h-5 w-5 text-[#217A4B]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">
                  Tipo de Escuela
                </p>
                <p className="font-semibold text-sm truncate">
                  {escuela.tipoEscuela || "No especificado"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:border-[#217A4B]/50 transition-all flex items-center">
              <div className="bg-[#217A4B]/10 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-[#217A4B]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Turno</p>
                <p className="font-semibold text-sm truncate">
                  {escuela.turno || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-5 sm:space-y-6">
              <MatriculaStats escuela={escuela} />

              <Section title="Información General" icon={Info}>
                <div className="space-y-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <InfoDetail
                    icon={Home}
                    label="Cabecera"
                    value={escuela.cabecera}
                  />
                  <InfoDetail
                    icon={MapPin}
                    label="Ubicación"
                    value={escuela.ubicacion}
                  />
                </div>
              </Section>

              <Section title="Servicios" icon={Building}>
                <div className="space-y-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <InfoDetail
                    icon={Wifi}
                    label="Conexión a Internet"
                    value={escuela.conexionInternet}
                  />
                  <InfoDetail
                    icon={Calendar}
                    label="Empresa de Limpieza"
                    value={escuela.empresaLimpieza}
                  />
                </div>
              </Section>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <Section title="Programas de Acompañamiento" icon={BookOpen}>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {escuela.programasAcompañamiento ||
                      "No hay programas de acompañamiento especificados para esta escuela."}
                  </p>
                </div>
              </Section>

              <Section
                title="Problemáticas Identificadas"
                icon={MonitorSmartphone}
              >
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {escuela.problematicas ||
                      "No se han identificado problemáticas específicas para esta escuela."}
                  </p>
                </div>
              </Section>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#217A4B] to-[#205C3B] hover:from-[#205C3B] hover:to-[#16412b] text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto px-8 py-2 rounded-lg font-medium"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EscuelaDetalles.displayName = "EscuelaDetalles";

export default EscuelaDetalles;
