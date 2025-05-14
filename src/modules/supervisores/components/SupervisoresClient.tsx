import React, { useMemo, useState, Suspense, useCallback } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";
import { School, Loader2, SearchIcon, CheckCircle2 } from "lucide-react";
import BuscadorEscuelas from "./BuscadorEscuelas";
import {
  EscuelaDetalles,
  EscuelasTable,
} from "../../../components/data/dynamic-client";
import SupervisoresAccordionItem from "./Accordion";

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
  supervisorID: number;
}

export interface Supervisor {
  id: number;
  nombre: string;
}

interface SupervisoresClientProps {
  datosSimulados: Escuela[];
}

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
  const supervisor = useMemo(() => getSupervisoresFicticios(), []);
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
        <Accordion
          type="single"
          collapsible
          value={expanded}
          onValueChange={setExpanded}
        >
          {supervisor.map((sup) => (
            <SupervisoresAccordionItem
              key={sup.id}
              supervisor={sup}
              escuelas={escuelasPorSupervisor[sup.id] || []}
              isExpanded={expanded === String(sup.id)}
              onSelectEscuela={handleSelectEscuela}
            />
          ))}
        </Accordion>
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
