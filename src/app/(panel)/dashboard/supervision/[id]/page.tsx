import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  IconUser,
  IconPhone,
  IconMail,
  IconArrowLeft,
} from '@tabler/icons-react';
import {
  getSupervisorEstadisticas,
  getEscuelasDeSupervisor,
  getDistribucionZonaSupervisor,
  getDistribucionModalidadSupervisor,
} from '@dashboard/actions/supervisores/supervisores-actions';

async function SupervisorProfile({ id }: { id: number }) {
  const [supervisor, escuelas, distribucionZona, distribucionModalidad] =
    await Promise.all([
      getSupervisorEstadisticas(id),
      getEscuelasDeSupervisor(id),
      getDistribucionZonaSupervisor(id),
      getDistribucionModalidadSupervisor(id),
    ]);

  if (!supervisor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border">
            <IconUser className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {supervisor.nombre_completo}
            </h2>
            <p className="text-muted-foreground">Supervisor de Escuelas</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {supervisor.mail && (
                <div className="flex items-center gap-1">
                  <IconMail className="h-4 w-4" />
                  <span>{supervisor.mail}</span>
                </div>
              )}
              {supervisor.telefono && (
                <div className="flex items-center gap-1">
                  <IconPhone className="h-4 w-4" />
                  <span>{supervisor.telefono}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold">
              {supervisor.total_escuelas}
            </div>
            <p className="text-xs text-muted-foreground">Escuelas Asignadas</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zona Urbana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisor.escuelas_urbana_centrica +
                supervisor.escuelas_urbana_periferica}
            </div>
            <p className="text-xs text-muted-foreground">
              {supervisor.escuelas_urbana_centrica} Céntrica,{' '}
              {supervisor.escuelas_urbana_periferica} Periférica
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zona Rural
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisor.escuelas_rurales}
            </div>
            <p className="text-xs text-muted-foreground">
              Total escuelas rurales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modalidades Especiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisor.escuelas_especiales + supervisor.escuelas_adultos}
            </div>
            <p className="text-xs text-muted-foreground">Especial y Adultos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisor.departamentos_asignados}
            </div>
            <p className="text-xs text-muted-foreground">Áreas territoriales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Distribution Charts (Simplified as lists) */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Zona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribucionZona.map((item) => (
                <div key={item.zona} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.zona}</span>
                    <span className="text-muted-foreground">
                      {item.cantidad} ({item.porcentaje}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Modalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribucionModalidad.map((item) => (
                <div key={item.modalidad} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.modalidad}</span>
                    <span className="text-muted-foreground">
                      {item.cantidad} ({item.porcentaje}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Escuelas Asignadas</CardTitle>
          <CardDescription>
            Listado detallado de establecimientos bajo supervisión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CUE</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escuelas.map((escuela) => (
                <TableRow key={escuela.id_escuela}>
                  <TableCell className="font-mono text-xs">
                    {escuela.cue}
                  </TableCell>
                  <TableCell className="font-medium">
                    {escuela.nombre}
                  </TableCell>
                  <TableCell>{escuela.localidad}</TableCell>
                  <TableCell>{escuela.departamento}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {escuela.modalidad || 'Sin definir'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/escuelas/${escuela.id_escuela}`}>
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupervisorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supervisorId = parseInt(id, 10);

  if (isNaN(supervisorId)) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/supervision/listado">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <SupervisorProfile id={supervisorId} />
      </Suspense>
    </div>
  );
}
