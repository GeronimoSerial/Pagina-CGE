import React, { useMemo, useState, Suspense, useCallback, lazy } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";
import { School, Loader2, SearchIcon, CheckCircle2 } from "lucide-react";
import BuscadorEscuelas from "./BuscadorEscuelas";
import {
  EscuelasTable,
  EscuelaDetalles,
} from "../../../components/data/dynamic-client";

export interface Escuela {
  cue: number;
  nombre: string;
  director: string;
  matricula2024: number;
  matricula2025: number;
  tipoEscuela: string;
  departamento: string;
  localidad: string;
  turno: string;
  ubicacion: string;
  cabecera: string;
  empresaLimpieza: string;
  conexionInternet: string;
  programasAcompañamiento: string;
  problematicas: string;
  supervisorID: number;
}

interface SupervisoresClientProps {
  datosSimulados: Escuela[];
}

// Componente para manejar todos los accordions juntos
const SupervisoresAccordion = ({
  supervisores,
  escuelasPorSupervisor,
  expanded,
  onToggle,
  onSelectEscuela,
}: {
  supervisores: Array<{ id: number; nombre: string }>;
  escuelasPorSupervisor: { [key: number]: Escuela[] };
  expanded: string | undefined;
  onToggle: (value: string) => void;
  onSelectEscuela: (escuela: Escuela) => void;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      value={expanded}
      onValueChange={onToggle}
      className="space-y-4"
    >
      {supervisores.map((supervisor) => {
        const escuelas = escuelasPorSupervisor[supervisor.id] || [];
        const cantidadEscuelas = escuelas.length;
        const supervisorId = String(supervisor.id);
        const isExpanded = expanded === supervisorId;

        return (
          <AccordionItem
            key={supervisorId}
            value={supervisorId}
            className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 ${
              isExpanded
                ? "shadow-md border-[#217A4B]/30 transform scale-[1.01]"
                : "hover:border-gray-300 hover:shadow"
            }`}
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center w-full">
                <div
                  className={`rounded-full p-2.5 mr-4 transition-colors ${
                    isExpanded
                      ? "bg-[#217A4B]/20 text-[#217A4B]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <School className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span
                    className={`font-semibold text-lg ${
                      isExpanded ? "text-[#205C3B]" : "text-gray-700"
                    }`}
                  >
                    {supervisor.nombre}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    <span>
                      {cantidadEscuelas}{" "}
                      {cantidadEscuelas === 1
                        ? "escuela asignada"
                        : "escuelas asignadas"}
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isExpanded
                        ? "bg-[#217A4B]/20 text-[#217A4B]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isExpanded ? "Expandido" : "Ver escuelas"}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-50 border-t border-gray-100">
              <div className="px-4 py-4">
                {cantidadEscuelas > 0 ? (
                  <Suspense
                    fallback={
                      <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin mb-4" />
                          <p className="text-gray-600 text-sm">
                            Cargando datos de escuelas...
                          </p>
                        </div>
                      </div>
                    }
                  >
                    {expanded === supervisorId && (
                      <EscuelasTable
                        escuelas={escuelas}
                        onSelectEscuela={onSelectEscuela}
                      />
                    )}
                  </Suspense>
                ) : (
                  <div className="text-center py-12 px-4">
                    <SearchIcon className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
                    <h3 className="text-gray-700 font-medium text-lg mb-2">
                      No hay escuelas asignadas
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Este supervisor no tiene escuelas asignadas actualmente en
                      el sistema.
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

// Función para crear datos de supervisores
function getSupervisoresFicticios() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    nombre: `Supervisor/a ${i + 1}`,
  }));
}

// Función para agrupar escuelas por supervisor
function agruparEscuelasPorSupervisor(escuelas: Escuela[]) {
  const mapa: { [key: number]: Escuela[] } = {};
  escuelas.forEach((escuela) => {
    if (!mapa[escuela.supervisorID]) mapa[escuela.supervisorID] = [];
    mapa[escuela.supervisorID].push(escuela);
  });
  return mapa;
}

export default function SupervisoresClient({
  datosSimulados,
}: SupervisoresClientProps) {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [escuelaSeleccionada, setEscuelaSeleccionada] =
    useState<Escuela | null>(null);

  // Memoización de datos pesados
  const supervisores = useMemo(() => getSupervisoresFicticios(), []);
  const escuelasPorSupervisor = useMemo(
    () => agruparEscuelasPorSupervisor(datosSimulados),
    [datosSimulados]
  );

  // Callbacks para evitar re-renderizados
  const handleToggleAccordion = useCallback((value: string) => {
    setExpanded(value || undefined);
  }, []);

  const handleSelectEscuela = useCallback((escuela: Escuela) => {
    setEscuelaSeleccionada(escuela);
  }, []);

  const handleCloseDetalles = useCallback(() => {
    setEscuelaSeleccionada(null);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md border border-gray-100 p-8">
      <div className="mb-10">
        {/* Integración del buscador de escuelas */}
        <div className="ml-6 mb-4">
          <BuscadorEscuelas
            escuelas={datosSimulados}
            onSelectEscuela={handleSelectEscuela}
          />
        </div>
      </div>

      <div>
        <SupervisoresAccordion
          supervisores={supervisores}
          escuelasPorSupervisor={escuelasPorSupervisor}
          expanded={expanded}
          onToggle={handleToggleAccordion}
          onSelectEscuela={handleSelectEscuela}
        />
      </div>

      {escuelaSeleccionada && (
        <EscuelaDetalles
          escuela={escuelaSeleccionada}
          onClose={handleCloseDetalles}
        />
      )}
    </div>
  );
}
