import { Suspense } from 'react';
import { EscuelasStats } from '@dashboard/components/escuelas/cards/escuelas-stats';
import { EscuelasDistributionChart } from '@dashboard/components/escuelas/charts/escuelas-distribution-chart';
import {
  StatsCardsGridSkeleton,
  ChartSkeleton,
} from '@dashboard/components/skeletons';

export default async function EscuelasPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Escuelas - General
        </h1>
      </div>

      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <EscuelasStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<ChartSkeleton height={400} />}>
            <EscuelasDistributionChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
