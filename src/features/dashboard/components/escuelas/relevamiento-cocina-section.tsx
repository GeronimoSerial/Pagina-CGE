import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { RelevamientoCocina } from '@dashboard/lib/escuelas-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, ChefHat, ClipboardCheck, Info } from 'lucide-react';
import { normalizeFieldName } from '../../lib/utils/cocina';
import { fieldCategories } from '../../lib/utils/cocina';
interface RelevamientoCocinaSectionProps {
  relevamientos: RelevamientoCocina[];
}

function DataField({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">
        {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value || '-'}
      </p>
    </div>
  );
}

export function RelevamientoCocinaSection({
  relevamientos,
}: RelevamientoCocinaSectionProps) {
  if (!relevamientos || relevamientos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 p-12 text-center animate-in fade-in-50">
        <div className="mb-4 rounded-full bg-muted p-3">
          <ChefHat className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Sin relevamientos de cocina
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Aún no se han cargado datos de relevamiento para este sector.
        </p>
      </div>
    );
  }

  const ultimoRelevamiento = relevamientos[0];
  const datos = ultimoRelevamiento.datos;

  const fechaRelevamiento = new Date(ultimoRelevamiento.fecha);
  const diasAntiguedad = Math.floor(
    (new Date().getTime() - fechaRelevamiento.getTime()) / (1000 * 3600 * 24),
  );
  const esReciente = diasAntiguedad < 200;

  return (
    <section className="space-y-6 mt-10">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ChefHat className="h-4 w-4" />
            </span>
            <h2 className="text-xl  font-bold tracking-tight text-foreground">
              Infraestructura: Cocina
            </h2>
          </div>
          <p className="text-sm text-muted-foreground pl-10">
            Reporte técnico y estado de equipamiento.
          </p>
        </div>

        <div className="flex items-center gap-3 pl-10 sm:pl-0">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Última Auditoría
            </span>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {format(fechaRelevamiento, "d 'de' MMMM, yyyy", { locale: es })}
            </div>
          </div>
          <Badge
            variant={esReciente ? 'default' : 'secondary'}
            className={cn(
              'h-7 px-3',
              !esReciente &&
                'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
            )}
          >
            {esReciente ? 'Vigente' : 'Requiere Actualización'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(fieldCategories).map(([category, fields]) => {
          const categoryData = fields
            .filter((field) => datos[field] !== undefined)
            .map((field) => ({ field, value: datos[field] }));

          if (categoryData.length === 0) return null;

          return (
            <div
              key={category}
              className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="border-b bg-muted/30 px-4 py-3">
                <h3 className="font-semibold tracking-tight flex items-center gap-2 text-sm uppercase text-muted-foreground">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  {category}
                </h3>
              </div>

              <div className="p-0">
                <dl className="divide-y divide-border/50">
                  {categoryData.map(({ field, value }) => (
                    <div
                      key={field}
                      className="grid grid-cols-2 gap-4 px-4 py-3 text-sm hover:bg-muted/20 transition-colors"
                    >
                      <dt
                        className="font-medium text-muted-foreground truncate"
                        title={normalizeFieldName(field)}
                      >
                        {normalizeFieldName(field)}
                      </dt>
                      <dd className="font-semibold text-right text-foreground truncate">
                        {typeof value === 'boolean'
                          ? value
                            ? 'Sí'
                            : 'No'
                          : value || '-'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </div>

      {datos.observaciones && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/10">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="space-y-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Observaciones del relevamiento
              </h4>
              <p className="text-sm text-blue-800/90 dark:text-blue-200/80 whitespace-pre-wrap leading-relaxed">
                {datos.observaciones}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
