"use client";

import {
  IconCalendar,
  IconClock,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface EmployeeStatsCardsProps {
  diasTrabajados: number;
  totalHoras: number | null;
  promedioHoras: number | null;
  diasAusente: number;
}

export function EmployeeStatsCards({
  diasTrabajados,
  totalHoras,
  promedioHoras,
  diasAusente,
}: EmployeeStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Días Trabajados</CardDescription>
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardTitle className="text-2xl font-bold px-6 pb-4">
          {diasTrabajados}
        </CardTitle>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Total Horas</CardDescription>
          <IconClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardTitle className="text-2xl font-bold px-6 pb-4">
          {totalHoras !== null ? Number(totalHoras).toFixed(1) : "-"}
        </CardTitle>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Promedio Horas/Día</CardDescription>
          <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardTitle className="text-2xl font-bold px-6 pb-4">
          {promedioHoras !== null ? Number(promedioHoras).toFixed(1) : "-"}
        </CardTitle>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Días Ausente</CardDescription>
          <IconX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardTitle className="text-2xl font-bold px-6 pb-4">
          {diasAusente}
        </CardTitle>
      </Card>
    </div>
  );
}
