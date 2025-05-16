import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Accordion } from "@components/ui/accordion";
import BuscadorEscuelas from "./BuscadorEscuelas";
import { EscuelaDetalles } from "@components/data/dynamic-client";
import AccordionItemUnificado from "./Accordion";
import type { Escuela } from "@src/interfaces";
import {
  getSupervisoresFicticios,
  agruparEscuelasPorDepartamento,
} from "../utils/escuelas";
import { Loader2, AlertCircle, School } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Badge } from "@components/ui/badge";

// Extender la interfaz Escuela para incluir el campo mail
interface EscuelaConMail extends Escuela {
  mail?: string | null;
}

export default function EscuelasClient() {
  // const supervisores = useMemo(() => getSupervisoresFicticios(), []);
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [escuelaSeleccionada, setEscuelaSeleccionada] =
    useState<EscuelaConMail | null>(null);
  const [escuelas, setEscuelas] = useState<EscuelaConMail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos de las escuelas
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
  const escuelasPorDepartamento = useMemo(
    () => agruparEscuelasPorDepartamento(escuelas),
    [escuelas]
  );
  // Sumar matrícula 2025
  const totalMatricula2025 = useMemo(() => {
    return escuelas.reduce(
      (acc, escuela) => acc + (escuela.matricula2025 || 0),
      0
    );
  }, [escuelas]);

  // Callbacks para evitar re-renderizados
  const handleToggleAccordion = useCallback((value: string) => {
    setExpanded(value || undefined);
  }, []);

  const handleSelectEscuela = useCallback((escuela: EscuelaConMail) => {
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

      <div className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Panel por Departamento
              </h2>
              <p className="text-gray-600">Seleccione un departamento y</p>
            </div>
            <div className="bg-[#217A4B]/10 p-3 rounded-xl">
              <School className="h-6 w-6 text-[#217A4B]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento Actual
              </label>
              <Select
                defaultValue={Object.keys(escuelasPorDepartamento)[0]}
                onValueChange={(value) => setExpanded(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 hover:border-[#217A4B]/30 transition-colors">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(escuelasPorDepartamento).map((dep) => {
                    const cantidadEscuelas =
                      escuelasPorDepartamento[dep].length;
                    return (
                      <SelectItem
                        key={dep}
                        value={dep}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <School className="h-4 w-4 text-[#217A4B]" />
                          <span className="font-medium">{dep}</span>
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-[#217A4B]/10 text-[#217A4B]"
                          >
                            {cantidadEscuelas}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Resumen de Escuelas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Escuelas</p>
                  <p className="text-2xl font-semibold text-[#217A4B]">
                    {escuelas.length}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Matrícula 2025</p>
                  <p className="text-xl font-semibold text-[#217A4B]">
                    {totalMatricula2025.toLocaleString()} alumnos en 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(escuelasPorDepartamento).map((dep) => (
          <div key={dep} className={expanded === dep ? "block mt-6" : "hidden"}>
            <Accordion
              type="single"
              collapsible
              value={expanded}
              onValueChange={setExpanded}
            >
              <AccordionItemUnificado
                agrupador={{ id: dep, nombre: dep }}
                escuelas={escuelasPorDepartamento[dep] || []}
                isExpanded={expanded === dep}
                onSelectEscuela={handleSelectEscuela}
                tipo="departamento"
              />
            </Accordion>
          </div>
        ))}
      </div>

      {escuelaSeleccionada && (
        <EscuelaDetalles
          escuela={escuelaSeleccionada}
          onClose={handleCloseDetalles}
          correoEscuela={escuelaSeleccionada.mail || "No disponible"}
        />
      )}
    </div>
  );
}
