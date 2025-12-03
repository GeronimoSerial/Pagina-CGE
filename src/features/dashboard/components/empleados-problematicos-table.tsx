'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  IconSearch,
  IconAlertTriangle,
  IconClock,
  IconCalendarX,
  IconClipboardX,
  IconExternalLink,
  IconDownload,
  IconFileTypePdf,
} from '@tabler/icons-react';
import { EmpleadoProblematico } from '@dashboard/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EmpleadosProblematicosTableProps {
  empleados: EmpleadoProblematico[];
}

export function EmpleadosProblematicosTable({
  empleados,
}: EmpleadosProblematicosTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProblema, setFilterProblema] = useState<string>('todos');

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((emp) => {
      const matchesSearch =
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.legajo.includes(searchTerm) ||
        (emp.dni && emp.dni.includes(searchTerm));

      let matchesProblema = true;
      if (filterProblema === 'ausencias') {
        matchesProblema = emp.problema_ausencias;
      } else if (filterProblema === 'cumplimiento') {
        matchesProblema = emp.problema_cumplimiento;
      } else if (filterProblema === 'incompletos') {
        matchesProblema = emp.problema_incompletos;
      }

      return matchesSearch && matchesProblema;
    });
  }, [empleados, searchTerm, filterProblema]);

  const stats = useMemo(() => {
    return {
      total: empleados.length,
      conAusencias: empleados.filter((e) => e.problema_ausencias).length,
      conCumplimiento: empleados.filter((e) => e.problema_cumplimiento).length,
      conIncompletos: empleados.filter((e) => e.problema_incompletos).length,
    };
  }, [empleados]);

  const getSeverityColor = (score: number) => {
    if (score >= 50) return 'text-red-600 dark:text-red-400';
    if (score >= 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getSeverityBg = (score: number) => {
    if (score >= 50)
      return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    if (score >= 25)
      return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
  };

  const exportToCSV = () => {
    const headers = [
      'Legajo',
      'Nombre',
      'DNI',
      'Área',
      'Turno',
      'Jornada (hs)',
      'Severidad',
      'Total Ausencias',
      'Días Trabajados',
      'Total Horas',
      'Horas Esperadas',
      '% Cumplimiento',
      'Días Incompletos',
      'Problema Ausencias',
      'Problema Cumplimiento',
      'Problema Incompletos',
      'Cantidad Problemas',
    ];

    const rows = filteredEmpleados.map((emp) => [
      emp.legajo,
      emp.nombre,
      emp.dni || '',
      emp.area || '',
      emp.turno || '',
      emp.horas_jornada || 8,
      Number(emp.score_severidad).toFixed(0),
      emp.total_ausencias,
      emp.dias_trabajados,
      Number(emp.total_horas).toFixed(2),
      emp.horas_esperadas,
      `${Number(emp.porcentaje_cumplimiento).toFixed(1)}%`,
      emp.dias_incompletos,
      emp.problema_ausencias ? 'Sí' : 'No',
      emp.problema_cumplimiento ? 'Sí' : 'No',
      emp.problema_incompletos ? 'Sí' : 'No',
      emp.cantidad_problemas,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fecha = new Date().toISOString().slice(0, 10);
    link.download = `empleados_problematicos_${fecha}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Colores institucionales
    const colorPrimario: [number, number, number] = [220, 38, 38];
    const colorSecundario: [number, number, number] = [100, 116, 139];

    // === ENCABEZADO INSTITUCIONAL ===
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, pageWidth, 25, 'F');

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CONSEJO GENERAL DE EDUCACIÓN', pageWidth / 2, 10, {
      align: 'center',
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema automatizado de asistencias', pageWidth / 2, 17, {
      align: 'center',
    });

    // Subtítulo del reporte
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('REPORTE DE EMPLEADOS QUE REQUIEREN ATENCIÓN', pageWidth / 2, 35, {
      align: 'center',
    });

    // Período
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...colorSecundario);
    doc.text('Últimos 30 días', pageWidth / 2, 42, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(margin, 46, pageWidth - margin, 46);

    // === RESUMEN EJECUTIVO ===
    const resumenY = 52;
    doc.setFillColor(254, 242, 242); // bg-red-50
    doc.roundedRect(margin, resumenY, pageWidth - margin * 2, 18, 2, 2, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    const boxWidth = (pageWidth - margin * 2) / 4;

    // Caja 1: Total que requieren atención
    doc.text('REQUIEREN ATENCIÓN', margin + boxWidth * 0.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text(stats.total.toString(), margin + boxWidth * 0.5, resumenY + 13, {
      align: 'center',
    });

    // Caja 2: Con ausencias
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('>3 AUSENCIAS', margin + boxWidth * 1.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(
      stats.conAusencias.toString(),
      margin + boxWidth * 1.5,
      resumenY + 13,
      { align: 'center' },
    );

    // Caja 3: Bajo cumplimiento
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('<60% CUMPLIMIENTO', margin + boxWidth * 2.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(
      stats.conCumplimiento.toString(),
      margin + boxWidth * 2.5,
      resumenY + 13,
      { align: 'center' },
    );

    // Caja 4: Días incompletos
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('>2 INCOMPLETOS', margin + boxWidth * 3.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(
      stats.conIncompletos.toString(),
      margin + boxWidth * 3.5,
      resumenY + 13,
      { align: 'center' },
    );

    // === TABLA DE DATOS ===
    const tableHeaders = [
      'Sev.',
      'Legajo',
      'Nombre',
      'DNI',
      'Área',
      'Ausenc.',
      'Cumpl.\n%',
      'Horas\nTrab.',
      'Horas\nEsper.',
      'Incompl.',
      'Problemas',
    ];

    const tableData = filteredEmpleados.map((emp) => [
      Number(emp.score_severidad).toFixed(0),
      emp.legajo,
      emp.nombre,
      emp.dni || '-',
      emp.area || '-',
      emp.total_ausencias.toString(),
      `${Number(emp.porcentaje_cumplimiento).toFixed(1)}%`,
      Number(emp.total_horas).toFixed(1),
      emp.horas_esperadas?.toString() || '-',
      emp.dias_incompletos.toString(),
      [
        emp.problema_ausencias ? 'Aus' : '',
        emp.problema_cumplimiento ? 'Cump' : '',
        emp.problema_incompletos ? 'Inc' : '',
      ]
        .filter(Boolean)
        .join(', '),
    ]);

    autoTable(doc, {
      startY: 75,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 }, // Severidad
        1: { halign: 'center', cellWidth: 18 }, // Legajo
        2: { halign: 'left', cellWidth: 50 }, // Nombre
        3: { halign: 'center', cellWidth: 22 }, // DNI
        4: { halign: 'left', cellWidth: 35 }, // Área
        5: { halign: 'center', cellWidth: 18 }, // Ausencias
        6: { halign: 'center', cellWidth: 18 }, // Cumplimiento
        7: { halign: 'center', cellWidth: 18 }, // Horas Trab
        8: { halign: 'center', cellWidth: 18 }, // Horas Esper
        9: { halign: 'center', cellWidth: 18 }, // Incompletos
        10: { halign: 'center', cellWidth: 35 }, // Problemas
      },
      alternateRowStyles: {
        fillColor: [254, 242, 242],
      },
      didParseCell: (data) => {
        // Colorear celda de severidad según valor
        if (data.column.index === 0 && data.section === 'body') {
          const value = parseFloat(data.cell.raw as string);
          if (!isNaN(value)) {
            if (value >= 50) {
              data.cell.styles.textColor = [220, 38, 38]; // red-600
            } else if (value >= 25) {
              data.cell.styles.textColor = [234, 88, 12]; // orange-600
            } else {
              data.cell.styles.textColor = [202, 138, 4]; // yellow-600
            }
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Colorear celda de ausencias
        if (data.column.index === 5 && data.section === 'body') {
          const value = parseInt(data.cell.raw as string);
          if (value > 3) {
            data.cell.styles.textColor = [220, 38, 38]; // red-600
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Colorear celda de cumplimiento
        if (data.column.index === 6 && data.section === 'body') {
          const value = parseFloat(data.cell.raw as string);
          if (!isNaN(value)) {
            if (value < 60) {
              data.cell.styles.textColor = [220, 38, 38]; // red-600
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      },
      margin: { left: margin, right: margin },
    });

    // === PIE DE PÁGINA ===
    const addFooter = () => {
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Línea superior del pie
        doc.setDrawColor(...colorPrimario);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        // Texto del pie
        doc.setFontSize(8);
        doc.setTextColor(...colorSecundario);
        doc.setFont('helvetica', 'normal');

        // Fecha de generación
        const fechaGeneracion = new Date().toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        doc.text(`Generado: ${fechaGeneracion}`, margin, pageHeight - 10);

        // Número de página
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' },
        );

        // Leyenda de documento oficial
        doc.setFont('helvetica', 'italic');
        doc.text(
          'Documento de uso interno - No modificable',
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' },
        );
      }
    };

    addFooter();

    const fecha = new Date().toISOString().slice(0, 10);
    doc.save(`empleados_problematicos_${fecha}.pdf`);
  };

  if (empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
          <IconAlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          ¡Sin empleados problemáticos!
        </h3>
        <p className="text-muted-foreground max-w-md">
          No hay empleados que cumplan los criterios de atención en los últimos
          30 días. Todos los empleados tienen menos de 4 ausencias, más de 60%
          de cumplimiento y menos de 3 días con marcaciones incompletas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border p-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-muted-foreground">
              Requieren Atención
            </span>
          </div>
          <p className="text-2xl font-bold mt-1 text-red-700 dark:text-red-400">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconCalendarX className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-muted-foreground">
              {'>'}3 Ausencias
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.conAusencias}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-muted-foreground">
              {'<'}60% Cumplimiento
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.conCumplimiento}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <IconClipboardX className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {'>'}2 Incompletos
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.conIncompletos}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, legajo o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterProblema} onValueChange={setFilterProblema}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de problema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los problemas</SelectItem>
              <SelectItem value="ausencias">Muchas ausencias</SelectItem>
              <SelectItem value="cumplimiento">Bajo cumplimiento</SelectItem>
              <SelectItem value="incompletos">Días incompletos</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredEmpleados.length} empleados
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <IconDownload className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="default"
            className="cursor-pointer bg-red-600 hover:bg-red-700"
            onClick={exportToPDF}
          >
            <IconFileTypePdf className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Severidad</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead className="hidden md:table-cell">Área</TableHead>
              <TableHead className="text-center">Ausencias</TableHead>
              <TableHead className="text-center">Cumplimiento</TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                Incompletos
              </TableHead>
              <TableHead className="text-center">Problemas</TableHead>
              <TableHead className="w-[80px]">Detalle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpleados.map((emp, index) => (
              <TableRow
                key={emp.legajo}
                className={index < 3 ? getSeverityBg(emp.score_severidad) : ''}
              >
                <TableCell>
                  <div
                    className={`font-bold text-lg ${getSeverityColor(
                      emp.score_severidad,
                    )}`}
                  >
                    {Number(emp.score_severidad).toFixed(0)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{emp.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Leg: {emp.legajo}
                      {emp.dni && ` • DNI: ${emp.dni}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {emp.area || '-'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={emp.problema_ausencias ? 'destructive' : 'outline'}
                    className="font-mono"
                  >
                    {emp.total_ausencias}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-medium ${
                      emp.problema_cumplimiento
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {Number(emp.porcentaje_cumplimiento).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {Number(emp.total_horas).toFixed(0)}/{emp.horas_esperadas}hs
                  </span>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  <Badge
                    variant={emp.problema_incompletos ? 'secondary' : 'outline'}
                    className={
                      emp.problema_incompletos
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : ''
                    }
                  >
                    {emp.dias_incompletos}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {emp.problema_ausencias && (
                      <IconCalendarX
                        className="h-4 w-4 text-orange-500"
                        title="Muchas ausencias"
                      />
                    )}
                    {emp.problema_cumplimiento && (
                      <IconClock
                        className="h-4 w-4 text-red-500"
                        title="Bajo cumplimiento"
                      />
                    )}
                    {emp.problema_incompletos && (
                      <IconClipboardX
                        className="h-4 w-4 text-yellow-500"
                        title="Días incompletos"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/empleados/${emp.legajo}`}>
                    <Button variant="ghost" size="sm">
                      <IconExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {filteredEmpleados.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron empleados con ese criterio
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1">
          <IconCalendarX className="h-3 w-3 text-orange-500" />
          <span>Más de 3 ausencias en 30 días</span>
        </div>
        <div className="flex items-center gap-1">
          <IconClock className="h-3 w-3 text-red-500" />
          <span>Menos del 60% de horas esperadas</span>
        </div>
        <div className="flex items-center gap-1">
          <IconClipboardX className="h-3 w-3 text-yellow-500" />
          <span>Más de 2 días con marcaciones incompletas</span>
        </div>
      </div>
    </div>
  );
}
