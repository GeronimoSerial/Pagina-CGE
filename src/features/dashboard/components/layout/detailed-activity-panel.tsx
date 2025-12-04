import { Suspense } from 'react';
import { DaysWithActivity } from '@dashboard/components/cards/days-with-activity';
import { DaysWithoutActivity } from '@dashboard/components/cards/days-without-activity';
import { CompactTableSkeleton } from '@dashboard/components/skeletons';

interface DetailedActivityPanelProps {
  chartStartDate: string;
  chartEndDate: string;
}

export function DetailedActivityPanel({
  chartStartDate,
  chartEndDate,
}: DetailedActivityPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Detalles de Actividad</h2>
        <p className="text-sm text-muted-foreground">
          Información detallada sobre días de actividad y ausencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<CompactTableSkeleton columns={3} rows={4} />}>
          <DaysWithActivity
            startDate={chartStartDate}
            endDate={chartEndDate}
          />
        </Suspense>

        <Suspense fallback={<CompactTableSkeleton columns={3} rows={4} />}>
          <DaysWithoutActivity
            startDate={chartStartDate}
            endDate={chartEndDate}
          />
        </Suspense>
      </div>
    </div>
  );
}
