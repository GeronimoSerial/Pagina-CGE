import { LiquidationReportTableSkeleton } from '@dashboard/components/skeletons';
import { Skeleton } from '@/shared/ui/skeleton';
import { IconReportAnalytics } from '@tabler/icons-react';

export default function Loading() {
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
            <Skeleton className="h-4 w-[160px] mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* Tabla de reporte */}
      <LiquidationReportTableSkeleton />
    </div>
  );
}
