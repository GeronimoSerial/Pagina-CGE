import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { IconAlertTriangle, IconExternalLink } from '@tabler/icons-react';
import { getEscuelasConDatosFaltantes } from '@dashboard/actions/escuelas';
import { TableSkeleton } from '@dashboard/components/skeletons';
import Link from 'next/link';

async function EscuelasSinInformacionTable() {
  // Obtener todas las escuelas con datos faltantes (79 pendientes)
  const escuelas = await getEscuelasConDatosFaltantes(100);

  const getBadgeVariant = (faltante: string) => {
    switch (faltante) {
      case 'Modalidad':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
      case 'Zona':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'Categoría':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700';
      case 'Supervisor':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
            <IconAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Escuelas con Datos Faltantes
              <Badge variant="destructive" className="ml-2">
                {escuelas.length} pendientes
              </Badge>
            </CardTitle>
            <CardDescription>
              Listado de instituciones que requieren completar información
              crítica
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px] font-semibold">CUE</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Datos Faltantes</TableHead>
                <TableHead className="w-[80px] text-center font-semibold">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escuelas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <IconAlertTriangle className="h-8 w-8 text-green-500" />
                      <p>¡Excelente! No hay escuelas con datos faltantes.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                escuelas.map((escuela) => (
                  <TableRow
                    key={escuela.id_escuela}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {escuela.cue}
                    </TableCell>
                    <TableCell className="font-medium">
                      {escuela.nombre}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {escuela.faltantes.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className={`text-xs ${getBadgeVariant(item)}`}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/dashboard/escuelas/${escuela.id_escuela}`}
                        className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                        title="Ver detalles"
                      >
                        <IconExternalLink className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {escuelas.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
            <span className="font-medium">Leyenda:</span>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
              >
                Modalidad
              </Badge>
              <span>Sin modalidad asignada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
              >
                Zona
              </Badge>
              <span>Sin zona definida</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700"
              >
                Categoría
              </Badge>
              <span>Sin categoría</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
              >
                Supervisor
              </Badge>
              <span>Sin supervisor asignado</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function SinInformacionPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Escuelas - Sin Información
          </h1>
          <p className="text-muted-foreground mt-1">
            Instituciones que requieren completar datos faltantes
          </p>
        </div>
      </div>

      <Suspense fallback={<TableSkeleton columns={4} rows={10} />}>
        <EscuelasSinInformacionTable />
      </Suspense>
    </div>
  );
}
