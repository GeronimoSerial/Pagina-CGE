import { Suspense } from 'react';
import { connection } from 'next/server';
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthString,
  getArgentinaDateString,
} from '@dashboard/lib/utils';
import { DashboardHeader } from '@dashboard/components/layout/dashboard-header';
import { KeyMetricsGrid } from '@dashboard/components/layout/key-metrics-grid';
import { TrendAnalysisSection } from '@dashboard/components/layout/trend-analysis-section';
import { DetailedActivityPanel } from '@dashboard/components/layout/detailed-activity-panel';
import { AlertsPanel } from '@dashboard/components/layout/alerts-panel';
import { CompactTableSkeleton } from '@dashboard/components/skeletons';
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
      <DashboardHeader userName={nombre} dateString={todayStr} />

      <hr className="my-2" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <KeyMetricsGrid />
        </div>
        <div>
          <Suspense fallback={<CompactTableSkeleton columns={2} rows={3} />}>
            <AlertsPanel />
          </Suspense>
        </div>
      </div>

      <hr className="my-2" />

      <TrendAnalysisSection
        chartStartDate={chartStartDate}
        chartEndDate={firstOfMonthStr}
      />

      <hr className="my-2" />

      <DetailedActivityPanel
        chartStartDate={chartStartDate}
        chartEndDate={firstOfMonthStr}
      />
    </div>
  );
}
