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
} from "@tabler/icons-react";
import {
  ExcepcionAsistencia,
  ExcepcionCreate,
  TipoExcepcion,
} from "@dashboard/lib/types";
import {
  createExcepcion,
  updateExcepcion,
  deleteExcepcion,
} from "@dashboard/actions/actions";
import { toast } from "sonner";

interface ExcepcionesTableProps {
  excepciones: ExcepcionAsistencia[];
  empleados: { legajo: string; nombre: string }[];
  onDataChange: () => void;
}

const TIPOS_EXCEPCION: { value: TipoExcepcion; label: string }[] = [
  { value: "vacaciones", label: "Vacaciones" },
  { value: "art_8", label: "Art. 8 - Licencia por razones de salud" },
  { value: "art_11", label: "Art. 11 - Licencia por cambio de tareas" },
  { value: "art_12", label: "Art. 12 - Licencia por enfermedad de familiar" },
  { value: "art_13", label: "Art. 13 - Licencia por maternidad" },
  { value: "art_15", label: "Art. 15 - Licencia por matrimonio" },
  {
    value: "art_16",
    label: "Art. 16 - Licencia por fallecimiento de familiar",
  },
  { value: "art_17", label: "Art. 17 - Licencia por representación política" },
  { value: "art_18", label: "Art. 18 - Licencia por representación gremial" },
  { value: "art_19", label: "Art. 19 - Licencia por exámenes" },
  {
    value: "art_21",
    label: "Art. 21 - Licencia por perfeccionamiento o estudios",
  },
  { value: "art_22", label: "Art. 22 - Licencia por Razones Particulares" },
  { value: "art_27", label: "Art. 27 - Licencia especial" },
  { value: "art_28", label: "Art. 28 - Licencia por cargo de mayor jerarquía" },
  { value: "art_29", label: "Art. 29 - Licencia por actividades deportivas" },
  { value: "lic_gineco", label: "Licencia por Estudios Ginecológicos" },
  { value: "comision_servicio", label: "Comisión de Servicio" },
  { value: "otro", label: "Otro" },
];

