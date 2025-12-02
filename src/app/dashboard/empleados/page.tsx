import { getListaEmpleados } from "@dashboard/actions/actions";
import { EmployeesTable } from "@dashboard/components/employees-table";

// Lista de empleados cambia raramente - cachear por 1 hora
export const revalidate = 3600;

export default async function EmpleadosPage() {
  const empleados = await getListaEmpleados();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Lista de Empleados
        </h1>
      </div>

      <EmployeesTable data={empleados} />
    </div>
  );
}
