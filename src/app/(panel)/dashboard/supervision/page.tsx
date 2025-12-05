import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  IconUsers,
  IconSchool,
  IconMapPin,
  IconChartBar,
} from '@tabler/icons-react';
import {
  getSupervisoresConEscuelas,
  getSupervisoresPorDepartamento,
} from '@dashboard/actions/supervisores/supervisores-actions';
import { getEstadisticasSistema } from '@/features/dashboard/actions/escuelas';

async function SupervisionStats() {
  const [supervisores, stats, supervisoresPorDepartamento] = await Promise.all([
    getSupervisoresConEscuelas(),
    getEstadisticasSistema(),
    getSupervisoresPorDepartamento(),
  ]);

  return (
    <>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de supervisores
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_supervisores || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Activos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Escuelas con supervisor asignado en el sistema
            </CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.escuelas_con_supervisor || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              De {stats?.total_escuelas || 0} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Escuelas sin supervisor asignado en el sistema
            </CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.escuelas_sin_supervisor || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pct_con_supervisor
                ? `${(100 - stats.pct_con_supervisor).toFixed(1)}%`
                : '0%'}{' '}
              pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cobertura total
            </CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pct_con_supervisor?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              De escuelas con supervisor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supervisors List */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Supervisores por carga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {supervisores.slice(0, 10).map((supervisor, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-3 border-b last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {supervisor.supervisor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {supervisor.total_escuelas} escuela
                      {supervisor.total_escuelas !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-right">
                      {supervisor.total_escuelas}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Distribución por departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {supervisoresPorDepartamento.map((dept, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {dept.departamento}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {dept.supervisores} supervisor
                      {dept.supervisores !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconSchool className="h-3 w-3" />
                    <span>{dept.escuelas_supervisadas} escuelas</span>
                  </div>
                  {i < supervisoresPorDepartamento.length - 1 && (
                    <div className="border-t pt-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supervisión | Dashboard CGE',
};

export default function SupervisionPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisión</h1>
          <p className="text-muted-foreground">
            Gestión y análisis de supervisores escolares
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <SupervisionStats />
      </Suspense>
    </div>
  );
}
