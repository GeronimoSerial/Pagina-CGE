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
  }),
  execute: async ({ cue, nombre, localidad }) => {
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
      let escuelasIds: number[] = [];

      // Helper to clean search terms
      const cleanTerm = (term: string) => term.trim().replace(/\s+/g, ' ');

      if (nombre) {
        const searchTerm = cleanTerm(nombre);
        const localidadTerm = localidad ? cleanTerm(localidad) : null;

        // Use pg_trgm for similarity search
        // We order by similarity to the search term
        // If localidad is provided, we filter by it (also fuzzy or exact)

        let query = `
          SELECT e.id_escuela, 
                 similarity(e.nombre, $1) as sim_score
          FROM institucional.escuela e
        `;

        const params: any[] = [searchTerm];
        let paramIdx = 2;

        if (localidadTerm) {
          query += `
            JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
            WHERE l.nombre ILIKE $${paramIdx}
          `;
          params.push(`%${localidadTerm}%`);
          paramIdx++;
        }

        // Add similarity threshold and ordering
        // If we didn't filter by localidad in WHERE, we add WHERE for similarity
        if (!localidadTerm) {
          query += ` WHERE e.nombre % $1 `; // % operator uses pg_trgm similarity threshold
        } else {
          query += ` AND e.nombre % $1 `;
        }

        query += ` ORDER BY sim_score DESC LIMIT 20`;

        try {
          // Set a lower threshold for this transaction if needed, but default 0.3 is usually fine.
          // await prisma.$executeRawUnsafe(`SET pg_trgm.similarity_threshold = 0.1;`);

          const results = await prisma.$queryRawUnsafe<
            { id_escuela: number; sim_score: number }[]
          >(query, ...params);
          escuelasIds = results.map((r) => r.id_escuela);
        } catch (e) {
          console.error('Error in fuzzy search:', e);
          // Fallback to simple ILIKE if pg_trgm fails or is not installed (though we checked)
          const fallbackResults = await prisma.escuela.findMany({
            where: {
              nombre: { contains: searchTerm, mode: 'insensitive' },
              ...(localidadTerm
                ? {
                    localidad: {
                      nombre: { contains: localidadTerm, mode: 'insensitive' },
                    },
                  }
                : {}),
            },
            select: { id_escuela: true },
            take: 20,
          });
          escuelasIds = fallbackResults.map((r) => r.id_escuela);
        }
      } else if (localidad) {
        // Only localidad provided
        const localidadTerm = cleanTerm(localidad);
        const results = await prisma.escuela.findMany({
          where: {
            localidad: {
              nombre: { contains: localidadTerm, mode: 'insensitive' },
            },
          },
          select: { id_escuela: true },
          take: 20,
        });
        escuelasIds = results.map((r) => r.id_escuela);
      }

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
import { findSchoolId } from './search-utils';

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
    supervisor_nombre: z
      .string()
      .optional()
      .describe('Nombre del supervisor para buscar sus escuelas'),
  }),
  execute: async ({ escuela_nombre, supervisor_nombre }) => {
    try {
      if (escuela_nombre) {
        // Note: We didn't add departamento to this tool's input schema yet,
        // but findSchoolId supports it.
        // The user usually asks "who supervises School X", rarely "School X in Dept Y".
        // But let's leave it simple for now unless requested.
        const idEscuela = await findSchoolId(escuela_nombre);
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
        const personas = await prisma.persona.findMany({
          where: {
            OR: [
              { nombre: { contains: supervisor_nombre, mode: 'insensitive' } },
              {
                apellido: { contains: supervisor_nombre, mode: 'insensitive' },
              },
            ],
          },
          take: 5,
        });

        if (personas.length === 0)
          return {
            error: `No se encontró ninguna persona con nombre "${supervisor_nombre}"`,
          };
        if (personas.length > 1)
          return {
            error: `Se encontraron varias personas, por favor sé más específico: ${personas.map((p) => p.nombre + ' ' + p.apellido).join(', ')}`,
          };

        const persona = personas[0];
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
  getSchoolPrograms: getSchoolProgramsTool,
  getSchoolKitchenSurvey: getSchoolKitchenSurveyTool,
  getSchoolProblematics: getSchoolProblematicsTool,
};
