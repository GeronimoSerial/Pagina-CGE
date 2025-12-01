"use client";

import { useState, useEffect, useCallback } from "react";
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
  getListaEmpleados,
} from "@dashboard/actions/actions";
import {
  Feriado,
  EmpleadoConJornada,
  ExcepcionAsistencia,
  WhitelistEmpleado,
} from "@dashboard/lib/types";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  IconCalendarEvent,
  IconClock,
  IconBeach,
  IconShieldCheck,
} from "@tabler/icons-react";
import { getArgentinaYear } from "@dashboard/lib/utils";

export default function ConfiguracionPage() {
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [aniosFeriados, setAniosFeriados] = useState<number[]>([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | undefined>(
    undefined
  );
  const [empleados, setEmpleados] = useState<EmpleadoConJornada[]>([]);
  const [excepciones, setExcepciones] = useState<ExcepcionAsistencia[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEmpleado[]>([]);
  const [listaEmpleados, setListaEmpleados] = useState<
    { legajo: string; nombre: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
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

  const loadListaEmpleados = useCallback(async () => {
    const data = await getListaEmpleados();
    setListaEmpleados(data);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Inicializar año con Argentina si aún no está
      if (anioSeleccionado === undefined) {
        setAnioSeleccionado(getArgentinaYear());
      }
      await Promise.all([
        loadFeriados(),
        loadEmpleados(),
        loadExcepciones(),
        loadWhitelist(),
        loadListaEmpleados(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [
    loadFeriados,
    loadEmpleados,
    loadExcepciones,
    loadWhitelist,
    loadListaEmpleados,
  ]);

  const handleAnioChange = async (anio: number | undefined) => {
    setAnioSeleccionado(anio);
  };

  useEffect(() => {
    loadFeriados();
  }, [anioSeleccionado, loadFeriados]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="px-4 lg:px-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administre feriados, jornadas laborales, excepciones de asistencia y
          empleados excluidos del control
        </p>
      </div>

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
                  ausencias. Agregue, edite o elimine feriados según
                  corresponda.
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
                  horas). Esta configuración se usa para calcular el porcentaje
                  de cumplimiento en los reportes de liquidación.
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
                  contabilizan como ausencias. No se permiten fechas
                  superpuestas para un mismo empleado.
                </p>
                <ExcepcionesTable
                  excepciones={excepciones}
                  empleados={listaEmpleados}
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
                  Secretarios, cargos políticos). Estos empleados no aparecerán
                  en reportes de ausencias ni en la lista de atención.
                </p>
                <WhitelistTable
                  whitelist={whitelist}
                  empleados={listaEmpleados}
                  onDataChange={loadWhitelist}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
