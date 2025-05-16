import React, { useMemo, useState, useCallback } from "react";
import { Accordion } from "@components/ui/accordion";
import BuscadorEscuelas from "./BuscadorEscuelas";
import { EscuelaDetalles } from "@components/data/dynamic-client";
import AccordionItemUnificado from "./Accordion";
import type { Escuela } from "@src/interfaces";
import { agruparEscuelasPorDepartamento } from "../utils/escuelas";
import {
  Loader2,
  AlertCircle,
  School,
  Search,
  Map,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  BookOpen,
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
import { motion } from "framer-motion";

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
      (acc, escuela) => acc + (escuela.matricula2025 || 0),
      0
    );
  }, [escuelas]);

  // Sumar matrícula 2024
  const totalMatricula2024 = useMemo(() => {
    return escuelas.reduce(
      (acc, escuela) => acc + (escuela.matricula2024 || 0),
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
      <div className="p-8">
        {/* Buscador con mejor estilo */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mb-8 transform transition hover:shadow-xl relative z-20">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-emerald-100 p-3 mr-4">
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
          <BuscadorEscuelas
            escuelas={escuelas}
            onSelectEscuela={handleSelectEscuela}
          />
        </div>

        {/* Tarjetas de estadísticas con diseño mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Tarjeta 1: Total Escuelas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center">
            <div className="rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 mr-3 shadow-md">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Total Escuelas
              </p>
              <p className="text-xl font-bold text-gray-800">
                {escuelas.length}
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Departamentos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center">
            <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-2 mr-3 shadow-md">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Departamentos
              </p>
              <p className="text-xl font-bold text-gray-800">
                {Object.keys(escuelasPorDepartamento).length}
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Matrícula */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center">
            <div className="rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 mr-3 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Matrícula 2025
              </p>
              <p className="text-xl font-bold text-gray-800">
                {totalMatricula2025.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tarjeta 4: Variación Matrícula */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center">
            <div
              className={`rounded-full p-2 mr-3 shadow-md bg-gradient-to-br ${
                variacionMatricula
                  ? variacionMatricula.diferencia > 0
                    ? "from-emerald-300 to-emerald-500"
                    : variacionMatricula.diferencia < 0
                    ? "from-blue-300 to-blue-500"
                    : "from-gray-300 to-gray-500"
                  : "from-gray-300 to-gray-500"
              } border-2 ${
                variacionMatricula
                  ? variacionMatricula.diferencia > 0
                    ? "border-emerald-400"
                    : variacionMatricula.diferencia < 0
                    ? "border-blue-400"
                    : "border-gray-400"
                  : "border-gray-400"
              }`}
            >
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Variación Matrícula
              </p>
              <p
                className={`text-lg font-bold ${
                  variacionMatricula
                    ? variacionMatricula.diferencia > 0
                      ? "text-emerald-700"
                      : variacionMatricula.diferencia < 0
                      ? "text-blue-700"
                      : "text-gray-700"
                    : "text-gray-700"
                } flex items-center gap-1`}
              >
                {variacionMatricula
                  ? `${variacionMatricula.diferencia > 0 ? "+" : ""}${
                      variacionMatricula.diferencia
                    } (${variacionMatricula.porcentaje}%)`
                  : "Sin datos"}
              </p>
              {variacionMatricula && (
                <span className="text-xs text-gray-500 mt-1 block">
                  {variacionMatricula.diferencia > 0
                    ? "¡Aumento respecto a 2024!"
                    : variacionMatricula.diferencia < 0
                    ? "Leve descenso respecto a 2024"
                    : "Sin cambios respecto a 2024"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Panel por departamento mejorado */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-8 transform transition hover:shadow-xl z-10 relative">
          <div className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-white mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Panel por Departamento
                  </h2>
                  <p className="text-emerald-50 opacity-90 text-sm mt-1">
                    Explore escuelas organizadas por ubicación geográfica
                  </p>
                </div>
              </div>
              <Badge className="hidden md:flex bg-white text-emerald-700 font-bold px-3 py-1">
                {Object.keys(escuelasPorDepartamento).length} departamentos
              </Badge>
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
                <SelectTrigger className="w-full bg-white border-gray-200 hover:border-emerald-300 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
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
                        className="flex items-center justify-between py-2 hover:bg-emerald-50"
                      >
                        <div className="flex items-center space-x-2">
                          <Map className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">{dep}</span>
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-emerald-100 text-emerald-700"
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
          </div>
        </div>

        {/* Acordeón de departamentos con animaciones */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mt-6 z-10 relative">
          <div className="p-1">
            {expanded &&
              Object.keys(escuelasPorDepartamento).map((dep) => (
                <div
                  key={dep}
                  className={expanded === dep ? "block" : "hidden"}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
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
                  </motion.div>
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

      {/* Modal de detalles mejorado */}
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
