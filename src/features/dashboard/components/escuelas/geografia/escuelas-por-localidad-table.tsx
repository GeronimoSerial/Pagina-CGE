import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EscuelasPorLocalidad } from '@dashboard/lib/escuelas-types';

interface EscuelasPorLocalidadTableProps {
  data: EscuelasPorLocalidad[];
}

export function EscuelasPorLocalidadTable({
  data,
}: EscuelasPorLocalidadTableProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Localidades</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Localidad</TableHead>
              <TableHead>Dpto.</TableHead>
              <TableHead className="text-right">Escuelas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.localidad}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.departamento}
                </TableCell>
                <TableCell className="text-right">{item.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
