import React, { useMemo, useState, useCallback } from "react";
import { Accordion } from "@components/ui/accordion";
import BuscadorEscuelas from "./BuscadorEscuelas";
import { EscuelaDetalles } from "@components/data/dynamic-client";
import AccordionItemUnificado from "./Accordion";
import type { Escuela } from "@src/interfaces";
import { agruparEscuelasPorDepartamento } from "../utils/escuelas";
import {
  AlertCircle,
  School,
  Search,
  Map,
  Users,
  Building2,
} from "lucide-react";
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

export default function EscuelasClient({
  escuelas,
}: {
  escuelas: EscuelaConMail[];
}) {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [escuelaSeleccionada, setEscuelaSeleccionada] =
    useState<EscuelaConMail | null>(null);

  //memoización
  const escuelasPorDepartamento = useMemo(
    () => agruparEscuelasPorDepartamento(escuelas),
    [escuelas]
  );

  // Sumar matrícula 2025
  const totalMatricula2025 = useMemo(() => {
    return escuelas.reduce(
      (acc, escuela) => acc + Number(escuela.matricula2025 || 0),
      0
    );
  }, [escuelas]);

  // Sumar matrícula 2024
  const totalMatricula2024 = useMemo(() => {
    return escuelas.reduce(
      (acc, escuela) => acc + Number(escuela.matricula2024 || 0),
      0
    );
  }, [escuelas]);

  // Variación de matrícula
  const variacionMatricula = useMemo(() => {
    if (totalMatricula2024 === 0) return null;
    const diferencia = totalMatricula2025 - totalMatricula2024;
    const porcentaje = ((diferencia / totalMatricula2024) * 100).toFixed(1);
    return { diferencia, porcentaje };
  }, [totalMatricula2024, totalMatricula2025]);

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

  if (!escuelas.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="rounded-xl border-amber-200 bg-amber-50 shadow-md w-full max-w-md">
          <AlertCircle className="h-6 w-6 text-amber-500" />
          <AlertDescription className="font-medium text-amber-800 ml-2">
            No hay escuelas disponibles en este momento.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 space-y-6">
        {/* Search section with improved responsive design */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 transform transition hover:shadow-xl relative z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="rounded-full bg-emerald-100 p-3 shrink-0">
              <Search className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Búsqueda de Instituciones
              </h2>
              <p className="text-sm text-gray-500">
                Encuentra rápidamente cualquier institución.
              </p>
            </div>
          </div>
          <div className="w-full">
            <BuscadorEscuelas
              escuelas={escuelas}
              onSelectEscuela={handleSelectEscuela}
            />
          </div>
        </div>
        {/* Stats cards with improved responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] p-2 mr-3 shadow-md">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Total Escuelas
              </p>
              <p className="text-xl font-bold text-gray-800">
                {escuelas.length}
              </p>
              <p className="text-sm text-gray-500">
                en {Object.keys(escuelasPorDepartamento).length} departamentos
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] p-2 mr-3 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Matrícula 2025
              </p>
              <p className="text-xl font-bold text-gray-800">
                {totalMatricula2025.toLocaleString()} alumnos
              </p>
              <p className="text-sm text-gray-500">
                en la provincia de Corrientes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-8 transform transition hover:shadow-xl z-10 relative">
          <div className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-white mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Panel por Departamento
                  </h2>
                  <p className="text-white opacity-90 text-sm mt-1">
                    Explore escuelas organizadas por ubicación geográfica
                  </p>
                </div>
              </div>
              <span className="hidden md:flex bg-white text-[#2D6A27] text-sm rounded-full font-bold px-3 py-1">
                {Object.keys(escuelasPorDepartamento).length} departamentos
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Departamento
              </label>
              <Select
                value={expanded}
                onValueChange={(value) => setExpanded(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 hover:border-[#3D8B37] transition-colors focus:ring-2 focus:ring-[#3D8B37] focus:ring-opacity-50">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(escuelasPorDepartamento)
                    .sort((a, b) => a.localeCompare(b))
                    .map((dep) => {
                      const cantidadEscuelas =
                        escuelasPorDepartamento[dep].length;
                      return (
                        <SelectItem
                          key={dep}
                          value={dep}
                          className="flex items-center justify-between py-2 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900"
                        >
                          <div className="flex items-center space-x-3">
                            <Map className="h-4 w-4 text-[#3D8B37] group-hover:text-[#2D6A27] transition-colors" />
                            <span className="font-medium">{dep}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mt-6 z-10 relative">
          <div className="p-1">
            {expanded &&
              Object.keys(escuelasPorDepartamento).map((dep) => (
                <div
                  key={dep}
                  className={expanded === dep ? "block" : "hidden"}
                >
                  <Accordion
                    type="single"
                    collapsible
                    value={expanded}
                    onValueChange={setExpanded}
                    className="border-0"
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

            {!expanded && (
              <div className="flex flex-col items-center justify-center p-16 text-center animate-fade-in">
                <Map className="h-12 w-12 text-emerald-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Seleccione un departamento
                </h3>
                <p className="text-gray-500 max-w-md">
                  Utilice el selector de arriba para explorar las instituciones
                  educativas por departamento
                </p>
              </div>
            )}
          </div>
        </div>
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
