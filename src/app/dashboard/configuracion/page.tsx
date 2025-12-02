import { connection } from 'next/server';
import {
  getFeriados,
  getAniosFeriados,
  getEmpleadosConJornada,
  getExcepciones,
  getWhitelist,
  getListaEmpleados,
} from '@dashboard/actions/actions';
import { getArgentinaYear } from '@dashboard/lib/utils';
import { ConfiguracionClient } from './configuracion-client';

// MIGRATED: Removed export const revalidate = 3600 (incompatible with Cache Components)
// Using connection() to signal dynamic rendering before Date access

export default async function ConfiguracionPage() {
  // Signal dynamic rendering before accessing current time
  await connection();

  const anioActual = getArgentinaYear();

  const [
    feriados,
    aniosFeriados,
    empleados,
    excepciones,
    whitelist,
    listaEmpleados,
  ] = await Promise.all([
    getFeriados(anioActual),
    getAniosFeriados(),
    getEmpleadosConJornada(),
    getExcepciones(),
    getWhitelist(),
    getListaEmpleados(),
  ]);

  // Si no hay años, usar el actual
  const aniosDisponibles =
    aniosFeriados.length > 0 ? aniosFeriados : [anioActual];

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administre feriados, jornadas laborales, excepciones de asistencia y
          empleados excluidos del control
        </p>
      </div>

      <ConfiguracionClient
        initialFeriados={feriados}
        initialAniosFeriados={aniosDisponibles}
        initialEmpleados={empleados}
        initialExcepciones={excepciones}
        initialWhitelist={whitelist}
        initialListaEmpleados={listaEmpleados}
      />
    </div>
  );
}
