import { Suspense } from 'react';
import { StaticStatsCards } from '@dashboard/components/cards/static-stats-cards';
import { DashboardStatsCards } from '@dashboard/components/cards/dashboard-stats-cards';
import { StatsCardsGridSkeleton } from '@dashboard/components/skeletons';

export function KeyMetricsGrid() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Métricas Clave</h2>
        <p className="text-sm text-muted-foreground">
          El pulso del sistema en tiempo real
        </p>
      </div>

      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <StaticStatsCards />
      </Suspense>

      <Suspense fallback={<StatsCardsGridSkeleton />}>
        <DashboardStatsCards />
      </Suspense>
    </div>
  );
}
