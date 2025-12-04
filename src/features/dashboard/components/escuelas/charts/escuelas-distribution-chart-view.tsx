'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart';
import { Button } from '@/shared/ui/button';
import { Download, Filter } from 'lucide-react';
import { DistribucionZonaModalidad } from '@dashboard/lib/escuelas-types';

interface EscuelasDistributionChartViewProps {
  data: DistribucionZonaModalidad[];
}

const chartConfig = {
  comun: { label: 'Común', color: 'hsl(221.2 83.2% 53.3%)' }, // Azul fuerte
  inicial: { label: 'Inicial', color: 'hsl(212 95% 68%)' }, // Azul claro
  especial: { label: 'Especial', color: 'hsl(262.1 83.3% 57.8%)' }, // Violeta
  adultos: { label: 'Adultos', color: 'hsl(170 80% 40%)' }, // Verde azulado
  hospitalaria: { label: 'Hospitalaria', color: 'hsl(346.8 77.2% 49.8%)' }, // Rosa/Rojo clínico
  contextos_encierro: {
    label: 'Contexto Encierro',
    color: 'hsl(24.6 95% 53.1%)',
  }, // Naranja alerta
  sin_modalidad: { label: 'Sin Asignar', color: 'hsl(0 0% 80%)' }, // Gris neutro (error)
} satisfies ChartConfig;

export function EscuelasDistributionChartView({
  data,
}: EscuelasDistributionChartViewProps) {
  return (
    <Card className="col-span-4 h-full shadow-sm">
      {/* HEADER: Título + Controles */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">
            Distribución Demográfica
          </CardTitle>
          <CardDescription className="max-w-lg">
            Análisis cruzado de instituciones según zona geográfica y modalidad
            educativa.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pl-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-[16/9] w-full h-[400px]"
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="zona"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-xs font-medium uppercase text-muted-foreground"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-muted-foreground"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {/* Tooltip personalizado estilo Glassmorphism */}
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              content={
                <ChartTooltipContent
                  className="w-48 rounded-lg border bg-background/95 p-2 shadow-xl backdrop-blur-sm"
                  indicator="dot"
                />
              }
            />
            {/* Barras con radios sutiles para modernidad */}
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={[0, 0, 0, 0]} // Cuadrado para apilado perfecto
                maxBarSize={60}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* FOOTER: Leyenda personalizada y organizada */}
      <CardFooter className="flex-col gap-4 border-t bg-muted/20 pt-6 text-sm">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full ring-2 ring-transparent transition-all hover:ring-offset-2"
                style={{ backgroundColor: config.color }}
              />
              <span
                className="text-xs font-medium text-muted-foreground truncate"
                title={config.label}
              >
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
