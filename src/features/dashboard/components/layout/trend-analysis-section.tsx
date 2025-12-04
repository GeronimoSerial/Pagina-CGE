import { Suspense } from 'react';
import { AttendanceChart } from '@dashboard/components/charts/attendance-chart';
import { HoursChart } from '@dashboard/components/charts/hours-chart';
import { ChartSkeleton } from '@dashboard/components/skeletons';

interface TrendAnalysisSectionProps {
  chartStartDate: string;
  chartEndDate: string;
}

export function TrendAnalysisSection({
  chartStartDate,
  chartEndDate,
}: TrendAnalysisSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Análisis de Tendencias</h2>
        <p className="text-sm text-muted-foreground">
          Visualización de datos históricos y patrones
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton height={300} />}>
          <AttendanceChart
            startDate={chartStartDate}
            endDate={chartEndDate}
          />
        </Suspense>

        <Suspense fallback={<ChartSkeleton height={300} />}>
          <HoursChart startDate={chartStartDate} endDate={chartEndDate} />
        </Suspense>
      </div>
    </div>
  );
}
