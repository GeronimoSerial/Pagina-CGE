import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { MetricasCalidad } from '@dashboard/lib/escuelas-types';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';

interface CalidadStatsCardsProps {
  data: MetricasCalidad;
}

export function CalidadStatsCards({ data }: CalidadStatsCardsProps) {
  const calculatePercentage = (value: number) => {
    return ((value / data.total_escuelas) * 100).toFixed(1);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Modalidad</CardTitle>
          <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sin_modalidad}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(data.sin_modalidad)}% del total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Zona</CardTitle>
          <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sin_zona}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(data.sin_zona)}% del total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Categoría</CardTitle>
          <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sin_categoria}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(data.sin_categoria)}% del total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Supervisor</CardTitle>
          <IconX className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sin_supervisor}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(data.sin_supervisor)}% del total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
