"use client";

import { useState } from "react";
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
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconX,
  IconDownload,
} from "@tabler/icons-react";
import { Feriado, FeriadoCreate } from "@dashboard/lib/types";
import { createFeriado, updateFeriado, deleteFeriado } from "@dashboard/actions/actions";
import { translateDayName } from "@dashboard/lib/utils";
import { toast } from "sonner";

interface FeriadosTableProps {
  feriados: Feriado[];
  aniosDisponibles: number[];
  anioSeleccionado?: number;
  onAnioChange: (anio: number | undefined) => void;
  onDataChange: () => void;
}

export function FeriadosTable({
  feriados,
  aniosDisponibles,
  anioSeleccionado,
  onAnioChange,
  onDataChange,
}: FeriadosTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FeriadoCreate>({
    fecha: "",
    descripcion: "",
    tipo: "nacional",
  });
  const [newFeriado, setNewFeriado] = useState<FeriadoCreate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const tipoColors: Record<string, string> = {
    nacional: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    provincial:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    administrativo:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const handleStartEdit = (feriado: Feriado) => {
    setEditingId(feriado.id);
    setEditForm({
      fecha: feriado.fecha,
      descripcion: feriado.descripcion,
      tipo: feriado.tipo,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ fecha: "", descripcion: "", tipo: "nacional" });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateFeriado(editingId, editForm);
      toast.success("Feriado actualizado correctamente");
      setEditingId(null);
      onDataChange();
    } catch (error) {
      toast.error("Error al actualizar el feriado");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este feriado?")) return;
    try {
      await deleteFeriado(id);
      toast.success("Feriado eliminado correctamente");
      onDataChange();
    } catch (error) {
      toast.error("Error al eliminar el feriado");
      console.error(error);
    }
  };

  const handleStartCreate = () => {
    setNewFeriado({
      fecha: "",
      descripcion: "",
      tipo: "nacional",
    });
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setNewFeriado(null);
    setIsCreating(false);
  };

  const handleSaveCreate = async () => {
    if (!newFeriado) return;
    if (!newFeriado.fecha || !newFeriado.descripcion) {
      toast.error("Complete todos los campos requeridos");
      return;
    }
    try {
      await createFeriado(newFeriado);
      toast.success("Feriado creado correctamente");
      setNewFeriado(null);
      setIsCreating(false);
      onDataChange();
    } catch (error) {
      toast.error("Error al crear el feriado");
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Fecha", "Descripción", "Tipo", "Día"];
    const rows = feriados.map((f) => [
      f.fecha,
      f.descripcion,
      f.tipo,
      translateDayName(f.dia_semana) || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feriados_${anioSeleccionado || "todos"}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={anioSeleccionado?.toString() || "todos"}
            onValueChange={(v) =>
              onAnioChange(v === "todos" ? undefined : Number(v))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar por año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los años</SelectItem>
              {aniosDisponibles.map((anio) => (
                <SelectItem key={anio} value={anio.toString()}>
                  {anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {feriados.length} feriados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <IconDownload className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button size="sm" onClick={handleStartCreate} disabled={isCreating}>
            <IconPlus className="h-4 w-4 mr-2" />
            Agregar Feriado
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Día</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Fila de creación */}
            {isCreating && newFeriado && (
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Input
                    type="date"
                    value={newFeriado.fecha}
                    onChange={(e) =>
                      setNewFeriado({ ...newFeriado, fecha: e.target.value })
                    }
                    className="w-[150px]"
                  />
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Input
                    value={newFeriado.descripcion}
                    onChange={(e) =>
                      setNewFeriado({
                        ...newFeriado,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Descripción del feriado"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={newFeriado.tipo}
                    onValueChange={(v) =>
                      setNewFeriado({ ...newFeriado, tipo: v })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="provincial">Provincial</SelectItem>
                      <SelectItem value="administrativo">
                        Administrativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveCreate}
                    >
                      <IconCheck className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelCreate}
                    >
                      <IconX className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Filas de datos */}
            {feriados.map((feriado) => (
              <TableRow key={feriado.id}>
                <TableCell>
                  {editingId === feriado.id ? (
                    <Input
                      type="date"
                      value={editForm.fecha}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fecha: e.target.value })
                      }
                      className="w-[150px]"
                    />
                  ) : (
                    <span className="font-medium">{feriado.fecha}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {translateDayName(feriado.dia_semana)}
                </TableCell>
                <TableCell>
                  {editingId === feriado.id ? (
                    <Input
                      value={editForm.descripcion}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  ) : (
                    feriado.descripcion
                  )}
                </TableCell>
                <TableCell>
                  {editingId === feriado.id ? (
                    <Select
                      value={editForm.tipo}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, tipo: v })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nacional">Nacional</SelectItem>
                        <SelectItem value="provincial">Provincial</SelectItem>
                        <SelectItem value="administrativo">
                          Administrativo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={tipoColors[feriado.tipo] || ""}>
                      {feriado.tipo}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === feriado.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveEdit}
                      >
                        <IconCheck className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <IconX className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(feriado)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(feriado.id)}
                      >
                        <IconTrash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {feriados.length === 0 && !isCreating && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay feriados registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
