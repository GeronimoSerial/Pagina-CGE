import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Accordion } from "@components/ui/accordion";
import BuscadorEscuelas from "./BuscadorEscuelas";
import { EscuelaDetalles } from "@components/data/dynamic-client";
import SupervisoresAccordionItem from "./Accordion";
import type { Escuela } from "@src/interfaces";
import { agruparEscuelasPorSupervisor } from "../utils/escuelas";
import { getSupervisoresFicticios } from "../utils/escuelas";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";

const supervisores = useMemo(() => getSupervisoresFicticios(), []);

export default function SupervisoresClient() {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [escuelaSeleccionada, setEscuelaSeleccionada] =
    useState<Escuela | null>(null);
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch("/api/escuelas")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar los datos");
        }
        return response.json();
      })
      .then((data) => {
        setEscuelas(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de las escuelas:", error);
        setError(
          "No se pudieron cargar los datos de las escuelas. Por favor, intente más tarde."
        );
        setIsLoading(false);
      });
  }, []);

  //memoización
  const escuelasPorSupervisor = useMemo(
    () => agruparEscuelasPorSupervisor(escuelas),
    [escuelas]
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin" />
        <span className="ml-3 text-lg text-gray-600">
          Cargando datos de escuelas...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!escuelas.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay escuelas disponibles en este momento.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md border border-gray-100 p-8">
      <div className="mb-10">
        {/* Integración del buscador de escuelas */}
        <div className="ml-6 mb-4">
          <BuscadorEscuelas
            escuelas={escuelas}
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
          {supervisores.map((sup) => (
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
