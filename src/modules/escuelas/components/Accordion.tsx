import { Loader2, SearchIcon, Building2 } from "lucide-react";
import React, { Suspense } from "react";
import { AccordionContent, AccordionItem } from "@components/ui/accordion";
import { EscuelasTable } from "@components/data/dynamic-client";
import type { Escuela } from "@/src/interfaces";

interface Props {
  agrupador: {
    id: number | string;
    nombre: string;
  };
  escuelas: Escuela[];
  isExpanded: boolean;
  onSelectEscuela: (escuela: Escuela) => void;
  tipo: "supervisor" | "departamento";
}

// Componente Accordion unificado para departamentos y supervisores
export const AccordionItemUnificado = React.memo(
  ({ agrupador, escuelas, isExpanded, onSelectEscuela, tipo }: Props) => {
    const id = String(agrupador.id);
    const cantidadEscuelas = escuelas.length;
    // Textos condicionales
    const titulo = agrupador.nombre;
    const cantidadTexto =
      tipo === "departamento"
        ? cantidadEscuelas === 1
          ? "escuela en el departamento"
          : "escuelas en el departamento"
        : cantidadEscuelas === 1
        ? "escuela asignada"
        : "escuelas asignadas";
    const vacioTitulo =
      tipo === "departamento"
        ? "No hay escuelas en este departamento"
        : "No hay escuelas asignadas";
    const vacioDescripcion =
      tipo === "departamento"
        ? "Este departamento no tiene escuelas asignadas actualmente en el sistema."
        : "Este supervisor no tiene escuelas asignadas actualmente en el sistema.";
    return (
      <AccordionItem
        key={id}
        value={id}
        className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 ${
          isExpanded
            ? "shadow-md border-[#217A4B]/30 transform scale-[1.01]"
            : "hover:border-gray-300 hover:shadow"
        }`}
      >
        {/* Encabezado personalizado sin botón de desplegar */}
        <div className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] p-6 rounded-l w-full flex items-center justify-between cursor-default select-none">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-white mr-4" />
            <div>
              <h3 className="text-xl font-bold text-white">
                {tipo === "departamento" ? (
                  <>
                    Departamento:{" "}
                    <u className="decoration-emerald-200/80">{titulo}</u>
                  </>
                ) : (
                  titulo
                )}
              </h3>
              <p className="text-emerald-50 opacity-90 text-sm mt-1">
                Mostrando <b>{cantidadEscuelas}</b> {cantidadTexto}
              </p>
            </div>
          </div>
          <span className="hidden md:flex bg-white text-[#2D6A27] font-bold px-3 py-1 text-sm rounded-xl">
            {cantidadEscuelas} instituciones
          </span>
        </div>
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
                {isExpanded && (
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
                  {vacioTitulo}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {vacioDescripcion}
                </p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);
AccordionItemUnificado.displayName = "AccordionItemUnificado";

export default AccordionItemUnificado;
