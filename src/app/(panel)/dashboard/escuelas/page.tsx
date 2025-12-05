import { Suspense } from 'react';
import { EscuelasStats } from '@dashboard/components/escuelas/cards/escuelas-stats';
import { RelevamientoGeneralStats } from '@dashboard/components/escuelas/cards/relevamiento-general-stats';
import { EscuelasDistributionChart } from '@dashboard/components/escuelas/charts/escuelas-distribution-chart';
import {
  StatsCardsGridSkeleton,
  ChartSkeleton,
} from '@dashboard/components/skeletons';
import { DistribucionProblematicasChart } from '@/features/dashboard/components/charts/distribucion-problematicas-chart';

export default async function EscuelasPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Escuelas - Información general
        </h1>
      </div>

      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <EscuelasStats />
      </Suspense>

      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <RelevamientoGeneralStats />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton height={400} />}>
          <DistribucionProblematicasChart />
        </Suspense>
      </div>
    </div>
  );
}
