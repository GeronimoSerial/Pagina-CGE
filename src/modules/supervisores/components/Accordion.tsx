import { School, CheckCircle2, Loader2, SearchIcon } from "lucide-react";
import React, { Suspense } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Escuela } from "./SupervisoresClient";
import { EscuelasTable } from "../../../components/data/dynamic-client";

interface Props {
  supervisor: {
    id: number;
    nombre: string;
  };
  escuelas: Escuela[];
  isExpanded: boolean;
  onSelectEscuela: (escuela: Escuela) => void;
}

// Componente para manejar todos los accordions juntos

const SupervisorAccordionItem = React.memo(
  ({ supervisor, escuelas, isExpanded, onSelectEscuela }: Props) => {
    const supervisorId = String(supervisor.id);
    const cantidadEscuelas = escuelas.length;

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
                  No hay escuelas asignadas
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Este supervisor no tiene escuelas asignadas actualmente en el
                  sistema.
                </p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);
SupervisorAccordionItem.displayName = "SupervisorAccordionItem";
export default SupervisorAccordionItem;
