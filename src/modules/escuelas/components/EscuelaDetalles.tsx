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
  User,
  Users,
  MapPin,
  Clock,
  Info,
  Home,
  BookText,
  X,
  Mail,
  BarChart3,
  Building2,
  Shield,
  Bookmark,
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
    <div className="bg-gradient-to-br from-[#217A4B]/5 to-[#217A4B]/15 rounded-xl p-4 md:p-5 border border-[#217A4B]/20 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#217A4B]" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-[#205C3B]">
          Matrícula Escolar
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center justify-center hover:border-[#217A4B]/30 transition-all transform hover:-translate-y-1 duration-300">
          <p className="text-sm text-gray-500 mb-1 font-medium">2024</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#217A4B]">
            {escuela.matricula2024}
          </p>
          <p className="text-xs text-gray-500 mt-1.5">alumnos</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center justify-center hover:border-[#217A4B]/30 transition-all transform hover:-translate-y-1 duration-300">
          <p className="text-sm text-gray-500 mb-1 font-medium">2025</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#217A4B]">
            {escuela.matricula2025}
          </p>
          <p className="text-xs text-gray-500 mt-1.5">alumnos</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div
          className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full ${tendenciaColor} bg-white shadow-md border border-gray-100 flex items-center gap-2.5 text-sm font-medium hover:shadow-lg transition-all duration-300`}
        >
          <span className="font-bold text-base">{tendenciaIcon}</span>
          <span>
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
    <div className="flex items-center gap-3 bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-100 hover:border-[#217A4B]/40 transition-all hover:shadow-md group transform hover:-translate-y-0.5 duration-200">
      <div className="bg-[#217A4B]/10 p-2 rounded-full group-hover:bg-[#217A4B]/20 transition-all duration-200">
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#217A4B]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-sm truncate text-gray-800 mt-0.5">
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden w-[95vw] md:w-auto rounded-l shadow-xl border-0 max-h-[95vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-[2%] data-[state=open]:slide-in-from-bottom-[2%] duration-300">
          {/* Cabecera con gradiente y cierre */}
          <div className="bg-gradient-to-r from-[#1a5034] via-[#217A4B] to-[#2a8d59] p-4 md:p-6 text-white relative shrink-0">
            <div className="flex items-center gap-4 md:gap-5 mb-3 md:mb-5">
              <div className="bg-white/15 p-3 md:p-4 rounded-full backdrop-blur-sm shadow-lg">
                <School className="h-7 w-7 md:h-9 md:w-9" />
              </div>
              <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-bold break-words tracking-tight">
                {escuela.nombre}
              </DialogTitle>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-sm hover:bg-white/25 transition-all cursor-default duration-200">
                <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-sm font-medium">CUE: {escuela.cue}</span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-sm hover:bg-white/25 transition-all cursor-default duration-200">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-sm font-medium truncate max-w-[200px] md:max-w-[250px]">
                  {escuela.departamento}, {escuela.localidad}
                </span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-sm hover:bg-white/25 transition-all cursor-default duration-200">
                <Bookmark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-sm font-medium truncate max-w-[200px] md:max-w-[250px]">
                  {escuela.tipoEscuela}
                </span>
              </div>
            </div>
          </div>

          {/* Información rápida */}
          <div className="bg-[#F9FAFB] border-b border-gray-200 shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 md:gap-4 md:p-4 lg:p-5">
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
          <div className="p-4 md:p-6 overflow-y-auto flex-grow bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <MatriculaStats escuela={escuela} />

              <Section title="Información Detallada" icon={Info}>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
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
          <DialogFooter className="p-4 md:p-5 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
            <DialogClose asChild>
              <Button className="bg-[#217A4B] hover:bg-[#166039] text-white shadow-md hover:shadow-lg transition-all px-8 md:px-10 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium">
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
