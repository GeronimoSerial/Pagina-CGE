import { Suspense } from 'react';
import {
  getEscuelasPorDepartamento,
  getTopLocalidades,
} from '@dashboard/actions/escuelas';
import { EscuelasPorDepartamentoChart } from '@dashboard/components/escuelas/geografia/escuelas-por-departamento-chart';
import { EscuelasPorLocalidadTable } from '@dashboard/components/escuelas/geografia/escuelas-por-localidad-table';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function EscuelasGeografiaPage() {
  const [porDepartamento, topLocalidades] = await Promise.all([
    getEscuelasPorDepartamento(),
    getTopLocalidades(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Distribución Geográfica
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Suspense fallback={<Skeleton className="col-span-4 h-[400px]" />}>
          <EscuelasPorDepartamentoChart data={porDepartamento} />
        </Suspense>

        <Suspense fallback={<Skeleton className="col-span-3 h-[400px]" />}>
          <EscuelasPorLocalidadTable data={topLocalidades} />
        </Suspense>
      </div>
    </div>
  );
}
