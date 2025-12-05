'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AlertTriangle } from 'lucide-react';
import { DistribucionProblematica } from '@dashboard/lib/escuelas-types';

interface DistribucionProblematicasChartClientProps {
  data: DistribucionProblematica[];
}

export function DistribucionProblematicasChartClient({
  data,
}: DistribucionProblematicasChartClientProps) {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort(
    (a, b) => b.porcentaje_total - a.porcentaje_total,
  );

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          Distribución de Problemáticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="dimension"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DistribucionProblematica;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Dimensión
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {item.dimension}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Escuelas
                            </span>
                            <span className="font-bold text-foreground">
                              {item.escuelas_afectadas}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-[200px]">
                          {item.descripcion}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="porcentaje_total"
                radius={[0, 4, 4, 0]}
                barSize={32}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? 'hsl(var(--destructive))'
                        : 'hsl(var(--primary))'
                    }
                    opacity={index === 0 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
