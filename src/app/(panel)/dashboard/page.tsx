import { Suspense } from 'react';
import { connection } from 'next/server';
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthString,
  getArgentinaDateString,
} from '@dashboard/lib/utils';
import { DashboardStatsCards } from '@dashboard/components/cards/dashboard-stats-cards';
import { StaticStatsCards } from '@dashboard/components/cards/static-stats-cards';
import { AttendanceChart } from '@dashboard/components/charts/attendance-chart';
import { HoursChart } from '@dashboard/components/charts/hours-chart';
import { DaysWithActivity } from '@dashboard/components/cards/days-with-activity';
import { DaysWithoutActivity } from '@dashboard/components/cards/days-without-activity';
import {
  StatsCardsGridSkeleton,
  ChartSkeleton,
  CompactTableSkeleton,
} from '@dashboard/components/skeletons';
import { getCachedSession } from '@/shared/lib/auth/session-utils';
export default async function Page() {
  // Signal dynamic rendering before accessing current time
  await connection();

  const session = await getCachedSession();
  const nombre = session?.user?.name;
  const todayStr = getArgentinaDateString();

  // Cálculo de fechas usando strings estables
  const firstOfMonthStr = getFirstOfMonthString(todayStr);

  // Para el gráfico, obtener los últimos 30 días
  const thirtyDaysAgo = getArgentinaDate();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const chartStartDate = formatDateArg(thirtyDaysAgo);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-pretty md:text-2xl">
          Hola, <strong> {nombre}</strong> 👋
        </h1>
        <p className="text-sm text-muted-foreground">{todayStr}</p>
      </div>

      <h2 className="text-lg font-semibold">Estadísticas generales</h2>
      <hr />
      {/* Static Stats */}
      <StaticStatsCards />
      <hr />

      <h2 className="text-lg font-semibold">Información del establecimiento</h2>
      {/* KPI Cards */}
      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <DashboardStatsCards />
      </Suspense>
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton height={300} />}>
          <AttendanceChart
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
        <Suspense fallback={<ChartSkeleton height={300} />}>
          <HoursChart startDate={chartStartDate} endDate={firstOfMonthStr} />
        </Suspense>
      </div>

      {/* Days Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<CompactTableSkeleton columns={3} rows={4} />}>
          <DaysWithActivity
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
        <Suspense fallback={<CompactTableSkeleton columns={3} rows={4} />}>
          <DaysWithoutActivity
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
      </div>
    </div>
  );
}
