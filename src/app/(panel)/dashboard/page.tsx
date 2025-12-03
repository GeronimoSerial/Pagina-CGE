import { connection } from 'next/server';
import { DaysList } from '@dashboard/components/days-list';
import { AttendanceChart } from '@dashboard/components/attendance-chart';
import { HoursChart } from '@dashboard/components/hours-chart';
import { DashboardStatsCards } from '@dashboard/components/dashboard-stats-cards';
import {
  getDiasSinActividad,
  getDiasConMarca,
  getEmpleadosActivos,
  getEstadisticasDiarias,
  getPromedioHorasDiario,
  getEmpleadosProblematicos,
} from '@dashboard/actions/actions';
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthArg,
} from '@dashboard/lib/utils';

// MIGRATED: Using connection() to signal dynamic rendering before Date access

export default async function Page() {
  // Signal dynamic rendering before accessing current time
  await connection();

  const today = getArgentinaDate();
  const firstOfMonth = getFirstOfMonthArg();
  const startDate = formatDateArg(firstOfMonth);
  const endDate = formatDateArg(today);

  // Para el gráfico, obtener los últimos 30 días
  const thirtyDaysAgo = getArgentinaDate();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const chartStartDate = formatDateArg(thirtyDaysAgo);

  const [
    diasSinActividad,
    diasConMarca,
    empleadosActivos,
    estadisticasDiarias,
    promedioHoras,
    problematicos,
  ] = await Promise.all([
    getDiasSinActividad(startDate, endDate),
    getDiasConMarca(startDate, endDate),
    getEmpleadosActivos(),
    getEstadisticasDiarias(chartStartDate, endDate),
    getPromedioHorasDiario(chartStartDate, endDate),
    getEmpleadosProblematicos(),
  ]);

  const totalActivos = empleadosActivos.length;
  const diasSinActividadList = diasSinActividad.map((item) => item.dia);
  const diasConMarcaList = diasConMarca.map((item) => item.dia);
  const problematicosMesActual = problematicos.length;
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Bienvenido</h1>
        <p className="text-sm text-muted-foreground">
          {today.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardStatsCards
        totalActivos={totalActivos}
        problematicosMesActual={problematicosMesActual}
      />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceChart data={estadisticasDiarias} />
        <HoursChart data={promedioHoras} />
      </div>

      {/* Days Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DaysList title="Días con marca (este mes)" days={diasConMarcaList} />
        <DaysList
          title="Días sin actividad (este mes)"
          days={diasSinActividadList}
        />
      </div>
    </div>
  );
}
