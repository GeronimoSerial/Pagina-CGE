import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  buscarEscuelas,
  contarEscuelas,
} from '@dashboard/actions/escuelas';
import { IconEye } from '@tabler/icons-react';
import { EscuelasPagination } from './escuelas-pagination';

interface EscuelasListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function EscuelasList({ searchParams }: EscuelasListProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const termino = (searchParams.q as string) || undefined;
  const modalidad = searchParams.modalidad
    ? Number(searchParams.modalidad)
    : undefined;
  const zona = searchParams.zona ? Number(searchParams.zona) : undefined;
  const categoria = searchParams.categoria
    ? Number(searchParams.categoria)
    : undefined;
  const departamento = searchParams.departamento
    ? Number(searchParams.departamento)
    : undefined;
  const supervisor = searchParams.supervisor
    ? Number(searchParams.supervisor)
    : undefined;

  const [escuelas, totalEscuelas] = await Promise.all([
    buscarEscuelas({
      termino,
      modalidad,
      zona,
      categoria,
      departamento,
      supervisor,
      limit,
      offset,
    }),
    contarEscuelas({
      termino,
      modalidad,
      zona,
      categoria,
      departamento,
      supervisor,
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">CUE</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead>Modalidad</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escuelas.length > 0 ? (
              escuelas.map((escuela) => (
                <TableRow key={escuela.id_escuela}>
                  <TableCell className="font-medium">{escuela.cue}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/escuelas/${escuela.id_escuela}`}
                      className="hover:underline"
                    >
                      {escuela.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{escuela.zona || '-'}</TableCell>
                  <TableCell>
                    {escuela.modalidad ? (
                      <Badge variant="outline">{escuela.modalidad}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {escuela.tiene_supervisor ? (
                      <span className="text-green-600 dark:text-green-400">
                        {escuela.supervisor}
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        Sin asignar
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/escuelas/${escuela.id_escuela}`}>
                        <IconEye className="h-4 w-4" />
                        <span className="sr-only">Ver detalle</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron escuelas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EscuelasPagination
        currentPage={page}
        totalItems={totalEscuelas}
        pageSize={limit}
      />
    </div>
  );
}
