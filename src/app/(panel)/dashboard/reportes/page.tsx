import { connection } from 'next/server';
import {
  getMesesDisponibles,
  getReporteLiquidacion,
  getDiasConMarcaMes,
} from '@dashboard/actions/actions';
import { LiquidationReportTable } from '@dashboard/components/liquidation-report-table';
import { MonthSelector } from '@dashboard/components/month-selector';
import { IconReportAnalytics } from '@tabler/icons-react';
import { translateMonthName } from '@dashboard/lib/utils';


export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  // Signal dynamic rendering
  await connection();

  const params = await searchParams;
  const meses = await getMesesDisponibles();

  // Usar el mes del query param o el más reciente disponible
  const mesSeleccionado = params?.mes || (meses.length > 0 ? meses[0].mes : '');

  const reporte = mesSeleccionado
    ? await getReporteLiquidacion(mesSeleccionado)
    : [];

  const diasConMarca = mesSeleccionado
    ? await getDiasConMarcaMes(mesSeleccionado)
    : 0;

  const mesInfo = meses.find((m) => m.mes === mesSeleccionado);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <IconReportAnalytics className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">
              Reportes para liquidaciones de sueldos
            </h1>
            <p className="text-sm text-muted-foreground">
              {mesInfo
                ? `Período: ${translateMonthName(mesInfo.mes_nombre)}`
                : 'Seleccione un período'}
            </p>
          </div>
        </div>
        <MonthSelector meses={meses} currentMes={mesSeleccionado} />
      </div>

      {/* Tabla de reporte */}
      {mesSeleccionado ? (
        <LiquidationReportTable
          data={reporte}
          mesSeleccionado={mesSeleccionado}
          diasConMarca={diasConMarca}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
          <p className="text-muted-foreground">
            No hay datos disponibles. Seleccione un mes para ver el reporte.
          </p>
        </div>
      )}
    </div>
  );
}
