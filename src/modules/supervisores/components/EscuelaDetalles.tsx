import React, { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import type { Escuela } from "@src/interfaces";
import {
  School,
  User,
  Users,
  MapPin,
  Clock,
  Info,
  Home,
  BookText,
  X,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Building2,
  Shield,
} from "lucide-react";
import { getSupervisoresFicticios } from "../utils/escuelas";

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
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-[#217A4B]/30 transition-all hover:shadow-sm">
      <div className="bg-[#217A4B]/10 p-2 rounded-lg flex-shrink-0">
        <Icon className="h-4 w-4 text-[#217A4B]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">
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
      <h3 className="text-base font-semibold text-[#205C3B] flex items-center gap-2">
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
      ? "text-emerald-600"
      : cambio < 0
      ? "text-rose-600"
      : "text-gray-600";

  const tendenciaIcon = cambio > 0 ? "↑" : cambio < 0 ? "↓" : "→";

  return (
    <div className="bg-gradient-to-br from-[#217A4B]/5 to-[#217A4B]/10 rounded-xl p-3 md:p-4 border border-[#217A4B]/20">
      <div className="flex items-center gap-2 mb-2 md:mb-3">
        <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-[#217A4B]" />
        <h3 className="text-base md:text-lg font-semibold text-[#205C3B]">
          Matrícula Escolar
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-xs md:text-sm text-gray-500 mb-1">2024</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#217A4B]">
            {escuela.matricula2024}
          </p>
          <p className="text-xs text-gray-500 mt-1">alumnos</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-xs md:text-sm text-gray-500 mb-1">2025</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#217A4B]">
            {escuela.matricula2025}
          </p>
          <p className="text-xs text-gray-500 mt-1">alumnos</p>
        </div>
      </div>

      <div className="mt-2 md:mt-3 flex items-center justify-center">
        <div
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full ${tendenciaColor} bg-white shadow-sm border border-gray-100 flex items-center gap-2 text-sm`}
        >
          <span className="font-bold">{tendenciaIcon}</span>
          <span className="font-medium">
            {cambio === 0
              ? "Sin cambios"
              : `${cambio > 0 ? "+" : ""}${porcentajeCambio}% (${Math.abs(
                  escuela.matricula2025 - escuela.matricula2024
                )} alumnos)`}
          </span>
        </div>
      </div>
    </div>
  );
});

MatriculaStats.displayName = "MatriculaStats";

// Componente de información rápida
const QuickInfo = memo(
  ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2 md:p-3 shadow-sm border border-gray-100 hover:border-[#217A4B]/30 transition-all hover:shadow-md">
      <div className="bg-[#217A4B]/10 p-1.5 md:p-2 rounded-full">
        <Icon className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#217A4B]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-xs md:text-sm truncate">
          {value || "No especificado"}
        </p>
      </div>
    </div>
  )
);

QuickInfo.displayName = "QuickInfo";

// Componente principal - memoizado para máximo rendimiento
const EscuelaDetalles = memo(
  ({
    escuela,
    onClose,
    correoEscuela = "No disponible",
  }: EscuelaDetallesProps) => {
    if (!escuela) return null;

    // Obtener supervisores ficticios y encontrar el supervisor correspondiente
    const supervisores = useMemo(() => getSupervisoresFicticios(), []);
    const supervisor = useMemo(
      () =>
        supervisores.find((s) => s.id === escuela.supervisorID) || {
          id: 0,
          nombre: "No asignado",
        },
      [supervisores, escuela.supervisorID]
    );

    return (
      <Dialog open={!!escuela} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden w-[98vw] md:w-auto rounded-xl shadow-xl border-0 max-h-[95vh] flex flex-col">
          {/* Cabecera con gradiente y cierre */}
          <div className="bg-gradient-to-r from-[#205C3B] to-[#217A4B] p-3 md:p-5 text-white relative shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 md:right-3 md:top-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
              <div className="bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-sm">
                <School className="h-5 w-5 md:h-8 md:w-8" />
              </div>
              <DialogTitle className="text-lg md:text-2xl lg:text-3xl font-bold break-words">
                {escuela.nombre}
              </DialogTitle>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 mt-1">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5">
                <Building2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="text-xs md:text-sm font-medium">
                  CUE: {escuela.cue}
                </span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5">
                <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-[200px]">
                  {escuela.departamento}, {escuela.localidad}
                </span>
              </div>
            </div>
          </div>

          {/* Información rápida */}
          <div className="bg-[#F9FAFB] border-b border-gray-200 shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 md:gap-3 md:p-4">
              <QuickInfo
                icon={Shield}
                label="Supervisor/a"
                value={supervisor.nombre}
              />
              <QuickInfo
                icon={BookText}
                label="Tipo"
                value={escuela.tipoEscuela}
              />
              <QuickInfo icon={Clock} label="Turno" value={escuela.turno} />
              <QuickInfo
                icon={Mail}
                label="Cabecera"
                value={escuela.cabecera}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-3 md:p-5 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              <MatriculaStats escuela={escuela} />

              <Section title="Información Detallada" icon={Info}>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  <InfoDetail
                    icon={MapPin}
                    label="Ubicación"
                    value={escuela.ubicacion}
                  />
                  <InfoDetail
                    icon={User}
                    label="Director/a"
                    value={escuela.director}
                  />
                  <InfoDetail
                    icon={Building2}
                    label="Departamento"
                    value={escuela.departamento}
                  />
                  <InfoDetail
                    icon={Mail}
                    label="Correo"
                    value={correoEscuela}
                  />
                </div>
              </Section>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-3 md:p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row justify-end gap-2 md:gap-3 shrink-0">
            <Button
              onClick={onClose}
              className="bg-[#217A4B] hover:bg-[#166039] text-white shadow-sm hover:shadow-md transition-all px-6 md:px-8 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

EscuelaDetalles.displayName = "EscuelaDetalles";

export default EscuelaDetalles;
