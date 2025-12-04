import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import {
  getEmpleadoDetalle,
  getDetalleDiarioEmpleado,
  getMesesDisponibles,
} from '@dashboard/actions/actions';
import { EmployeeDailyReportTable } from '@dashboard/components/tables/employee-daily-report-table';
import { Button } from '@/shared/ui/button';
import { IconArrowLeft, IconUser } from '@tabler/icons-react';
import { translateMonthName } from '@dashboard/lib/utils';

// MIGRATED: Using connection() to signal dynamic rendering for dynamic route

export default async function ReporteEmpleadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ legajo: string }>;
  searchParams: Promise<{ mes?: string }>;
}) {
  // Signal dynamic rendering for this dynamic route
  await connection();

  const { legajo } = await params;
  const search = await searchParams;
  const meses = await getMesesDisponibles();

  // Obtener el mes seleccionado o el más reciente
  const mesSeleccionado = search?.mes || (meses.length > 0 ? meses[0].mes : '');

  if (!mesSeleccionado) {
    notFound();
  }

  // Calcular el rango del mes
  const [year, month] = mesSeleccionado.split('-').map(Number);
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const [empleado, detalle] = await Promise.all([
    getEmpleadoDetalle(legajo),
    getDetalleDiarioEmpleado(legajo, startDate, endDate),
  ]);

  if (!empleado) {
    notFound();
  }

  const mesInfo = meses.find((m) => m.mes === mesSeleccionado);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/reportes?mes=${mesSeleccionado}`}>
          <Button variant="outline" size="icon">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <IconUser className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">
              Reporte Individual - {empleado.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">
              Legajo: {empleado.legajo}
              {empleado.area && ` • ${empleado.area}`}
              {empleado.turno && ` • ${empleado.turno}`}
              {mesInfo && ` • ${translateMonthName(mesInfo.mes_nombre)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Info del empleado */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">DNI</p>
          <p className="text-lg font-medium">{empleado.dni || '-'}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Área</p>
          <p className="text-lg font-medium">{empleado.area || '-'}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Turno</p>
          <p className="text-lg font-medium">{empleado.turno || '-'}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
          <p className="text-lg font-medium">
            {empleado.fechaingreso
              ? new Date(
                  empleado.fechaingreso + 'T12:00:00',
                ).toLocaleDateString('es-AR')
              : '-'}
          </p>
        </div>
      </div>

      {/* Tabla de detalle diario */}
      <EmployeeDailyReportTable
        data={detalle}
        empleadoNombre={empleado.nombre}
        mes={mesSeleccionado}
      />
    </div>
  );
}
