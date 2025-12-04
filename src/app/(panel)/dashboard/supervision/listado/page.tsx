import { Suspense } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  IconUser,
  IconSchool,
  IconChevronRight,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react';
import {
  getListaSupervisores,
  getEstadisticasSistema,
} from '@dashboard/actions/escuelas';

async function SupervisorsTable() {
  const [supervisores, stats] = await Promise.all([
    getListaSupervisores(),
    getEstadisticasSistema(),
  ]);

  const totalEscuelas = supervisores.reduce(
    (acc, s) => acc + s.total_escuelas,
    0,
  );
  const promedio =
    supervisores.length > 0 ? totalEscuelas / supervisores.length : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Supervisores
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisores.length}</div>
            <p className="text-xs text-muted-foreground">
              Activos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio de Escuelas
            </CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedio.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Escuelas por supervisor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cobertura Total
            </CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pct_con_supervisor?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              De {stats?.total_escuelas || 0} escuelas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supervisors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Supervisores</CardTitle>
          <CardDescription>
            Gestión y monitoreo de carga de trabajo por supervisor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableHead className="text-right">Escuelas Asignadas</TableHead>
                <TableHead className="text-center">Estado de Carga</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisores.map((supervisor) => {
                const isOverloaded = supervisor.total_escuelas > promedio * 1.2;
                const isUnderloaded =
                  supervisor.total_escuelas < promedio * 0.8;

                return (
                  <TableRow key={supervisor.id_persona}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <IconUser className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span>{supervisor.nombre_completo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {supervisor.total_escuelas}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          isOverloaded
                            ? 'destructive'
                            : isUnderloaded
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {isOverloaded
                          ? 'Alta'
                          : isUnderloaded
                            ? 'Baja'
                            : 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/supervision/${supervisor.id_persona}`}
                        >
                          Ver Detalle
                          <IconChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SupervisoresListadoPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisores</h1>
          <p className="text-muted-foreground">
            Directorio y métricas de supervisión escolar.
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <SupervisorsTable />
      </Suspense>
    </div>
  );
}
