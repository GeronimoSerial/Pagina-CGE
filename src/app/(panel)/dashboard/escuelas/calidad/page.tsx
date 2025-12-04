import { Suspense } from 'react';
import {
  getMetricasCalidad,
  getEscuelasConDatosFaltantes,
} from '@dashboard/actions/escuelas';
import { CalidadStatsCards } from '@dashboard/components/escuelas/calidad/calidad-stats-cards';
import { EscuelasDatosFaltantesList } from '@dashboard/components/escuelas/calidad/escuelas-datos-faltantes-list';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function EscuelasCalidadPage() {
  const [metricas, faltantes] = await Promise.all([
    getMetricasCalidad(),
    getEscuelasConDatosFaltantes(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Calidad de Datos
        </h1>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
          <CalidadStatsCards data={metricas} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <EscuelasDatosFaltantesList data={faltantes} />
        </Suspense>
      </div>
    </div>
  );
}
