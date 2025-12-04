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
  IconSearch,
  IconShieldCheck,
  IconShieldOff,
} from "@tabler/icons-react";
import { WhitelistEmpleado, WhitelistCreate } from "@dashboard/lib/types";
import {
  addToWhitelist,
  updateWhitelist,
  removeFromWhitelist,
  toggleWhitelistStatus,
} from "@dashboard/actions/actions";
import { toast } from "sonner";

interface WhitelistTableProps {
  whitelist: WhitelistEmpleado[];
  empleados: { legajo: string; nombre: string }[];
  onDataChange: () => void;
}

export function WhitelistTable({
  whitelist,
  empleados,
  onDataChange,
}: WhitelistTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<WhitelistCreate>({
    legajo: "",
    motivo: "",
  });
  const [newItem, setNewItem] = useState<WhitelistCreate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Filtrar empleados que ya están en whitelist
  const empleadosDisponibles = empleados.filter(
    (emp) =>
      !whitelist.some((w) => w.legajo === emp.legajo) ||
      (editingId !== null &&
        whitelist.find((w) => w.id === editingId)?.legajo === emp.legajo)
  );

  const filteredWhitelist = whitelist.filter((w) => {
    const matchesSearch =
      !searchTerm ||
      w.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.legajo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "activo" && w.activo) ||
      (statusFilter === "inactivo" && !w.activo);
    return matchesSearch && matchesStatus;
  });

  const handleStartEdit = (item: WhitelistEmpleado) => {
    setEditingId(item.id);
    setEditForm({
      legajo: item.legajo,
      motivo: item.motivo,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ legajo: "", motivo: "" });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateWhitelist(editingId, editForm);
      toast.success("Registro actualizado correctamente");
      setEditingId(null);
      onDataChange();
    } catch (error) {
      toast.error("Error al actualizar el registro");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este registro de la whitelist?"))
      return;
    try {
      await removeFromWhitelist(id);
      toast.success("Registro eliminado correctamente");
      onDataChange();
    } catch (error) {
      toast.error("Error al eliminar el registro");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleWhitelistStatus(id, !currentStatus);
      toast.success(
        !currentStatus
          ? "Empleado activado en whitelist"
          : "Empleado desactivado de whitelist"
      );
      onDataChange();
    } catch (error) {
      toast.error("Error al cambiar el estado");
      console.error(error);
    }
  };

  const handleStartCreate = () => {
    setNewItem({
      legajo: "",
      motivo: "",
    });
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setNewItem(null);
    setIsCreating(false);
  };

  const handleSaveCreate = async () => {
    if (!newItem) return;
    if (!newItem.legajo || !newItem.motivo) {
      toast.error("Complete todos los campos requeridos");
      return;
    }
    try {
      await addToWhitelist(newItem, "sistema");
      toast.success("Empleado agregado a la whitelist correctamente");
      setNewItem(null);
      setIsCreating(false);
      onDataChange();
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate")) {
        toast.error("Este empleado ya está en la whitelist");
      } else {
        toast.error("Error al agregar a la whitelist");
      }
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Legajo",
      "Nombre",
      "Área",
      "Turno",
      "Motivo",
      "Estado",
      "Creado Por",
      "Fecha Creación",
    ];
    const rows = filteredWhitelist.map((w) => [
      w.legajo,
      w.nombre || "",
      w.area || "",
      w.turno || "",
      w.motivo,
      w.activo ? "Activo" : "Inactivo",
      w.created_by,
      w.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `whitelist_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total en Whitelist</p>
          <p className="text-2xl font-bold">{whitelist.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {whitelist.filter((w) => w.activo).length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Inactivos</p>
          <p className="text-2xl font-bold text-gray-500">
            {whitelist.filter((w) => !w.activo).length}
          </p>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, legajo o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[280px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredWhitelist.length} registros
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <IconDownload className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            size="sm"
            onClick={handleStartCreate}
            disabled={isCreating || empleadosDisponibles.length === 0}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Agregar a Whitelist
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado Por</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Fila de creación */}
            {isCreating && newItem && (
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Select
                    value={newItem.legajo}
                    onValueChange={(v) => setNewItem({ ...newItem, legajo: v })}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {empleadosDisponibles.map((emp) => (
                        <SelectItem key={emp.legajo} value={emp.legajo}>
                          {emp.nombre} ({emp.legajo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Input
                    value={newItem.motivo}
                    onChange={(e) =>
                      setNewItem({ ...newItem, motivo: e.target.value })
                    }
                    placeholder="Ej: Presidente, Director, Secretaria..."
                    className="w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Activo
                  </Badge>
                </TableCell>
                <TableCell>-</TableCell>
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
            {filteredWhitelist.map((item) => (
              <TableRow
                key={item.id}
                className={!item.activo ? "opacity-60" : ""}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.activo ? (
                      <IconShieldCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <IconShieldOff className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.legajo}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {item.area || "-"}
                    {item.turno && ` • ${item.turno}`}
                  </span>
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editForm.motivo}
                      onChange={(e) =>
                        setEditForm({ ...editForm, motivo: e.target.value })
                      }
                      className="w-[200px]"
                    />
                  ) : (
                    <span className="font-medium">{item.motivo}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.activo
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {item.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {item.created_by}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.created_at}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
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
                        onClick={() => handleToggleStatus(item.id, item.activo)}
                        title={item.activo ? "Desactivar" : "Activar"}
                      >
                        {item.activo ? (
                          <IconShieldOff className="h-4 w-4 text-orange-500" />
                        ) : (
                          <IconShieldCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(item)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                      >
                        <IconTrash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredWhitelist.length === 0 && !isCreating && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay empleados en la whitelist
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
