'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
} from '@/shared/ui/chart';
import { EstadisticaDiaria } from '@dashboard/lib/types';
import { parseDateString } from '@dashboard/lib/utils';

interface AttendanceChartProps {
  data: EstadisticaDiaria[];
}

const chartConfig = {
  presentes: {
    label: 'Presentes',
    color: 'hsl(142, 76%, 36%)', // green
  },
  ausentes: {
    label: 'Ausentes',
    color: 'hsl(0, 84%, 60%)', // red
  },
} satisfies ChartConfig;

export function AttendanceChartView({ data }: AttendanceChartProps) {
  const chartData = data.map((item) => ({
    date: item.dia,
    presentes: item.presentes,
    ausentes: item.ausentes,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencia diaria</CardTitle>
        <CardDescription>Presentes / ausentes por día</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return parseDateString(value).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'short',
                });
              }}
              minTickGap={20}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return parseDateString(value as string).toLocaleDateString(
                      'es-AR',
                      {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      },
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="presentes"
              fill="var(--color-presentes)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="ausentes"
              fill="var(--color-ausentes)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
