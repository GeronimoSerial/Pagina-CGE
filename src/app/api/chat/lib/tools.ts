/**
 * AI Chat Tools for the CGE Dashboard
 * Tools for querying employees, schools, attendance, and raw SQL
 */

import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/features/dashboard/lib/prisma';
import { sanitizeSQL } from './sql-sanitizer';
import { buildNameFilter, buildSchoolNameFilter } from './search-utils';

/**
 * Raw SQL query tool - LAST RESORT
 * Only used when specific tools can't handle the query
 */
export const queryDatabaseTool = tool({
  description:
    'ÚLTIMO RECURSO: Ejecuta SQL SELECT cuando las otras herramientas no cubren el caso. Requiere LIMIT ≤100. Antes de usar, verificá si getSchoolInfo, getEmployeeInfo o getAttendanceStats pueden resolver la consulta.',
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Consulta SQL SELECT con LIMIT ≤100. Ejemplo: SELECT nombre FROM huella.legajo WHERE area = 'X' LIMIT 10",
      ),
    razon: z
      .string()
      .describe(
        'Explicación breve de por qué no se puede usar otra herramienta y qué devuelve esta consulta.',
      ),
  }),
  execute: async ({ query, razon }) => {
    const validation = sanitizeSQL(query);
    if (!validation.safe) {
      return { error: validation.error };
    }

    try {
      const result = await prisma.$queryRawUnsafe(query);
      return {
        success: true,
        razonDeUso: razon,
        data: result,
        rowCount: Array.isArray(result) ? result.length : 0,
      };
    } catch (error) {
      return {
        error: `Error en la consulta: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        hint: 'Verificá nombres de tablas/columnas en el esquema.',
      };
    }
  },
});

/**
 * Employee search tool
 * Supports search by legajo, name (any order), or DNI
 */
export const getEmployeeInfoTool = tool({
  description:
    'Busca empleados por legajo, nombre o DNI. Soporta búsquedas parciales y en cualquier orden (ej: "Serial Geronimo" o "Geronimo Serial").',
  inputSchema: z.object({
    legajo: z
      .string()
      .optional()
      .describe('Número de legajo del empleado (búsqueda exacta)'),
    nombre: z
      .string()
      .optional()
      .describe(
        'Nombre completo o parcial del empleado. Funciona en cualquier orden: "Geronimo Serial" o "Serial Geronimo"',
      ),
    dni: z.string().optional().describe('DNI del empleado (búsqueda exacta)'),
  }),
  execute: async ({ legajo, nombre, dni }) => {
    try {
      if (!legajo && !nombre && !dni) {
        return {
          error: 'Debés proporcionar legajo, nombre o DNI para buscar',
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let whereClause: any = {};

      if (legajo) {
        whereClause = { cod: legajo };
      } else if (dni) {
        whereClause = { dni: dni };
      } else if (nombre) {
        whereClause = buildNameFilter(nombre);
      }

      const employees = await prisma.legajo.findMany({
        where: whereClause,
        take: 10,
      });

      if (employees.length === 0) {
        return {
          error: legajo
            ? `No se encontró empleado con legajo ${legajo}`
            : dni
              ? `No se encontró empleado con DNI ${dni}`
              : `No se encontraron empleados con nombre "${nombre}"`,
        };
      }

      const result = employees.map((emp) => ({
        legajo: emp.cod,
        nombre: emp.nombre,
        area: emp.area,
        turno: emp.turno,
        estado: emp.estado,
        dni: emp.dni,
        email: emp.email,
        fechaIngreso: emp.fecha_ingreso,
      }));

      return {
        success: true,
        data: employees.length === 1 ? result[0] : result,
        totalEncontrados: employees.length,
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * Attendance statistics tool
 * Gets monthly attendance stats for an employee
 */
export const getAttendanceStatsTool = tool({
  description:
    'Obtiene estadísticas de asistencia para un empleado. Puede buscar por legajo o nombre (en cualquier orden). Si no se especifican fechas, usa el mes actual (2025).',
  inputSchema: z.object({
    legajo: z.string().optional().describe('Número de legajo del empleado'),
    nombre: z
      .string()
      .optional()
      .describe(
        'Nombre del empleado (funciona en cualquier orden: "Geronimo Serial" o "Serial Geronimo")',
      ),
    mes: z
      .number()
      .optional()
      .describe(
        'Número del mes (1-12). Si no se especifica, usa el mes actual',
      ),
    anio: z.number().optional().describe('Año. Si no se especifica, usa 2025'),
  }),
  execute: async ({ legajo, nombre, mes, anio }) => {
    try {
      let targetLegajo = legajo;

      // Find employee by name if no legajo provided
      if (!targetLegajo && nombre) {
        const whereClause = buildNameFilter(nombre);
        const employee = await prisma.legajo.findFirst({
          where: whereClause,
        });

        if (!employee) {
          return {
            error: `No se encontró empleado con nombre "${nombre}"`,
          };
        }

        targetLegajo = employee.cod;
      }

      if (!targetLegajo) {
        return {
          error: 'Debés proporcionar legajo o nombre del empleado',
        };
      }

      // Default to current month in 2025
      const now = new Date();
      const targetYear = anio || 2025;
      const targetMonth = mes || now.getMonth() + 1;

      // Calculate date range for the month
      const fechaInicio = new Date(targetYear, targetMonth - 1, 1);
      const fechaFin = new Date(targetYear, targetMonth, 0, 23, 59, 59);

      const marcas = await prisma.marcas.findMany({
        where: {
          legajo: targetLegajo,
          ts: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
        orderBy: { ts: 'asc' },
      });

      // Get employee info
      const employee = await prisma.legajo.findUnique({
        where: { cod: targetLegajo },
      });

      const diasConMarcas = new Set(
        marcas.map((m) => m.ts?.toISOString().split('T')[0]),
      ).size;

      // Calculate work days in the month (excluding weekends)
      let diasLaborables = 0;
      const current = new Date(fechaInicio);
      while (current <= fechaFin) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          diasLaborables++;
        }
        current.setDate(current.getDate() + 1);
      }

      const meses = [
        '',
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

      return {
        success: true,
        data: {
          empleado: employee?.nombre || targetLegajo,
          legajo: targetLegajo,
          periodo: `${meses[targetMonth]} ${targetYear}`,
          totalMarcas: marcas.length,
          diasConRegistro: diasConMarcas,
          diasLaborablesDelMes: diasLaborables,
          porcentajeAsistencia:
            diasLaborables > 0
              ? Math.round((diasConMarcas / diasLaborables) * 100)
              : 0,
        },
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * School search tool
 * Supports search by CUE, name/number, or localidad
 */
export const getSchoolInfoTool = tool({
  description:
    'Busca escuelas por CUE, nombre, número de escuela o localidad. Incluye datos completos y director actual.',
  inputSchema: z.object({
    cue: z
      .string()
      .optional()
      .describe('Código Único de Establecimiento (CUE). Ej: 180001200'),
    nombre: z
      .string()
      .optional()
      .describe(
        'Nombre o parte del nombre de la escuela. Ej: "Escuela N° 17", "48", "Escuela Primaria 48"',
      ),
    localidad: z
      .string()
      .optional()
      .describe(
        'Nombre de la localidad para filtrar escuelas. Ej: "Bella Vista"',
      ),
  }),
  execute: async ({ cue, nombre, localidad }) => {
    try {
      if (!cue && !nombre && !localidad) {
        return {
          error: 'Debés proporcionar CUE, nombre o localidad de la escuela',
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let whereClause: any = {};
      let localidadIds: number[] | null = null;

      // Get matching localidad IDs first (avoids Prisma nested filter issues)
      if (localidad) {
        const matchingLocalidades = await prisma.localidad.findMany({
          where: {
            nombre: {
              contains: localidad,
              mode: 'insensitive',
            },
          },
          select: { id_localidad: true },
        });
        localidadIds = matchingLocalidades.map((l) => l.id_localidad);

        if (localidadIds.length === 0) {
          return {
            error: `No se encontraron localidades con nombre "${localidad}"`,
          };
        }
      }

      // Build where clause
      if (cue) {
        whereClause = { cue: BigInt(cue) };
      } else if (nombre && localidadIds) {
        const nombreFilter = buildSchoolNameFilter(nombre);
        whereClause = {
          AND: [nombreFilter, { id_localidad: { in: localidadIds } }],
        };
      } else if (nombre) {
        whereClause = buildSchoolNameFilter(nombre);
      } else if (localidadIds) {
        whereClause = { id_localidad: { in: localidadIds } };
      }

      const escuelas = await prisma.escuela.findMany({
        where: whereClause,
        include: {
          categoria: true,
          zona: true,
          modalidad: true,
          turno: true,
          localidad: {
            include: {
              departamento: true,
            },
          },
        },
        take: 100,
      });

      if (escuelas.length === 0) {
        return {
          error: cue
            ? `No se encontró escuela con CUE ${cue}`
            : localidad && nombre
              ? `No se encontraron escuelas con nombre "${nombre}" en "${localidad}"`
              : localidad
                ? `No se encontraron escuelas en "${localidad}"`
                : `No se encontraron escuelas con nombre "${nombre}"`,
        };
      }

      // Get directors for each school
      const escuelasConDirector = await Promise.all(
        escuelas.map(async (escuela) => {
          const director = await prisma.director_escuela.findFirst({
            where: {
              id_escuela: escuela.id_escuela,
              OR: [{ fecha_fin: null }, { fecha_fin: { gte: new Date() } }],
            },
            include: { persona: true },
            orderBy: { fecha_inicio: 'desc' },
          });

          return {
            id: escuela.id_escuela,
            cue: escuela.cue.toString(),
            nombre: escuela.nombre,
            anexo: escuela.anexo,
            telefono: escuela.telefono,
            mail: escuela.mail,
            fechaFundacion: escuela.fecha_fundacion,
            categoria: escuela.categoria?.descripcion,
            zona: escuela.zona?.descripcion,
            modalidad: escuela.modalidad?.descripcion,
            turno: escuela.turno?.descripcion,
            localidad: escuela.localidad?.nombre,
            departamento: escuela.localidad?.departamento?.nombre,
            edificioPropio: escuela.edificio_propio,
            comparteEdificio: escuela.comparte_edificio,
            director: director
              ? {
                  nombre: `${director.persona.nombre} ${director.persona.apellido}`,
                  dni: director.persona.dni,
                  telefono: director.persona.telefono,
                  mail: director.persona.mail,
                  desde: director.fecha_inicio,
                }
              : null,
          };
        }),
      );

      return {
        success: true,
        data:
          escuelasConDirector.length === 1
            ? escuelasConDirector[0]
            : escuelasConDirector,
        totalEncontradas: escuelasConDirector.length,
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * All available tools for the chat API
 */
export const chatTools = {
  queryDatabase: queryDatabaseTool,
  getEmployeeInfo: getEmployeeInfoTool,
  getAttendanceStats: getAttendanceStatsTool,
  getSchoolInfo: getSchoolInfoTool,
};
