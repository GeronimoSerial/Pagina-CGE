'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import {
  IconSearch,
  IconDownload,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import type { ReporteLiquidacion } from '@dashboard/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Cantidad de filas por página
const ROWS_PER_PAGE = 25;

interface LiquidationReportTableProps {
  data: ReporteLiquidacion[];
  mesSeleccionado: string;
  diasConMarca: number;
}

export function LiquidationReportTable({
  data,
  mesSeleccionado,
  diasConMarca,
}: LiquidationReportTableProps) {
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.nombre.toLowerCase().includes(searchLower) ||
          emp.legajo.toString().includes(searchLower) ||
          (emp.dni && emp.dni.includes(searchLower)),
      );
    }

    return filtered;
  }, [data, search]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset página cuando cambia el filtro
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totales = React.useMemo(() => {
    return {
      empleados: filteredData.length,
      totalHoras: filteredData.reduce(
        (sum, emp) => sum + Number(emp.total_horas || 0),
        0,
      ),
      totalAusencias: filteredData.reduce(
        (sum, emp) => sum + Number(emp.dias_ausente || 0),
        0,
      ),
    };
  }, [filteredData]);

  const exportToCSV = () => {
    const headers = [
      'Legajo',
      'Nombre',
      'DNI',
      'Área',
      'Turno',
      'Jornada (hs)',
      'Días Trabajados',
      'Total Horas',
      'Horas Esperadas',
      'Cumplimiento %',
      'Promedio Hs/Día',
      'Días Ausente',
      'Días Incompletos',
      'Categoría',
      'Fecha Ingreso',
    ];

    const rows = filteredData.map((emp) => [
      emp.legajo,
      emp.nombre,
      emp.dni || '',
      emp.area || '',
      emp.turno || '',
      emp.horas_jornada || 8,
      emp.dias_trabajados,
      Number(emp.total_horas).toFixed(2),
      emp.horas_esperadas || '-',
      emp.porcentaje_cumplimiento
        ? `${Number(emp.porcentaje_cumplimiento).toFixed(1)}%`
        : '-',
      Number(emp.promedio_horas_dia).toFixed(2),
      emp.dias_ausente,
      emp.dias_incompletos,
      emp.categoria_horas,
      emp.fecha_ingreso || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_liquidacion_${mesSeleccionado}.csv`;
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

    // Formatear mes para mostrar
    const [year, month] = mesSeleccionado.split('-');
    const mesesNombres = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const mesNombre = `${mesesNombres[parseInt(month) - 1]} ${year}`;

    // Colores institucionales
    const colorPrimario: [number, number, number] = [21, 87, 36]; // Verde institucional oscuro
    const colorSecundario: [number, number, number] = [100, 116, 139]; // Gris slate

    // === ENCABEZADO INSTITUCIONAL ===
    // Banda superior
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
    doc.text('REPORTE DE ASISTENCIAS', pageWidth / 2, 35, {
      align: 'center',
    });

    // Período
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...colorSecundario);
    doc.text(`Período: ${mesNombre}`, pageWidth / 2, 42, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(margin, 46, pageWidth - margin, 46);

    // === RESUMEN EJECUTIVO ===
    const resumenY = 52;
    doc.setFillColor(248, 250, 252); // bg-slate-50
    doc.roundedRect(margin, resumenY, pageWidth - margin * 2, 18, 2, 2, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    const boxWidth = (pageWidth - margin * 2) / 4;

    // Caja 1: Empleados
    doc.text('EMPLEADOS', margin + boxWidth * 0.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(
      totales.empleados.toString(),
      margin + boxWidth * 0.5,
      resumenY + 13,
      { align: 'center' },
    );

    // Caja 2: Total Horas
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL HORAS', margin + boxWidth * 1.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(
      totales.totalHoras.toFixed(1),
      margin + boxWidth * 1.5,
      resumenY + 13,
      { align: 'center' },
    );

    // Caja 3: Días con Marcas
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'DÍAS CON MARCAS REGISTRADAS',
      margin + boxWidth * 2.5,
      resumenY + 6,
      {
        align: 'center',
      },
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(diasConMarca.toString(), margin + boxWidth * 2.5, resumenY + 13, {
      align: 'center',
    });

    // Caja 4: Total Ausencias
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AUSENCIAS', margin + boxWidth * 3.5, resumenY + 6, {
      align: 'center',
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38); // text-red-600
    doc.text(
      totales.totalAusencias.toString(),
      margin + boxWidth * 3.5,
      resumenY + 13,
      { align: 'center' },
    );

    // === TABLA DE DATOS ===
    const tableHeaders = [
      'Legajo',
      'Nombre',
      'DNI',
      'Área',
      'Jornada',
      'Días\nTrab.',
      'Horas\nTrab.',
      'Horas\nEsper.',
      'Cumpl.\n%',
      'Ausenc.',
      'Incompl.',
      'Categoría',
    ];

    const tableData = filteredData.map((emp) => [
      emp.legajo,
      emp.nombre,
      emp.dni || '-',
      emp.area || '-',
      `${emp.horas_jornada || 8}hs`,
      emp.dias_trabajados.toString(),
      Number(emp.total_horas).toFixed(1),
      emp.horas_esperadas?.toString() || '-',
      emp.porcentaje_cumplimiento
        ? `${Number(emp.porcentaje_cumplimiento).toFixed(1)}%`
        : '-',
      emp.dias_ausente.toString(),
      emp.dias_incompletos.toString(),
      emp.categoria_horas,
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
        0: { halign: 'center', cellWidth: 15 }, // Legajo
        1: { halign: 'left', cellWidth: 45 }, // Nombre
        2: { halign: 'center', cellWidth: 22 }, // DNI
        3: { halign: 'left', cellWidth: 35 }, // Área
        4: { halign: 'center', cellWidth: 15 }, // Jornada
        5: { halign: 'center', cellWidth: 15 }, // Días Trab
        6: { halign: 'center', cellWidth: 18 }, // Horas Trab
        7: { halign: 'center', cellWidth: 18 }, // Horas Esper
        8: { halign: 'center', cellWidth: 18 }, // Cumpl %
        9: { halign: 'center', cellWidth: 16 }, // Ausencias
        10: { halign: 'center', cellWidth: 16 }, // Incompletos
        11: { halign: 'center', cellWidth: 22 }, // Categoría
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didParseCell: (data) => {
        // Colorear celda de cumplimiento según valor
        if (data.column.index === 8 && data.section === 'body') {
          const value = parseFloat(data.cell.raw as string);
          if (!isNaN(value)) {
            if (value >= 90) {
              data.cell.styles.textColor = [22, 163, 74]; // green-600
            } else if (value >= 70) {
              data.cell.styles.textColor = [202, 138, 4]; // yellow-600
            } else {
              data.cell.styles.textColor = [220, 38, 38]; // red-600
            }
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Colorear celda de ausencias
        if (data.column.index === 9 && data.section === 'body') {
          const value = parseInt(data.cell.raw as string);
          if (value > 0) {
            data.cell.styles.textColor = [220, 38, 38]; // red-600
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Colorear celda de categoría
        if (data.column.index === 11 && data.section === 'body') {
          const categoria = data.cell.raw as string;
          if (categoria === 'Completo') {
            data.cell.styles.textColor = [22, 163, 74];
          } else if (categoria === 'Parcial') {
            data.cell.styles.textColor = [202, 138, 4];
          } else {
            data.cell.styles.textColor = [220, 38, 38];
          }
          data.cell.styles.fontStyle = 'bold';
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

    // Guardar el PDF con protección básica (solo lectura)
    doc.save(`reporte_liquidacion_${mesSeleccionado}.pdf`);
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Completo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros y acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, legajo o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las áreas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <IconDownload className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={exportToPDF}
          >
            <IconFileTypePdf className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Empleados</p>
          <p className="text-2xl font-bold">{totales.empleados}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Horas</p>
          <p className="text-2xl font-bold">{totales.totalHoras.toFixed(1)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Días con marcas</p>
          <p className="text-2xl font-bold">{diasConMarca}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Ausencias</p>
          <p className="text-2xl font-bold">{totales.totalAusencias}</p>
        </div>
      </div>

      {/* Tabla con Paginación */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Legajo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Área</TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                Jornada
              </TableHead>
              <TableHead className="text-center">Días Trab.</TableHead>
              <TableHead className="text-center">Horas</TableHead>
              <TableHead className="text-center">Cumplimiento</TableHead>
              <TableHead className="text-center">Ausencias</TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                Incompletos
              </TableHead>
              <TableHead className="text-center">Categoría</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((emp) => (
                <TableRow key={emp.legajo}>
                  <TableCell className="font-medium w-[80px]">
                    {emp.legajo}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{emp.nombre}</p>
                      {emp.dni && (
                        <p className="text-xs text-muted-foreground">
                          DNI: {emp.dni}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {emp.area || '-'}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <Badge variant="outline">{emp.horas_jornada || 8}hs</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.dias_trabajados}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <div>
                      <span>{Number(emp.total_horas).toFixed(1)}</span>
                      {emp.horas_esperadas && (
                        <span className="text-xs text-muted-foreground block">
                          / {emp.horas_esperadas}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.porcentaje_cumplimiento !== undefined &&
                    emp.porcentaje_cumplimiento !== null ? (
                      <span
                        className={`font-medium ${
                          Number(emp.porcentaje_cumplimiento) >= 90
                            ? 'text-green-600'
                            : Number(emp.porcentaje_cumplimiento) >= 70
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {Number(emp.porcentaje_cumplimiento).toFixed(1)}%
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.dias_ausente > 0 ? (
                      <span className="text-red-600 font-medium">
                        {emp.dias_ausente}
                      </span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {emp.dias_incompletos > 0 ? (
                      <span className="text-yellow-600">
                        {emp.dias_incompletos}
                      </span>
                    ) : (
                      '0'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className={getCategoriaColor(emp.categoria_horas)}
                    >
                      {emp.categoria_horas}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <Link
                      href={`/dashboard/reportes/${emp.legajo}?mes=${mesSeleccionado}`}
                    >
                      <Button variant="ghost" size="sm">
                        <IconFileSpreadsheet className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  {search
                    ? 'No se encontraron empleados con ese criterio.'
                    : 'No hay datos para el mes seleccionado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ROWS_PER_PAGE + 1} a{' '}
            {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} de{' '}
            {filteredData.length} empleados
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
