import { InfraestructuraEscuela } from '@dashboard/lib/escuelas-types';
import { Building, CheckCircle2, XCircle, Briefcase } from 'lucide-react';

interface InfraestructuraGeneralCardProps {
  infraestructura: InfraestructuraEscuela | null;
}

export function InfraestructuraGeneralCard({
  infraestructura,
}: InfraestructuraGeneralCardProps) {
  if (!infraestructura) return null;

  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="border-b bg-muted/40 px-6 py-4 flex items-center gap-2">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold leading-none tracking-tight">
          Infraestructura General
        </h3>
      </div>
      <div className="p-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Edificio Propio
              </label>
              <p className="text-xs text-muted-foreground">
                Titularidad del inmueble
              </p>
            </div>
            {infraestructura.edificio_propio ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Empresa de Limpieza
              </label>
              <p className="text-xs text-muted-foreground">
                Servicio tercerizado
              </p>
            </div>
            {infraestructura.tiene_empresa_limpieza ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Comparte Edificio</span>
            </div>
            <p className="text-lg font-semibold">
              {infraestructura.comparte_edificio}
            </p>
          </div>
          {infraestructura.tiene_empresa_limpieza && (
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Empresa Asignada</span>
              </div>
              <p
                className="text-lg font-semibold truncate"
                title={infraestructura.empresa_limpieza || ''}
              >
                {infraestructura.empresa_limpieza}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
