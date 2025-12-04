import { Suspense } from 'react';
import { EscuelasFilters } from '@dashboard/components/escuelas/filters/escuelas-filters';
import { EscuelasList } from '@dashboard/components/escuelas/tables/escuelas-list';
import { CompactTableSkeleton } from '@dashboard/components/skeletons';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EscuelasBuscadorPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Buscador de escuelas
        </h1>
      </div>

      <div className="space-y-4">
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <EscuelasFilters />
        </Suspense>

        <Suspense fallback={<CompactTableSkeleton columns={6} rows={10} />}>
          <EscuelasList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
