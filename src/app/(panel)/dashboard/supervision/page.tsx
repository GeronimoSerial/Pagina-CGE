import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge'; // Asumiendo existencia
import {
  Users,
  School,
  Map,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  getSupervisoresConEscuelas,
  getSupervisoresPorDepartamento,
} from '@dashboard/actions/supervisores/supervisores-actions';
import { getEstadisticasSistema } from '@/features/dashboard/actions/escuelas';

// --- COMPONENTS ---

async function SupervisionStats() {
  const [supervisores, stats, supervisoresPorDepartamento] = await Promise.all([
    getSupervisoresConEscuelas(),
    getEstadisticasSistema(),
    getSupervisoresPorDepartamento(),
  ]);

  // Cálculos auxiliares para UI
  const maxLoad = Math.max(...supervisores.map((s) => s.total_escuelas));
  const deficitPct = stats?.pct_con_supervisor
    ? (100 - stats.pct_con_supervisor).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* 1. KPIs ESTRATÉGICOS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Fuerza Laboral */}
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Fuerza Operativa
              </span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-tight">
                {stats?.total_supervisores || 0}
              </span>
              <span className="text-xs text-muted-foreground">
                agentes activos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI: Cobertura Efectiva */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Índice de Cobertura
              </span>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-tight">
                {stats?.pct_con_supervisor?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-green-600 transition-all"
                style={{ width: `${stats?.pct_con_supervisor || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* KPI: Universo Escolar */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Alcance Territorial
              </span>
              <School className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-tight">
                {stats?.escuelas_con_supervisor || 0}
              </span>
              <span className="text-xs text-muted-foreground">
                / {stats?.total_escuelas} escuelas
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI: Alerta de Déficit */}
        <Card className="bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Déficit de Gestión
              </span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-tight text-red-700 dark:text-red-400">
                {stats?.escuelas_sin_supervisor || 0}
              </span>
              <span className="text-xs font-medium text-red-600/80 dark:text-red-400/80">
                instituciones
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-red-600/70">
              Representa el {deficitPct}% del padrón
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. PANELES DE DETALLE */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Panel Izquierdo: Carga de Supervisores (Leaderboard) - Ocupa 4 columnas */}
        <Card className="lg:col-span-4 shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  Carga Operativa
                </CardTitle>
                <CardDescription>
                  Distribución de escuelas por supervisor
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                TOP 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-2">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-background sticky top-0 z-10">
                  <tr className="border-b">
                    <th className="text-left font-medium p-3">Agente</th>
                    <th className="text-right font-medium p-3 w-[120px]">
                      Carga
                    </th>
                    <th className="text-right font-medium p-3 w-[80px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {supervisores.slice(0, 10).map((supervisor, i) => {
                    const loadPercentage =
                      (supervisor.total_escuelas / maxLoad) * 100;
                    // Generar iniciales
                    const initials = supervisor.supervisor
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={i}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {initials}
                            </div>
                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {supervisor.supervisor}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 align-middle">
                          <div className="flex items-center justify-end gap-2 h-full">
                            <div className="h-1.5 w-full max-w-[80px] rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${loadPercentage > 90 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                style={{ width: `${loadPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-medium">
                          {supervisor.total_escuelas}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Panel Derecho: Despliegue Territorial - Ocupa 3 columnas */}
        <Card className="lg:col-span-3 shadow-sm flex flex-col">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Map className="h-5 w-5 text-muted-foreground" />
                Despliegue Territorial
              </CardTitle>
              <CardDescription>Supervisión por departamento</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              {supervisoresPorDepartamento.map((dept, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {dept.departamento}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {dept.supervisores} supervisores asignados
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className="font-mono font-normal"
                    >
                      {dept.escuelas_supervisadas} esc.
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tablero de Control: Supervisión | CGE',
};

export default function SupervisionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-8 p-8 pt-6">
        {/* HEADER EJECUTIVO */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Supervisión Escolar
            </h2>
            <p className="text-muted-foreground">
              Monitoreo de agentes, cobertura territorial y distribución de
              carga operativa.
            </p>
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <SupervisionStats />
        </Suspense>
      </div>
    </div>
  );
}

// --- SKELETON MEJORADO ---
// Un esqueleto que realmente imita la estructura compleja del dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 h-[500px]">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 h-[500px]">
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
                <Skeleton className="h-5 w-[60px]" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
