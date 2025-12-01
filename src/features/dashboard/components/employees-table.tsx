"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { IconUser, IconSearch, IconDownload } from "@tabler/icons-react";

interface Empleado {
  legajo: string;
  nombre: string;
}

interface EmployeesTableProps {
  data: Empleado[];
}

export function EmployeesTable({ data }: EmployeesTableProps) {
  const [search, setSearch] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter(
      (emp) =>
        emp.nombre.toLowerCase().includes(searchLower) ||
        emp.legajo.toString().includes(searchLower)
    );
  }, [data, search]);

  const exportToCSV = () => {
    const headers = ["Legajo", "Nombre"];
    const rows = filteredData.map((emp) => [emp.legajo, emp.nombre]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "empleados.csv";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o legajo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <IconDownload className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredData.length} de {data.length} empleado(s)
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Legajo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-[150px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((emp) => (
                <TableRow key={emp.legajo}>
                  <TableCell className="font-medium">{emp.legajo}</TableCell>
                  <TableCell>{emp.nombre}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/empleado/${emp.legajo}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <IconUser className="mr-2 h-4 w-4" />
                        Ver detalle
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  {search
                    ? "No se encontraron empleados con ese criterio."
                    : "No hay empleados activos."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
