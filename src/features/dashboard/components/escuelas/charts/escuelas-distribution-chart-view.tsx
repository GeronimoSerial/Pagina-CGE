'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/shared/ui/chart';
import { DistribucionZonaModalidad } from '@dashboard/lib/escuelas-types';

interface EscuelasDistributionChartViewProps {
  data: DistribucionZonaModalidad[];
}

const chartConfig = {
  comun: {
    label: 'Común',
    color: 'hsl(var(--chart-1))',
  },
  especial: {
    label: 'Especial',
    color: 'hsl(var(--chart-2))',
  },
  adultos: {
    label: 'Adultos',
    color: 'hsl(var(--chart-3))',
  },
  inicial: {
    label: 'Inicial',
    color: 'hsl(var(--chart-4))',
  },
  hospitalaria: {
    label: 'Hospitalaria',
    color: 'hsl(var(--chart-5))',
  },
  contextos_encierro: {
    label: 'Contexto Encierro',
    color: 'hsl(var(--chart-6))',
  },
  sin_modalidad: {
    label: 'Sin Modalidad',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;

export function EscuelasDistributionChartView({
  data,
}: EscuelasDistributionChartViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Zona y Modalidad</CardTitle>
        <CardDescription>
          Cantidad de escuelas por zona geográfica y tipo de educación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full min-w-0"
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="zona"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="comun"
              stackId="a"
              fill="var(--color-comun)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inicial"
              stackId="a"
              fill="var(--color-inicial)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="especial"
              stackId="a"
              fill="var(--color-especial)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="adultos"
              stackId="a"
              fill="var(--color-adultos)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="hospitalaria"
              stackId="a"
              fill="var(--color-hospitalaria)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="contextos_encierro"
              stackId="a"
              fill="var(--color-contextos_encierro)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="sin_modalidad"
              stackId="a"
              fill="var(--color-sin_modalidad)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
