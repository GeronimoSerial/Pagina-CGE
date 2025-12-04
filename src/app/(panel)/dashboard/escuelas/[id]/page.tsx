import { notFound } from 'next/navigation';
import { getEscuelaById } from '@dashboard/actions/escuelas';
import { getRelevamientoCocina } from '@dashboard/actions/escuelas';
import { RelevamientoCocinaSection } from '@dashboard/components/escuelas/relevamiento-cocina-section';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  UserSquare2,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  School,
  Hash,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EscuelaDetallePage(props: PageProps) {
  const params = await props.params;
  const id = Number(params.id);

  if (isNaN(id)) notFound();

  const escuela = await getEscuelaById(id);

  if (!escuela) notFound();

  const relevamientosCocina = await getRelevamientoCocina(id);

  const dataChecks = [
    { label: 'Modalidad', valid: escuela.tiene_modalidad },
    { label: 'Categoría', valid: escuela.tiene_categoria },
    { label: 'Zona', valid: escuela.tiene_zona },
    { label: 'Geolocalización', valid: escuela.tiene_localidad },
  ];

  const dataQualityScore =
    dataChecks.filter((c) => c.valid).length / dataChecks.length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                <Hash className="h-3 w-3" /> CUE: {escuela.cue}
              </span>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className="text-xs font-medium uppercase tracking-wide">
                Anexo {escuela.anexo || '00'}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {escuela.nombre}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>
                  {escuela.localidad || 'Localidad no definida'},{' '}
                  {escuela.departamento}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={
                    escuela.tiene_supervisor ? 'secondary' : 'destructive'
                  }
                  className="rounded-sm px-2 font-normal"
                >
                  {escuela.tiene_supervisor ? 'Supervisada' : 'Sin Supervisor'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas (Quick Actions) */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2 h-9" asChild>
              <a
                href={`tel:${escuela.telefono}`}
                className={
                  !escuela.telefono ? 'pointer-events-none opacity-50' : ''
                }
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Llamar</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-9" asChild>
              <a
                href={`mailto:${escuela.mail}`}
                className={
                  !escuela.mail ? 'pointer-events-none opacity-50' : ''
                }
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8">
        <Tabs defaultValue="general" className="w-full space-y-6">
          <div className="flex items-center justify-between border-b pb-px">
            <TabsList className="h-auto w-full justify-start gap-6 bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Ficha Técnica
              </TabsTrigger>
              {relevamientosCocina.length > 0 && (
                <TabsTrigger
                  value="relevamiento"
                  className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Infraestructura: Cocina
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent
            value="general"
            className="space-y-6 animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="grid gap-6 lg:grid-cols-3">
              {/* COLUMNA IZQUIERDA: Datos Duros */}
              <div className="space-y-6 lg:col-span-2">
                {/* 2. DATOS INSTITUCIONALES: Formato Grid Técnico */}
                <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="border-b bg-muted/40 px-6 py-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold leading-none tracking-tight">
                      Información Institucional
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="p-0">
                      <dl className="divide-y">
                        <DataRow label="Modalidad" value={escuela.modalidad} />
                        <DataRow label="Categoría" value={escuela.categoria} />
                        <DataRow label="Ámbito" value={escuela.ambito} />
                      </dl>
                    </div>
                    <div className="p-0">
                      <dl className="divide-y">
                        <DataRow label="Turno" value={escuela.turno} />
                        <DataRow label="Zona" value={escuela.zona} />
                        <DataRow
                          label="Servicio Comida"
                          value={escuela.servicio_comida}
                        />
                      </dl>
                    </div>
                  </div>
                  <div className="border-t bg-muted/10 px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      Fundación:{' '}
                      <span className="font-medium text-foreground">
                        {escuela.fecha_fundacion || 'Sin registro histórico'}
                      </span>
                    </div>
                  </div>
                </section>

                {/* 3. INTEGRIDAD DE DATOS: Panel de Sistema */}
                <section className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      Integridad del Legajo
                    </h3>
                    <span
                      className={`text-sm font-bold ${dataQualityScore === 1 ? 'text-green-600' : 'text-amber-600'}`}
                    >
                      {Math.round(dataQualityScore * 100)}% Completado
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {dataChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                          check.valid
                            ? 'bg-green-50/50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-900 dark:text-green-300'
                            : 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900 dark:text-red-300'
                        }`}
                      >
                        {check.valid ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <span className="font-medium">{check.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* COLUMNA DERECHA: Autoridades y Contacto */}
              <div className="space-y-6">
                <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="border-b bg-muted/40 px-6 py-4 flex items-center gap-2">
                    <UserSquare2 className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold leading-none tracking-tight">
                      Autoridades
                    </h3>
                  </div>
                  <div className="divide-y">
                    <div className="p-4">
                      <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
                        Director/a
                      </p>
                      <p className="font-medium text-lg leading-tight">
                        {escuela.director || (
                          <span className="text-muted-foreground italic">
                            Vacante
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
                        Supervisor/a
                      </p>
                      <p className="font-medium text-lg leading-tight">
                        {escuela.supervisor || (
                          <span className="text-muted-foreground italic">
                            No asignado
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <School className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Estado Administrativo
                      </h4>
                      <p className="text-xs text-blue-800/80 dark:text-blue-200/70">
                        Esta institución se encuentra activa y reportando en el
                        ciclo lectivo actual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="relevamiento"
            className="animate-in slide-in-from-bottom-2 duration-300"
          >
            <RelevamientoCocinaSection relevamientos={relevamientosCocina} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Micro-componente para filas de datos: Limpieza visual y semántica
function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-3 hover:bg-muted/50 transition-colors">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-foreground text-right truncate">
        {value || <span className="text-muted-foreground/40">-</span>}
      </dd>
    </div>
  );
}
