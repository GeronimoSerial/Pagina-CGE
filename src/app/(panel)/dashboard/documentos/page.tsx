import { Suspense } from 'react';
import { DocumentosTable } from '@/features/dashboard/components/documentos/documentos-table';
import { documents } from '@/features/documentation/data';

export default function DocumentosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">
          Accedé a todos los documentos, formularios y normativas
          institucionales.
        </p>

        <Suspense
          fallback={
            <div className="h-[400px] rounded-md border bg-muted animate-pulse" />
          }
        >
          <DocumentosTable initialDocuments={documents} />
        </Suspense>
      </div>
    </div>
  );
}