const tipoColors: Record<TipoExcepcion, string> = {
  vacaciones:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  art_8: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  art_11: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  art_12:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  art_13: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  art_15: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
  art_16: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
  art_17:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  art_18: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  art_19: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  art_21: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  art_22:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  art_27:
    "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
  art_28:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  art_29: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
  lic_gineco:
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300",
  comision_servicio:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  otro: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function ExcepcionesTable({
  excepciones,
  empleados,
  onDataChange,
}: ExcepcionesTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ExcepcionCreate>({
    legajo: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo: "vacaciones",
    descripcion: "",
  });
  const [newExcepcion, setNewExcepcion] = useState<ExcepcionCreate | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");

  const filteredExcepciones = excepciones.filter((e) => {
    const matchesSearch =
      !searchTerm ||
      e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.legajo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || e.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const handleStartEdit = (excepcion: ExcepcionAsistencia) => {
    setEditingId(excepcion.id);
    setEditForm({
      legajo: excepcion.legajo,
      fecha_inicio: excepcion.fecha_inicio,
      fecha_fin: excepcion.fecha_fin,
      tipo: excepcion.tipo,
      descripcion: excepcion.descripcion || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      legajo: "",
      fecha_inicio: "",
      fecha_fin: "",
      tipo: "vacaciones",
      descripcion: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateExcepcion(editingId, editForm);
      toast.success("Excepción actualizada correctamente");
      setEditingId(null);
      onDataChange();
    } catch (error) {
      if (error instanceof Error && error.message.includes("solapa")) {
        toast.error(
          "Ya existe una excepción que se solapa con las fechas indicadas"
        );
      } else {
        toast.error("Error al actualizar la excepción");
      }
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta excepción?")) return;
    try {
      await deleteExcepcion(id);
      toast.success("Excepción eliminada correctamente");
      onDataChange();
    } catch (error) {
      toast.error("Error al eliminar la excepción");
      console.error(error);
    }
  };

  const handleStartCreate = () => {
    const today = new Date().toISOString().slice(0, 10);
    setNewExcepcion({
      legajo: "",
      fecha_inicio: today,
      fecha_fin: today,
      tipo: "vacaciones",
      descripcion: "",
    });
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setNewExcepcion(null);
    setIsCreating(false);
  };

  const handleSaveCreate = async () => {
    if (!newExcepcion) return;
    if (
      !newExcepcion.legajo ||
      !newExcepcion.fecha_inicio ||
      !newExcepcion.fecha_fin
    ) {
      toast.error("Complete todos los campos requeridos");
      return;
    }
    if (newExcepcion.fecha_fin < newExcepcion.fecha_inicio) {
      toast.error("La fecha de fin debe ser posterior a la de inicio");
      return;
    }
    try {
      await createExcepcion(newExcepcion);
      toast.success("Excepción creada correctamente");
      setNewExcepcion(null);
      setIsCreating(false);
      onDataChange();
    } catch (error) {
      if (error instanceof Error && error.message.includes("solapa")) {
        toast.error(
          "Ya existe una excepción que se solapa con las fechas indicadas"
        );
      } else {
        toast.error("Error al crear la excepción");
      }
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Legajo",
      "Nombre",
      "Área",
      "Fecha Inicio",
      "Fecha Fin",
      "Días",
      "Tipo",
      "Descripción",
      "Creado Por",
      "Fecha Creación",
    ];
    const rows = filteredExcepciones.map((e) => [
      e.legajo,
      e.nombre || "",
      e.area || "",
      e.fecha_inicio,
      e.fecha_fin,
      e.dias_excepcion,
      e.tipo,
      e.descripcion || "",
      e.created_by,
      e.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `excepciones_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const formatTipo = (tipo: TipoExcepcion) => {
    return TIPOS_EXCEPCION.find((t) => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="space-y-4">
      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o legajo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              {TIPOS_EXCEPCION.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredExcepciones.length} excepciones
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <IconDownload className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button size="sm" onClick={handleStartCreate} disabled={isCreating}>
            <IconPlus className="h-4 w-4 mr-2" />
            Agregar Excepción
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Creado Por</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Fila de creación */}
            {isCreating && newExcepcion && (
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Select
                    value={newExcepcion.legajo}
                    onValueChange={(v) =>
                      setNewExcepcion({ ...newExcepcion, legajo: v })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {empleados.map((emp) => (
                        <SelectItem key={emp.legajo} value={emp.legajo}>
                          {emp.nombre} ({emp.legajo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={newExcepcion.fecha_inicio}
                    onChange={(e) =>
                      setNewExcepcion({
                        ...newExcepcion,
                        fecha_inicio: e.target.value,
                      })
                    }
                    className="w-[140px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={newExcepcion.fecha_fin}
                    onChange={(e) =>
                      setNewExcepcion({
                        ...newExcepcion,
                        fecha_fin: e.target.value,
                      })
                    }
                    className="w-[140px]"
                  />
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Select
                    value={newExcepcion.tipo}
                    onValueChange={(v) =>
                      setNewExcepcion({
                        ...newExcepcion,
                        tipo: v as TipoExcepcion,
                      })
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_EXCEPCION.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={newExcepcion.descripcion || ""}
                    onChange={(e) =>
                      setNewExcepcion({
                        ...newExcepcion,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Descripción (opcional)"
                    className="w-[180px]"
                  />
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
            {filteredExcepciones.map((excepcion) => (
              <TableRow key={excepcion.id}>
                <TableCell>
                  {editingId === excepcion.id ? (
                    <Select
                      value={editForm.legajo}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, legajo: v })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {empleados.map((emp) => (
                          <SelectItem key={emp.legajo} value={emp.legajo}>
                            {emp.nombre} ({emp.legajo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <p className="font-medium">{excepcion.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {excepcion.legajo}
                        {excepcion.area && ` • ${excepcion.area}`}
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === excepcion.id ? (
                    <Input
                      type="date"
                      value={editForm.fecha_inicio}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          fecha_inicio: e.target.value,
                        })
                      }
                      className="w-[140px]"
                    />
                  ) : (
                    <span className="font-medium">
                      {excepcion.fecha_inicio}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === excepcion.id ? (
                    <Input
                      type="date"
                      value={editForm.fecha_fin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fecha_fin: e.target.value })
                      }
                      className="w-[140px]"
                    />
                  ) : (
                    <span className="font-medium">{excepcion.fecha_fin}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{excepcion.dias_excepcion}</Badge>
                </TableCell>
                <TableCell>
                  {editingId === excepcion.id ? (
                    <Select
                      value={editForm.tipo}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, tipo: v as TipoExcepcion })
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_EXCEPCION.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={tipoColors[excepcion.tipo] || ""}>
                      {formatTipo(excepcion.tipo)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === excepcion.id ? (
                    <Input
                      value={editForm.descripcion || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          descripcion: e.target.value,
                        })
                      }
                      className="w-[180px]"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {excepcion.descripcion || "-"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {excepcion.created_by}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {excepcion.created_at}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === excepcion.id ? (
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
                        onClick={() => handleStartEdit(excepcion)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(excepcion.id)}
                      >
                        <IconTrash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredExcepciones.length === 0 && !isCreating && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay excepciones registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
