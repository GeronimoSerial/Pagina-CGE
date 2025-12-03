import { connection } from 'next/server';
import { EmpleadosProblematicosTable } from '@dashboard/components/empleados-problematicos-table';
import { getEmpleadosProblematicos } from '@dashboard/actions/actions';
import { OnlyRole } from '@/features/dashboard/providers/only-role';

export default async function AtencionPage() {
  await connection();

  const empleados = await getEmpleadosProblematicos();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Empleados que requieren atención
        </h1>
        <p className="text-muted-foreground">
          Empleados con métricas preocupantes en los últimos 30 días: más de 3
          ausencias, menos del 60% de cumplimiento de horas, o más de 2 días con
          marcaciones incompletas.
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <div className="rounded-lg border bg-card p-6">
          <OnlyRole roles={['owner', 'admin']}>
            <EmpleadosProblematicosTable empleados={empleados} />
          </OnlyRole>
        </div>
      </div>
    </div>
  );
}
