"use client";

import * as React from "react";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { IconDownload } from "@tabler/icons-react";
import type { DetalleDiarioEmpleado } from "@dashboard/lib/types";
import { translateDayName } from "@dashboard/lib/utils";

interface EmployeeDailyReportTableProps {
  data: DetalleDiarioEmpleado[];
  empleadoNombre: string;
  mes: string;
}

export function EmployeeDailyReportTable({
  data,
  empleadoNombre,
  mes,
}: EmployeeDailyReportTableProps) {
  const totales = React.useMemo(() => {
    const diasTrabajados = data.length;
    const totalHoras = data.reduce(
      (sum, d) => sum + Number(d.horas_trabajadas || 0),
      0
    );
    const promedioHoras = diasTrabajados > 0 ? totalHoras / diasTrabajados : 0;

    return { diasTrabajados, totalHoras, promedioHoras };
  }, [data]);

  const exportToCSV = () => {
    const headers = [
      "Fecha",
      "Día",
      "Entrada",
      "Salida",
      "Horas Trabajadas",
      "Marcaciones",
      "Tipo Jornada",
    ];

    const rows = data.map((d) => [
      d.dia,
      d.dia_semana,
      d.entrada || "-",
      d.salida || "-",
      Number(d.horas_trabajadas).toFixed(2),
      d.total_marcas,
      d.tipo_jornada,
    ]);

    // Agregar fila de totales
    rows.push([
      "TOTAL",
      "",
      "",
      "",
      totales.totalHoras.toFixed(2),
      "",
      `${totales.diasTrabajados} días`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const legajo = data[0]?.legajo || "empleado";
    link.download = `detalle_${legajo}_${mes}.csv`;
    link.click();
  };

  const getTipoJornadaColor = (tipo: string) => {
    switch (tipo) {
      case "Jornada completa":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Media jornada":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Parcial":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Resumen y acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Días Trabajados</p>
            <p className="text-2xl font-bold">{totales.diasTrabajados}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Horas</p>
            <p className="text-2xl font-bold">
              {totales.totalHoras.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Promedio Hs/Día</p>
            <p className="text-2xl font-bold">
              {totales.promedioHoras.toFixed(1)}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <IconDownload className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Tabla detalle */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Día</TableHead>
              <TableHead className="text-center">Entrada</TableHead>
              <TableHead className="text-center">Salida</TableHead>
              <TableHead className="text-center">Horas</TableHead>
              <TableHead className="text-center">Marcaciones</TableHead>
              <TableHead className="text-center">Tipo Jornada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              <>
                {data.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{d.dia}</TableCell>
                    <TableCell className="capitalize">
                      {translateDayName(d.dia_semana)}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.entrada || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.salida || "-"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {Number(d.horas_trabajadas).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.total_marcas}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={getTipoJornadaColor(d.tipo_jornada)}
                      >
                        {d.tipo_jornada}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fila de totales */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={4}>TOTAL</TableCell>
                  <TableCell className="text-center">
                    {totales.totalHoras.toFixed(2)} hs
                  </TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">
                    {totales.diasTrabajados} días
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No hay registros para el período seleccionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
