import { EmpleadosProblematicosTable } from "@dashboard/components/empleados-problematicos-table";
import { getEmpleadosProblematicos } from "@dashboard/actions/actions";

// Empleados problemáticos cambian moderadamente - cachear por 5 minutos
export const revalidate = 300;

export default async function AtencionPage() {
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
          <EmpleadosProblematicosTable empleados={empleados} />
        </div>
      </div>
    </div>
  );
}
