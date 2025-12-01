"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import { PromedioHorasDiario } from "@dashboard/lib/types";
import { parseDateString } from "@dashboard/lib/utils";

interface HoursChartProps {
  data: PromedioHorasDiario[];
}

const chartConfig = {
  promedio_horas: {
    label: "Promedio Horas",
    color: "hsl(217, 91%, 60%)", // blue
  },
} satisfies ChartConfig;

export function HoursChart({ data }: HoursChartProps) {
  const chartData = data.map((item) => ({
    date: item.dia,
    promedio_horas: Number(Number(item.promedio_horas ?? 0).toFixed(2)),
    empleados: item.empleados_con_registro,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promedio de Horas Trabajadas</CardTitle>
        <CardDescription>
          Tendencia diaria del promedio de horas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="fillHoras" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-promedio_horas)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-promedio_horas)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return parseDateString(value).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "short",
                });
              }}
              minTickGap={20}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 12]}
              tickFormatter={(value) => `${value}h`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return parseDateString(value as string).toLocaleDateString(
                      "es-AR",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }
                    );
                  }}
                  formatter={(value, name) => {
                    if (name === "promedio_horas") {
                      return [`${value} horas`, "Promedio"];
                    }
                    return [value, name];
                  }}
                />
              }
            />
            <Area
              dataKey="promedio_horas"
              type="monotone"
              fill="url(#fillHoras)"
              stroke="var(--color-promedio_horas)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
