import { ProblematicaEscuela } from '@dashboard/lib/escuelas-types';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface ProblematicasCardProps {
  problematicas: ProblematicaEscuela | null;
}

export function ProblematicasCard({ problematicas }: ProblematicasCardProps) {
  if (!problematicas) return null;

  const hasProblems = problematicas.cantidad_problematicas > 0;
  const dimensiones = problematicas.dimensiones_problematicas
    ? problematicas.dimensiones_problematicas.split(', ')
    : [];

  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden h-full">
      <div className="border-b bg-muted/40 px-6 py-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold leading-none tracking-tight">
          Problemáticas Reportadas
        </h3>
      </div>

      <div className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-4 text-center">
        {hasProblems ? (
          <>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-red-600 dark:text-red-400">
                {problematicas.cantidad_problematicas} Problemáticas
              </h4>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                Se han reportado situaciones en las siguientes dimensiones:
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {dimensiones.map((dim) => (
                <Badge key={dim} variant="destructive" className="px-3 py-1">
                  {dim}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-green-600 dark:text-green-400">
                Sin Problemáticas
              </h4>
              <p className="text-sm text-muted-foreground">
                No se han reportado situaciones conflictivas activas.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
