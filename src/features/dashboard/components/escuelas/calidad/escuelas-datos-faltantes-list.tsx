import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { EscuelaDatosFaltantes } from '@dashboard/lib/escuelas-types';

interface EscuelasDatosFaltantesListProps {
  data: EscuelaDatosFaltantes[];
}

export function EscuelasDatosFaltantesList({
  data,
}: EscuelasDatosFaltantesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escuelas con Datos Faltantes (Top 50)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">CUE</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Datos Faltantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((escuela) => (
              <TableRow key={escuela.id_escuela}>
                <TableCell className="font-mono">{escuela.cue}</TableCell>
                <TableCell>{escuela.nombre}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {escuela.faltantes.map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
