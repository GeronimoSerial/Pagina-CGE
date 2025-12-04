"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  IconDownload,
  IconSearch,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import { EmpleadoConJornada } from "@dashboard/lib/types";
import { upsertConfigJornada, updateMultipleJornadas } from "@dashboard/actions/actions";
import { toast } from "sonner";

interface JornadaConfigTableProps {
  empleados: EmpleadoConJornada[];
  onDataChange: () => void;
}

export function JornadaConfigTable({
  empleados,
  onDataChange,
}: JornadaConfigTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJornada, setFilterJornada] = useState<string>("todas");
  const [filterArea, setFilterArea] = useState<string>("todas");
  const [pendingChanges, setPendingChanges] = useState<Map<string, 4 | 6 | 8>>(
    new Map()
  );

  const areas = useMemo(() => {
    const uniqueAreas = new Set(empleados.map((e) => e.area).filter(Boolean));
    return Array.from(uniqueAreas).sort();
  }, [empleados]);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((emp) => {
      const matchesSearch =
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.legajo.includes(searchTerm) ||
        (emp.dni && emp.dni.includes(searchTerm));

      const matchesJornada =
        filterJornada === "todas" ||
        emp.horas_jornada === Number(filterJornada);

      const matchesArea = filterArea === "todas" || emp.area === filterArea;

      return matchesSearch && matchesJornada && matchesArea;
    });
  }, [empleados, searchTerm, filterJornada, filterArea]);

  const jornadaColors: Record<number, string> = {
    4: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    6: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    8: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  const handleJornadaChange = (legajo: string, horas: 4 | 6 | 8) => {
    const emp = empleados.find((e) => e.legajo === legajo);
    if (emp && emp.horas_jornada !== horas) {
      setPendingChanges((prev) => {
        const next = new Map(prev);
        next.set(legajo, horas);
        return next;
      });
    } else {
      setPendingChanges((prev) => {
        const next = new Map(prev);
        next.delete(legajo);
        return next;
      });
    }
  };

  const handleSaveChanges = async () => {
    if (pendingChanges.size === 0) return;

    try {
      const configs = Array.from(pendingChanges.entries()).map(
        ([legajo, horas_jornada]) => ({
          legajo,
          horas_jornada,
        })
      );
      await updateMultipleJornadas(configs);
      toast.success(`${configs.length} configuración(es) guardada(s)`);
      setPendingChanges(new Map());
      onDataChange();
    } catch (error) {
      toast.error("Error al guardar los cambios");
      console.error(error);
    }
  };

  const handleSaveSingle = async (legajo: string, horas: 4 | 6 | 8) => {
    try {
      await upsertConfigJornada({ legajo, horas_jornada: horas });
      toast.success("Configuración guardada");
      setPendingChanges((prev) => {
        const next = new Map(prev);
        next.delete(legajo);
        return next;
      });
      onDataChange();
    } catch (error) {
      toast.error("Error al guardar la configuración");
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Legajo",
      "Nombre",
      "Área",
      "DNI",
      "Horas Jornada",
      "Tipo Jornada",
    ];
    const rows = filteredEmpleados.map((e) => [
      e.legajo,
      e.nombre,
      e.area || "",
      e.dni || "",
      e.horas_jornada,
      e.tipo_jornada,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "configuracion_jornadas.csv";
    link.click();
  };

  // Estadísticas
  const stats = useMemo(() => {
    const jornada4 = empleados.filter((e) => e.horas_jornada === 4).length;
    const jornada6 = empleados.filter((e) => e.horas_jornada === 6).length;
    const jornada8 = empleados.filter((e) => e.horas_jornada === 8).length;
    return { jornada4, jornada6, jornada8 };
  }, [empleados]);

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      <div className="grid gap-4 grid-cols-3">
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-muted-foreground">
              Media Jornada (4hs)
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.jornada4}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              Jornada Reducida (6hs)
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.jornada6}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Jornada Completa (8hs)
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.jornada8}</p>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, legajo o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[280px]"
            />
          </div>
          <Select value={filterJornada} onValueChange={setFilterJornada}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Jornada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las jornadas</SelectItem>
              <SelectItem value="4">4 horas</SelectItem>
              <SelectItem value="6">6 horas</SelectItem>
              <SelectItem value="8">8 horas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area!}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredEmpleados.length} empleados
          </span>
        </div>
        <div className="flex items-center gap-2">
          {pendingChanges.size > 0 && (
            <Button onClick={handleSaveChanges} variant="default">
              <IconCheck className="h-4 w-4 mr-2" />
              Guardar {pendingChanges.size} cambio(s)
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <IconDownload className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Legajo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Jornada Actual</TableHead>
              <TableHead>Configurar Jornada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpleados.map((emp) => {
              const hasPendingChange = pendingChanges.has(emp.legajo);
              const pendingValue = pendingChanges.get(emp.legajo);

              return (
                <TableRow
                  key={emp.legajo}
                  className={
                    hasPendingChange ? "bg-yellow-50 dark:bg-yellow-900/10" : ""
                  }
                >
                  <TableCell className="font-mono">{emp.legajo}</TableCell>
                  <TableCell className="font-medium">{emp.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {emp.area || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {emp.dni || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={jornadaColors[emp.horas_jornada]}>
                      {emp.horas_jornada}hs
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={(pendingValue || emp.horas_jornada).toString()}
                        onValueChange={(v) =>
                          handleJornadaChange(
                            emp.legajo,
                            Number(v) as 4 | 6 | 8
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 horas</SelectItem>
                          <SelectItem value="6">6 horas</SelectItem>
                          <SelectItem value="8">8 horas</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasPendingChange && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleSaveSingle(emp.legajo, pendingValue!)
                          }
                        >
                          <IconCheck className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredEmpleados.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
