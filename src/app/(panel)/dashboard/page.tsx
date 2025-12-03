import { Suspense } from 'react';
import { connection } from 'next/server';
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthArg,
  getThirtyDaysAgoString,
  getFirstOfMonthString,
  getArgentinaDateString,
} from '@dashboard/lib/utils';
import { DashboardStatsCards } from '@dashboard/components/dashboard-stats-cards';
import { AttendanceChart } from '@dashboard/components/attendance-chart';
import { HoursChart } from '@dashboard/components/hours-chart';
import { DaysWithActivity } from '@dashboard/components/days-with-activity';
import { DaysWithoutActivity } from '@dashboard/components/days-without-activity';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { getCachedSession } from '@/shared/lib/auth/session-utils';
export default async function Page() {
  // Signal dynamic rendering before accessing current time
  await connection();

  const session = await getCachedSession();
  const nombre = session?.user?.name;
  const todayStr = getArgentinaDateString();

  // Cálculo de fechas usando strings estables
  const thirtyDaysAgoStr = getThirtyDaysAgoString(todayStr);
  const firstOfMonthStr = getFirstOfMonthString(todayStr);
  const firstOfMonth = getFirstOfMonthArg();

  // Para el gráfico, obtener los últimos 30 días
  const thirtyDaysAgo = getArgentinaDate();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const chartStartDate = formatDateArg(thirtyDaysAgo);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Bienvenido <strong> {nombre}</strong>
        </h1>
        <p className="text-sm text-muted-foreground">{todayStr}</p>
      </div>

      {/* KPI Cards */}
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStatsCards />
      </Suspense>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex h-[300px] items-center justify-center rounded-xl border bg-card text-card-foreground shadow">
              <LoadingSpinner />
            </div>
          }
        >
          <AttendanceChart
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex h-[300px] items-center justify-center rounded-xl border bg-card text-card-foreground shadow">
              <LoadingSpinner />
            </div>
          }
        >
          <HoursChart startDate={chartStartDate} endDate={firstOfMonthStr} />
        </Suspense>
      </div>

      {/* Days Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="h-24 rounded-md border p-4">
              <LoadingSpinner />
            </div>
          }
        >
          <DaysWithActivity
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-24 rounded-md border p-4">
              <LoadingSpinner />
            </div>
          }
        >
          <DaysWithoutActivity
            startDate={chartStartDate}
            endDate={firstOfMonthStr}
          />
        </Suspense>
      </div>
    </div>
  );
}
