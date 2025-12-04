import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEscuelaById } from '@dashboard/actions/escuelas-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconSchool,
  IconUser,
  IconCalendar,
} from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EscuelaDetallePage(props: PageProps) {
  const params = await props.params;
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const escuela = await getEscuelaById(id);

  if (!escuela) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {escuela.nombre}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-sm">CUE: {escuela.cue}</span>
            <span>•</span>
            <span className="text-sm">Anexo: {escuela.anexo || '00'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={escuela.tiene_supervisor ? 'default' : 'destructive'}>
            {escuela.tiene_supervisor ? 'Supervisada' : 'Sin Supervisor'}
          </Badge>
          <Badge variant="outline">{escuela.ambito || 'Sin ámbito'}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Información Institucional */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSchool className="h-5 w-5" />
              Institucional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Modalidad
                </p>
                <p>{escuela.modalidad || 'No definida'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categoría
                </p>
                <p>{escuela.categoria || 'No definida'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Turno
                </p>
                <p>{escuela.turno || 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Zona
                </p>
                <p>{escuela.zona || 'No definida'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Servicio de Comida
                </p>
                <p>{escuela.servicio_comida || 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fundación
                </p>
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3 text-muted-foreground" />
                  <span>{escuela.fecha_fundacion || 'Sin dato'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Ubicación y contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Localidad
              </p>
              <p>{escuela.localidad || 'No definida'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Departamento
              </p>
              <p>{escuela.departamento || 'No definido'}</p>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <a
                  className="text-blue-500 hover:underline"
                  href={`tel:${escuela.telefono}`}
                >
                  {escuela.telefono || 'Sin teléfono'}
                </a>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <a
                  className="text-blue-500 hover:underline"
                  href={`mailto:${escuela.mail}`}
                >
                  {escuela.mail || 'Sin email'}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Autoridades */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Autoridades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Supervisor
              </p>
              <p className="text-lg font-medium">
                {escuela.supervisor || 'Vacante'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Director
              </p>
              <p className="text-lg font-medium">
                {escuela.director || 'Sin información'}
              </p>
            </div>
            {/* Aquí se podrían agregar más autoridades si estuvieran disponibles en la vista */}
          </CardContent>
        </Card>

        {/* Calidad de Datos */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={escuela.tiene_modalidad ? 'outline' : 'destructive'}
              >
                Modalidad: {escuela.tiene_modalidad ? 'OK' : 'Faltante'}
              </Badge>
              <Badge
                variant={escuela.tiene_categoria ? 'outline' : 'destructive'}
              >
                Categoría: {escuela.tiene_categoria ? 'OK' : 'Faltante'}
              </Badge>
              <Badge variant={escuela.tiene_zona ? 'outline' : 'destructive'}>
                Zona: {escuela.tiene_zona ? 'OK' : 'Faltante'}
              </Badge>
              <Badge
                variant={escuela.tiene_localidad ? 'outline' : 'destructive'}
              >
                Localidad: {escuela.tiene_localidad ? 'OK' : 'Faltante'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
