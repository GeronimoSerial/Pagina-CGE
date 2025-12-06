/**
 * AI Chat Tools for the CGE Dashboard
 * Tools for querying employees, schools, attendance, and raw SQL
 */

import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/features/dashboard/lib/prisma';
import { sanitizeSQL } from './sql-sanitizer';
import {
  findSchoolId,
  fuzzyFindLegajosByName,
  fuzzyFindPersonByName,
  fuzzyFindSchoolIds,
  normalizeText,
  findBestDepartmentName,
} from './search-utils';

/**
 * Raw SQL query tool - LAST RESORT
 * Only used when specific tools can't handle the query
 */
export const queryDatabaseTool = tool({
  description:
    'ÚLTIMO RECURSO: Ejecuta SQL SELECT cuando las otras herramientas no cubren el caso. Requiere LIMIT ≤100 para consultas de datos, pero NO requiere LIMIT para COUNT(). Antes de usar, verificá si getSchoolInfo, getEmployeeInfo o getAttendanceStats pueden resolver la consulta. IMPORTANTE: Para búsquedas geográficas (ej: "en Goya"), priorizá filtrar por DEPARTAMENTO, no solo localidad.',
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Consulta SQL SELECT. Ejemplo: 'SELECT nombre FROM huella.legajo LIMIT 10' o 'SELECT count(*) FROM institucional.escuela'",
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

      // Serialize BigInts to strings to avoid JSON errors
      const serializedResult = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );

      return {
        success: true,
        razonDeUso: razon,
        data: serializedResult,
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

      if (legajo) {
        const employees = await prisma.legajo.findMany({
          where: { cod: legajo },
          take: 5,
        });
        if (employees.length === 0) {
          return { error: `No se encontró empleado con legajo ${legajo}` };
        }
        return {
          success: true,
          data: employees.map((emp) => ({
            legajo: emp.cod,
            nombre: emp.nombre,
            area: emp.area,
            turno: emp.turno,
            estado: emp.estado,
            dni: emp.dni,
            email: emp.email,
            fechaIngreso: emp.fecha_ingreso,
          })),
          totalEncontrados: employees.length,
        };
      }

      if (dni) {
        const employees = await prisma.legajo.findMany({
          where: { dni },
          take: 5,
        });
        if (employees.length === 0) {
          return { error: `No se encontró empleado con DNI ${dni}` };
        }
        return {
          success: true,
          data: employees.map((emp) => ({
            legajo: emp.cod,
            nombre: emp.nombre,
            area: emp.area,
            turno: emp.turno,
            estado: emp.estado,
            dni: emp.dni,
            email: emp.email,
            fechaIngreso: emp.fecha_ingreso,
          })),
          totalEncontrados: employees.length,
        };
      }

      // Fuzzy por nombre
      if (nombre) {
        const matches = await fuzzyFindLegajosByName(nombre, 10);
        if (matches.length === 0) {
          return {
            error: `No se encontraron empleados con nombre similar a "${nombre}"`,
          };
        }

        const best = matches[0];
        const HIGH_CONFIDENCE = 0.8;
        const MEDIUM_CONFIDENCE = 0.6;
        const mapped = matches.map((m) => ({
          legajo: m.item.cod,
          nombre: m.item.nombre,
          area: m.item.area,
          turno: m.item.turno,
          estado: m.item.estado,
          dni: m.item.dni,
          email: m.item.email,
          fechaIngreso: m.item.fecha_ingreso,
          score: m.score,
        }));

        if (best.score >= HIGH_CONFIDENCE || matches.length === 1) {
          return {
            success: true,
            data: mapped[0],
            totalEncontrados: matches.length,
            fuzzy: { tipo: 'nombre', confianza: 'alta', score: best.score },
          };
        }

        if (best.score >= MEDIUM_CONFIDENCE) {
          return {
            success: true,
            data: mapped.slice(0, 3),
            totalEncontrados: matches.length,
            fuzzy: {
              tipo: 'nombre',
              confianza: 'media',
              aclaracion: 'Varias coincidencias, confirma cuál querés.',
              mejorLegajoSugerido: best.item.cod,
            },
          };
        }

        return {
          success: true,
          data: mapped.slice(0, 5),
          totalEncontrados: matches.length,
          fuzzy: {
            tipo: 'nombre',
            confianza: 'baja',
            aclaracion:
              'Coincidencia débil. Confirmá cuál de estos empleados es el correcto.',
            mejorLegajoSugerido: best.item.cod,
          },
        };
      }

      return { error: 'Parámetros insuficientes' };
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
      let matchScore: number | null = null;

      // Find employee by name if no legajo provided
      if (!targetLegajo && nombre) {
        const matches = await fuzzyFindLegajosByName(nombre, 5);
        if (matches.length === 0) {
          return {
            error: `No se encontró empleado con nombre "${nombre}"`,
          };
        }

        const best = matches[0];
        targetLegajo = best.item.cod;
        matchScore = best.score;

        // Si la coincidencia es débil, devolvemos advertencia pero continuamos
        if (best.score < 0.55 && matches.length > 1) {
          return {
            success: true,
            warning:
              'Coincidencia débil, por favor confirma el empleado antes de usar los datos de asistencia.',
            candidatos: matches.slice(0, 3).map((m) => ({
              legajo: m.item.cod,
              nombre: m.item.nombre,
              score: m.score,
            })),
          };
        }
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
        fuzzy:
          matchScore !== null
            ? { tipo: 'nombre', score: matchScore, aclaracion: 'Resolución de legajo por fuzzy' }
            : undefined,
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
    'Busca escuelas por CUE, nombre, número de escuela o localidad. Incluye datos completos y director actual. MEJORA: Separa siempre la localidad del nombre de la escuela si es posible.',
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
    departamento: z
      .string()
      .optional()
      .describe('Departamento para filtrar escuelas. Ej: "Goya", "Capital"'),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      if (!cue && !nombre && !localidad) {
        return {
          error: 'Debés proporcionar CUE, nombre o localidad de la escuela',
        };
      }

      // 1. Search by CUE (Exact match)
      if (cue) {
        const escuela = await prisma.escuela.findUnique({
          where: { cue: BigInt(cue) },
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
        });

        if (!escuela) {
          return { error: `No se encontró escuela con CUE ${cue}` };
        }

        // Fetch director
        const director = await prisma.director_escuela.findFirst({
          where: {
            id_escuela: escuela.id_escuela,
            OR: [{ fecha_fin: null }, { fecha_fin: { gte: new Date() } }],
          },
          include: { persona: true },
          orderBy: { fecha_inicio: 'desc' },
        });

        return {
          success: true,
          data: {
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
          },
          totalEncontradas: 1,
        };
      }

      // 2. Fuzzy Search by Name and/or Localidad
      const escuelasIds = await fuzzyFindSchoolIds(
        nombre,
        localidad,
        departamento,
        20,
      );

      if (escuelasIds.length === 0) {
        return {
          error: `No se encontraron escuelas con los criterios proporcionados. Intenta ser más específico o verificar el nombre.`,
        };
      }

      // 3. Fetch full details for found IDs
      // We need to preserve the order of IDs from the fuzzy search
      const escuelas = await prisma.escuela.findMany({
        where: { id_escuela: { in: escuelasIds } },
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
      });

      // Sort results to match the order of escuelasIds (similarity order)
      const escuelasSorted = escuelasIds
        .map((id) => escuelas.find((e) => e.id_escuela === id))
        .filter((e): e is (typeof escuelas)[0] => e !== undefined);

      // Get directors for each school
      const escuelasConDirector = await Promise.all(
        escuelasSorted.map(async (escuela) => {
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

/**
 * School Infrastructure Tool
 */
export const getSchoolInfrastructureTool = tool({
  description:
    'Obtiene información de infraestructura, conectividad y servicios de una escuela.',
  inputSchema: z.object({
    cue: z.string().optional().describe('CUE de la escuela'),
    nombre: z.string().optional().describe('Nombre de la escuela'),
    localidad: z.string().optional().describe('Localidad de la escuela'),
    departamento: z.string().optional().describe('Departamento de la escuela'),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      const idEscuela = await findSchoolId(
        nombre,
        localidad,
        cue,
        departamento,
      );
      if (!idEscuela)
        return { error: 'No se encontró la escuela especificada.' };

      const escuela = await prisma.escuela.findUnique({
        where: { id_escuela: idEscuela },
        include: {
          localidad: true,
          cocina: {
            orderBy: { fecha: 'desc' },
            take: 1,
          },
        },
      });

      return {
        success: true,
        data: {
          escuela: escuela?.nombre,
          cue: escuela?.cue.toString(),
          localidad: escuela?.localidad?.nombre,
          edificioPropio: escuela?.edificio_propio,
          comparteEdificio: escuela?.comparte_edificio,
          tieneEmpresaLimpieza: escuela?.tiene_empresa_limpieza,
          obsLimpieza: escuela?.obs_limpieza,
          servicioComida: escuela?.id_serv_comida,
          ultimaCocina: escuela?.cocina[0]?.datos || null,
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
 * School Enrollment Tool
 */
export const getSchoolEnrollmentTool = tool({
  description:
    'Obtiene la matrícula (cantidad de alumnos) histórica de una escuela.',
  inputSchema: z.object({
    cue: z.string().optional(),
    nombre: z.string().optional(),
    localidad: z.string().optional(),
    departamento: z.string().optional(),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      const idEscuela = await findSchoolId(
        nombre,
        localidad,
        cue,
        departamento,
      );
      if (!idEscuela) return { error: 'No se encontró la escuela.' };

      const matricula = await prisma.matricula.findMany({
        where: { id_escuela: idEscuela },
        orderBy: { anio: 'desc' },
      });

      const escuela = await prisma.escuela.findUnique({
        where: { id_escuela: idEscuela },
        select: { nombre: true },
      });

      return {
        success: true,
        escuela: escuela?.nombre,
        data: matricula,
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * Supervisor Info Tool
 */
export const getSupervisorInfoTool = tool({
  description:
    'Busca información de supervisión: quién supervisa una escuela o qué escuelas supervisa una persona.',
  inputSchema: z.object({
    escuela_nombre: z
      .string()
      .optional()
      .describe('Nombre de la escuela para buscar su supervisor'),
    localidad: z
      .string()
      .optional()
      .describe('Localidad/departamento de la escuela para desambiguar'),
    departamento: z
      .string()
      .optional()
      .describe('Departamento de la escuela para desambiguar'),
    supervisor_nombre: z
      .string()
      .optional()
      .describe('Nombre del supervisor para buscar sus escuelas'),
  }),
  execute: async ({
    escuela_nombre,
    supervisor_nombre,
    localidad,
    departamento,
  }) => {
    try {
      if (escuela_nombre) {
        // Si viene un supervisor_nombre junto con escuela_nombre, lo ignoramos (probable localidad).
        const idEscuela = await findSchoolId(
          escuela_nombre,
          localidad,
          undefined,
          departamento,
        );
        if (!idEscuela) return { error: 'No se encontró la escuela.' };

        const supervisor = await prisma.supervisor_escuela.findFirst({
          where: { id_escuela: idEscuela },
          include: {
            persona: true,
            cargo: true,
            autoridad: true,
          },
        });

        if (!supervisor)
          return {
            error: 'La escuela no tiene supervisor asignado actualmente.',
          };

        return {
          success: true,
          tipo: 'supervisor_de_escuela',
          data: {
            nombre: `${supervisor.persona.nombre} ${supervisor.persona.apellido}`,
            telefono: supervisor.persona.telefono,
            mail: supervisor.persona.mail,
            cargo: supervisor.cargo.descripcion,
            autoridad: supervisor.autoridad.descripcion,
          },
        };
      }

      if (supervisor_nombre) {
        const personas = await fuzzyFindPersonByName(supervisor_nombre, 5);

        if (personas.length === 0)
          return {
            error: `No se encontró ninguna persona con nombre "${supervisor_nombre}"`,
          };
        const best = personas[0];

        if (personas.length > 1 && best.score < 0.65)
          return {
            error:
              'Se encontraron varias personas, por favor sé más específico.',
            candidatos: personas.slice(0, 3).map((p) => ({
              nombre: `${p.item.nombre} ${p.item.apellido}`,
              score: p.score,
            })),
          };

        const persona = best.item;
        const escuelasSupervisadas = await prisma.supervisor_escuela.findMany({
          where: { id_persona: persona.id_persona },
          include: {
            escuela: {
              include: { localidad: true },
            },
          },
        });

        return {
          success: true,
          tipo: 'escuelas_supervisadas',
          supervisor: `${persona.nombre} ${persona.apellido}`,
          cantidad: escuelasSupervisadas.length,
          escuelas: escuelasSupervisadas.map((s) => ({
            nombre: s.escuela.nombre,
            cue: s.escuela.cue.toString(),
            localidad: s.escuela.localidad?.nombre,
          })),
        };
      }

      return {
        error: 'Debés proporcionar escuela_nombre o supervisor_nombre.',
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * Department Supervisor Tool
 * Busca supervisores asociados a escuelas de un departamento (ej: "Capital", "Goya").
 */
export const getDepartmentSupervisorsTool = tool({
  description:
    'Busca supervisores de escuelas en un departamento. Úsalo cuando pregunten "quién es el supervisor de <departamento>". Devuelve supervisores y las escuelas que cubren en ese departamento.',
  inputSchema: z.object({
    departamento: z
      .string()
      .describe(
        'Nombre del departamento (ej: "Goya", "Capital", "Bella Vista"). Se hace búsqueda difusa.',
      ),
  }),
  execute: async ({ departamento }) => {
    try {
      const bestDept = await findBestDepartmentName(departamento);
      if (!bestDept) {
        return { error: 'Debés proporcionar un departamento' };
      }

      const supervisors = await prisma.supervisor_escuela.findMany({
        where: {
          escuela: {
            localidad: {
              departamento: {
                nombre: { equals: bestDept, mode: 'insensitive' },
              },
            },
          },
        },
        include: {
          persona: true,
          cargo: true,
          autoridad: true,
          escuela: {
            include: {
              localidad: {
                include: { departamento: true },
              },
            },
          },
        },
      });

      if (supervisors.length === 0) {
        return {
          error: `No se encontraron supervisores para el departamento "${departamento}".`,
        };
      }

      // Agrupar por persona para evitar duplicados si cubre varias escuelas
      const byPersona = new Map<
        number,
        {
          nombre: string;
          telefono: string | null;
          mail: string | null;
          cargo: string | null;
          autoridad: string | null;
          escuelas: { nombre: string; cue: string; localidad?: string | null }[];
        }
      >();

      for (const s of supervisors) {
        const personaId = s.persona.id_persona;
        if (!byPersona.has(personaId)) {
          byPersona.set(personaId, {
            nombre: `${s.persona.nombre} ${s.persona.apellido}`,
            telefono: s.persona.telefono,
            mail: s.persona.mail,
            cargo: s.cargo?.descripcion || null,
            autoridad: s.autoridad?.descripcion || null,
            escuelas: [],
          });
        }
        const entry = byPersona.get(personaId)!;
        entry.escuelas.push({
          nombre: s.escuela.nombre,
          cue: s.escuela.cue.toString(),
          localidad: s.escuela.localidad?.nombre,
        });
      }

      return {
        success: true,
        departamento: bestDept,
        supervisores: Array.from(byPersona.values()).map((s) => ({
          ...s,
          escuelas: s.escuelas.slice(0, 20), // limitar respuesta
          totalEscuelas: s.escuelas.length,
        })),
        totalSupervisores: byPersona.size,
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * School count by department tool
 */
export const getSchoolCountByDepartmentTool = tool({
  description:
    'Cuenta la cantidad de escuelas en un departamento (ej: "Capital", "Goya", "Paso de los Libres"). Usa búsqueda difusa para el nombre del departamento.',
  inputSchema: z.object({
    departamento: z.string().describe('Nombre del departamento a contar'),
  }),
  execute: async ({ departamento }) => {
    try {
      const bestDept = await findBestDepartmentName(departamento);
      if (!bestDept) {
        return {
          error: `No se pudo reconocer el departamento "${departamento}".`,
        };
      }

      const count = await prisma.escuela.count({
        where: {
          localidad: {
            departamento: {
              nombre: { equals: bestDept, mode: 'insensitive' },
            },
          },
        },
      });

      return {
        success: true,
        departamento: bestDept,
        totalEscuelas: count,
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * School Programs Tool
 */
export const getSchoolProgramsTool = tool({
  description: 'Lista los programas de acompañamiento asignados a una escuela.',
  inputSchema: z.object({
    cue: z.string().optional(),
    nombre: z.string().optional(),
    localidad: z.string().optional(),
    departamento: z.string().optional(),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      const idEscuela = await findSchoolId(
        nombre,
        localidad,
        cue,
        departamento,
      );
      if (!idEscuela) return { error: 'No se encontró la escuela.' };

      const programas = await prisma.escuela_programa.findMany({
        where: { id_escuela: idEscuela },
        include: {
          programa_acompanamiento: true,
        },
      });

      const escuela = await prisma.escuela.findUnique({
        where: { id_escuela: idEscuela },
        select: { nombre: true },
      });

      return {
        success: true,
        escuela: escuela?.nombre,
        programas: programas.map((p) => p.programa_acompanamiento.descripcion),
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * School Kitchen Survey Tool
 */
export const getSchoolKitchenSurveyTool = tool({
  description:
    'Obtiene los datos del relevamiento de cocina y comedor de una escuela (información detallada en formato JSON).',
  inputSchema: z.object({
    cue: z.string().optional(),
    nombre: z.string().optional(),
    localidad: z.string().optional(),
    departamento: z.string().optional(),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      const idEscuela = await findSchoolId(
        nombre,
        localidad,
        cue,
        departamento,
      );
      if (!idEscuela) return { error: 'No se encontró la escuela.' };

      const cocina = await prisma.cocina.findFirst({
        where: { id_escuela: idEscuela },
        orderBy: { fecha: 'desc' },
      });

      const escuela = await prisma.escuela.findUnique({
        where: { id_escuela: idEscuela },
        select: { nombre: true },
      });

      if (!cocina)
        return {
          error:
            'No se encontraron datos de relevamiento de cocina para esta escuela.',
        };

      return {
        success: true,
        escuela: escuela?.nombre,
        fecha_relevamiento: cocina.fecha,
        datos: cocina.datos, // JSONB field
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

/**
 * School Problematics Tool
 */
export const getSchoolProblematicsTool = tool({
  description: 'Obtiene las problemáticas reportadas por una escuela.',
  inputSchema: z.object({
    cue: z.string().optional(),
    nombre: z.string().optional(),
    localidad: z.string().optional(),
    departamento: z.string().optional(),
  }),
  execute: async ({ cue, nombre, localidad, departamento }) => {
    try {
      const idEscuela = await findSchoolId(
        nombre,
        localidad,
        cue,
        departamento,
      );
      if (!idEscuela) return { error: 'No se encontró la escuela.' };

      const problematicas = await prisma.escuela_problematica.findMany({
        where: { id_escuela: idEscuela },
        include: {
          problematica: true,
        },
      });

      const escuela = await prisma.escuela.findUnique({
        where: { id_escuela: idEscuela },
        select: { nombre: true },
      });

      if (problematicas.length === 0)
        return {
          success: true,
          escuela: escuela?.nombre,
          mensaje: 'La escuela no tiene problemáticas reportadas.',
        };

      return {
        success: true,
        escuela: escuela?.nombre,
        cantidad: problematicas.length,
        problematicas: problematicas.map((p) => ({
          descripcion: p.problematica.descripcion,
        })),
      };
    } catch (error) {
      return {
        error: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  },
});

export const chatTools = {
  queryDatabase: queryDatabaseTool,
  getEmployeeInfo: getEmployeeInfoTool,
  getAttendanceStats: getAttendanceStatsTool,
  getSchoolInfo: getSchoolInfoTool,
  getSchoolInfrastructure: getSchoolInfrastructureTool,
  getSchoolEnrollment: getSchoolEnrollmentTool,
  getSupervisorInfo: getSupervisorInfoTool,
  getDepartmentSupervisors: getDepartmentSupervisorsTool,
  getSchoolCountByDepartment: getSchoolCountByDepartmentTool,
  getSchoolPrograms: getSchoolProgramsTool,
  getSchoolKitchenSurvey: getSchoolKitchenSurveyTool,
  getSchoolProblematics: getSchoolProblematicsTool,
};
