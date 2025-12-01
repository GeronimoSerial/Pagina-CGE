import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getEmpleadoDetalle,
  getAsistenciaPorEmpleado,
  getAusentesPorEmpleado,
  getResumenMensualEmpleado,
  getExcepciones,
  isEmpleadoInWhitelist,
} from "@dashboard/actions/actions";
import { MonthlyCalendar } from "@dashboard/components/monthly-calendar";
import { EmployeeStatsCards } from "@dashboard/components/employee-stats-cards";
import { EmployeeAttendanceTable } from "@dashboard/components/employee-attendance-table";
import { DateFilter } from "@dashboard/components/date-filter";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { parseDateString } from "@dashboard/lib/utils";
import {
  IconArrowLeft,
  IconUser,
  IconShieldCheck,
  IconBeach,
} from "@tabler/icons-react";

function getDefaultRange() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstOfMonth.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10),
  };
}

export default async function EmpleadoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ legajo: string }>;
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { legajo } = await params;
  const search = await searchParams;
  const defaults = getDefaultRange();
  const startDate = search?.start ?? defaults.start;
  const endDate = search?.end ?? defaults.end;

  const empleado = await getEmpleadoDetalle(legajo);

  if (!empleado) {
    notFound();
  }

  const legajoNum = parseInt(legajo, 10);

  // Parsear la fecha sin problemas de zona horaria
  const [startYear, startMonthNum] = startDate.split("-").map(Number);
  const mesStr = `${startYear}-${String(startMonthNum).padStart(2, "0")}-01`;

  const [asistencia, ausencias, resumen, excepciones, inWhitelist] =
    await Promise.all([
      getAsistenciaPorEmpleado(legajoNum, startDate, endDate),
      getAusentesPorEmpleado(legajoNum, startDate, endDate),
      getResumenMensualEmpleado(legajoNum, mesStr),
      getExcepciones(legajo),
      isEmpleadoInWhitelist(legajo),
    ]);

  const presentDays = asistencia.map((a) => a.dia);
  const absentDays = ausencias.map((a) => a.dia);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/asistencia">
          <Button variant="outline" size="icon">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <IconUser className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">
              {empleado.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">
              Legajo: {empleado.legajo}
              {empleado.area && ` • ${empleado.area}`}
              {empleado.turno && ` • ${empleado.turno}`}
            </p>
          </div>
          {inWhitelist && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
              <IconShieldCheck className="h-3 w-3" />
              En Whitelist
            </Badge>
          )}
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Estado</p>
          <p className="text-lg font-medium">
            {empleado.inactivo ? (
              <span className="text-red-600">Inactivo</span>
            ) : (
              <span className="text-green-600">Activo</span>
            )}
          </p>
        </div>
        {empleado.fechaingreso && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
            <p className="text-lg font-medium">
              {parseDateString(empleado.fechaingreso).toLocaleDateString(
                "es-AR"
              )}
            </p>
          </div>
        )}
        {empleado.email && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-medium truncate">{empleado.email}</p>
          </div>
        )}
        {empleado.dni && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">DNI</p>
            <p className="text-lg font-medium">{empleado.dni}</p>
          </div>
        )}
      </div>

      {/* Date Filter */}
      <DateFilter defaultStart={startDate} defaultEnd={endDate} />

      {/* Stats Cards */}
      <EmployeeStatsCards
        diasTrabajados={resumen?.dias_trabajados ?? asistencia.length}
        totalHoras={resumen?.total_horas ?? null}
        promedioHoras={resumen?.promedio_horas_dia ?? null}
        diasAusente={ausencias.length}
      />

      {/* Calendar and Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyCalendar
          year={startYear}
          month={startMonthNum - 1}
          presentDays={presentDays}
          absentDays={absentDays}
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Detalle de Asistencia
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({startDate} a {endDate})
            </span>
          </h3>
          <EmployeeAttendanceTable data={asistencia} />
        </div>
      </div>

      {/* Historial de Excepciones */}
      {excepciones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <IconBeach className="h-5 w-5" />
            Historial de Excepciones
          </h3>
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Fecha Inicio
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Fecha Fin
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Días
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Registrado Por
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {excepciones.map((exc) => {
                    const tipoLabels: Record<string, string> = {
                      vacaciones: "Vacaciones",
                      art_8: "Art. 8 - Razones de salud",
                      art_11: "Art. 11 - Cambio de tareas",
                      art_12: "Art. 12 - Enfermedad familiar",
                      art_13: "Art. 13 - Maternidad",
                      art_15: "Art. 15 - Matrimonio",
                      art_16: "Art. 16 - Fallecimiento familiar",
                      art_17: "Art. 17 - Representación política",
                      art_18: "Art. 18 - Representación gremial",
                      art_19: "Art. 19 - Exámenes",
                      art_21: "Art. 21 - Perfeccionamiento",
                      art_22: "Art. 22 - Razones Particulares",
                      art_27: "Art. 27 - Licencia especial",
                      art_28: "Art. 28 - Cargo mayor jerarquía",
                      art_29: "Art. 29 - Actividades deportivas",
                      lic_gineco: "Estudios Ginecológicos",
                      comision_servicio: "Comisión de Servicio",
                      otro: "Otro",
                    };
                    const tipoColors: Record<string, string> = {
                      vacaciones:
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                      art_8:
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                      art_11:
                        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
                      art_12:
                        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                      art_13:
                        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
                      art_15:
                        "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
                      art_16:
                        "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
                      art_17:
                        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
                      art_18:
                        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
                      art_19:
                        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                      art_21:
                        "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
                      art_22:
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                      art_27:
                        "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
                      art_28:
                        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
                      art_29:
                        "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
                      lic_gineco:
                        "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300",
                      comision_servicio:
                        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
                      otro: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
                    };
                    return (
                      <tr key={exc.id} className="border-b">
                        <td className="px-4 py-3">
                          <Badge className={tipoColors[exc.tipo] || ""}>
                            {tipoLabels[exc.tipo] || exc.tipo}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {exc.fecha_inicio}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {exc.fecha_fin}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{exc.dias_excepcion}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {exc.descripcion || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {exc.created_by}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {exc.created_at}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
