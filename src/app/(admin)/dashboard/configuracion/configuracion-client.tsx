"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { FeriadosTable } from "@dashboard/components/feriados-table";
import { JornadaConfigTable } from "@dashboard/components/jornada-config-table";
import { ExcepcionesTable } from "@dashboard/components/excepciones-table";
import { WhitelistTable } from "@dashboard/components/whitelist-table";
import {
  getFeriados,
  getAniosFeriados,
  getEmpleadosConJornada,
  getExcepciones,
  getWhitelist,
} from "@dashboard/actions/actions";
import {
  Feriado,
  EmpleadoConJornada,
  ExcepcionAsistencia,
  WhitelistEmpleado,
} from "@dashboard/lib/types";
import {
  IconCalendarEvent,
  IconClock,
  IconBeach,
  IconShieldCheck,
} from "@tabler/icons-react";
import { getArgentinaYear } from "@dashboard/lib/utils";

interface ConfiguracionClientProps {
  initialFeriados: Feriado[];
  initialAniosFeriados: number[];
  initialEmpleados: EmpleadoConJornada[];
  initialExcepciones: ExcepcionAsistencia[];
  initialWhitelist: WhitelistEmpleado[];
  initialListaEmpleados: { legajo: string; nombre: string }[];
}

export function ConfiguracionClient({
  initialFeriados,
  initialAniosFeriados,
  initialEmpleados,
  initialExcepciones,
  initialWhitelist,
  initialListaEmpleados,
}: ConfiguracionClientProps) {
  const [feriados, setFeriados] = useState<Feriado[]>(initialFeriados);
  const [aniosFeriados, setAniosFeriados] = useState<number[]>(
    initialAniosFeriados
  );
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | undefined>(
    initialAniosFeriados[0] || getArgentinaYear()
  );
  const [empleados, setEmpleados] =
    useState<EmpleadoConJornada[]>(initialEmpleados);
  const [excepciones, setExcepciones] =
    useState<ExcepcionAsistencia[]>(initialExcepciones);
  const [whitelist, setWhitelist] = useState<WhitelistEmpleado[]>(
    initialWhitelist
  );
  const [activeTab, setActiveTab] = useState("feriados");

  const loadFeriados = useCallback(async () => {
    const [feriadosData, aniosData] = await Promise.all([
      getFeriados(anioSeleccionado),
      getAniosFeriados(),
    ]);
    setFeriados(feriadosData);

    // Si no hay años, agregar el actual
    if (aniosData.length === 0) {
      aniosData.push(getArgentinaYear());
    }
    setAniosFeriados(aniosData);
  }, [anioSeleccionado]);

  const loadEmpleados = useCallback(async () => {
    const data = await getEmpleadosConJornada();
    setEmpleados(data);
  }, []);

  const loadExcepciones = useCallback(async () => {
    const data = await getExcepciones();
    setExcepciones(data);
  }, []);

  const loadWhitelist = useCallback(async () => {
    const data = await getWhitelist();
    setWhitelist(data);
  }, []);

  const handleAnioChange = async (anio: number | undefined) => {
    setAnioSeleccionado(anio);
    const feriadosData = await getFeriados(anio);
    setFeriados(feriadosData);
  };

  return (
    <div className="px-4 lg:px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger
            value="feriados"
            className="cursor-pointer flex items-center gap-2"
          >
            <IconCalendarEvent className="h-4 w-4" />
            <span className="hidden sm:inline">Feriados</span>
          </TabsTrigger>
          <TabsTrigger
            value="jornadas"
            className="cursor-pointer flex items-center gap-2"
          >
            <IconClock className="h-4 w-4" />
            <span className="hidden sm:inline">Jornadas</span>
          </TabsTrigger>
          <TabsTrigger
            value="excepciones"
            className="cursor-pointer flex items-center gap-2"
          >
            <IconBeach className="h-4 w-4" />
            <span className="hidden sm:inline">Excepciones</span>
          </TabsTrigger>
          <TabsTrigger
            value="whitelist"
            className="cursor-pointer flex items-center gap-2"
          >
            <IconShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Whitelist</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feriados" className="mt-6">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">
                Gestión de Feriados
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Los feriados se excluyen automáticamente del cálculo de
                ausencias. Agregue, edite o elimine feriados según corresponda.
              </p>
              <FeriadosTable
                feriados={feriados}
                aniosDisponibles={aniosFeriados}
                anioSeleccionado={anioSeleccionado}
                onAnioChange={handleAnioChange}
                onDataChange={loadFeriados}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jornadas" className="mt-6">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">
                Configuración de Jornada Laboral
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Configure las horas de jornada esperada por empleado (4, 6 u 8
                horas). Esta configuración se usa para calcular el porcentaje de
                cumplimiento en los reportes de liquidación.
              </p>
              <JornadaConfigTable
                empleados={empleados}
                onDataChange={loadEmpleados}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="excepciones" className="mt-6">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">
                Excepciones de Asistencia
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Registre vacaciones, licencias médicas, licencias de estudio y
                otras excepciones. Los días cubiertos por una excepción no se
                contabilizan como ausencias. No se permiten fechas superpuestas
                para un mismo empleado.
              </p>
              <ExcepcionesTable
                excepciones={excepciones}
                empleados={initialListaEmpleados}
                onDataChange={loadExcepciones}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whitelist" className="mt-6">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">
                Whitelist de Empleados
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Empleados excluidos del control de asistencia (ej: Presidente,
                Secretarios, cargos políticos). Estos empleados no aparecerán en
                reportes de ausencias ni en la lista de atención.
              </p>
              <WhitelistTable
                whitelist={whitelist}
                empleados={initialListaEmpleados}
                onDataChange={loadWhitelist}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
