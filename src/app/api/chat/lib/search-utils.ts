/**
 * Search utilities for building flexible Prisma queries
 * Supports token-based search for names and special handling for school numbers
 */

import { prisma } from '@/features/dashboard/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaWhereClause = any;

/**
 * Builds a token-based search filter for names
 * Allows matching names in any order: "Serial Geronimo" or "Geronimo Serial"
 * @param nombre - The name string to search for
 * @returns Prisma where clause for name matching
 */
export function buildNameFilter(nombre: string): PrismaWhereClause {
  const tokens = nombre.split(/\s+/).filter((t) => t.length > 0);

  if (tokens.length === 1) {
    return {
      nombre: {
        contains: tokens[0],
        mode: 'insensitive' as const,
      },
    };
  }

  return {
    AND: tokens.map((token) => ({
      nombre: {
        contains: token,
        mode: 'insensitive' as const,
      },
    })),
  };
}

/**
 * Builds a search filter for school names with special handling for numbers
 * Handles variations like "N° 48", "Nº 48", "N°48", " 48"
 * @param nombreInput - The school name or number to search for
 * @returns Prisma where clause for school name matching
 */
export function buildSchoolNameFilter(nombreInput: string): PrismaWhereClause {
  const tokens = nombreInput.split(/\s+/).filter((t) => t.length > 0);

  // Extraer primer número que aparezca en el texto (ej: "Escuela N° 17 Juan XXIII")
  const numberMatch = nombreInput.match(/\d+/);
  const schoolNumber = numberMatch ? numberMatch[0] : null;

  // Caso: solo un token
  if (tokens.length === 1 && !schoolNumber) {
    // Búsqueda simple por contains
    return {
      nombre: {
        contains: tokens[0],
        mode: 'insensitive' as const,
      },
    };
  }

  // Condiciones por tokens de texto (no numéricos)
  const nonNumericTokens = tokens.filter((t) => !/^\d+$/.test(t));
  const textConditions = nonNumericTokens.map((token) => ({
    nombre: {
      contains: token,
      mode: 'insensitive' as const,
    },
  }));

  // Si hay número (ej: "17", "Escuela 17", "Escuela N° 17")
  let numberCondition = {};
  if (schoolNumber) {
    numberCondition = {
      OR: [
        {
          nombre: {
            contains: ` ${schoolNumber}`,
            mode: 'insensitive' as const,
          },
        }, // "... 17"
        {
          nombre: {
            contains: ` ${schoolNumber} `,
            mode: 'insensitive' as const,
          },
        }, // " 17 "
        {
          nombre: {
            contains: `N°${schoolNumber}`,
            mode: 'insensitive' as const,
          },
        }, // "N°17"
        {
          nombre: {
            contains: `Nº${schoolNumber}`,
            mode: 'insensitive' as const,
          },
        }, // "Nº17"
        {
          nombre: {
            contains: `N° ${schoolNumber}`,
            mode: 'insensitive' as const,
          },
        }, // "N° 17"
        {
          nombre: {
            contains: `Nº ${schoolNumber}`,
            mode: 'insensitive' as const,
          },
        }, // "Nº 17"
      ],
    };
  }

  // Si solo hay número y nada más (ej: nombre = "17")
  if (schoolNumber && nonNumericTokens.length === 0) {
    return numberCondition;
  }

  // Si hay texto + número, combinamos: todos los textos AND la condición numérica
  if (schoolNumber) {
    return {
      AND: [...textConditions, numberCondition] as any,
    };
  }

  // Caso genérico sin número: AND por tokens de texto
  return {
    AND: textConditions,
  };
}

/**
 * Normalizes free-text for fuzzy search:
 * - lowercases
 * - strips diacritics
 * - removes non-alphanumeric (keeps spaces)
 * - collapses whitespace
 */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

type FuzzyMatch<T> = {
  item: T;
  score: number;
};

/**
 * Generic fuzzy finder for legajos (empleados) usando pg_trgm + unaccent.
 * Devuelve top N ordenados por score. Fallback a contains si falla.
 */
export async function fuzzyFindLegajosByName(
  nombre: string,
  limit = 5,
): Promise<FuzzyMatch<{
  cod: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  estado: string | null;
  dni: string | null;
  email: string | null;
  fecha_ingreso: Date | null;
}>[]> {
  const term = normalizeText(nombre);
  if (!term) return [];

  try {
    const results = await prisma.$queryRawUnsafe<
      {
        cod: string;
        nombre: string;
        area: string | null;
        turno: string | null;
        estado: string | null;
        dni: string | null;
        email: string | null;
        fecha_ingreso: Date | null;
        score: number;
      }[]
    >(
      `
        SELECT 
          cod, nombre, area, turno, estado, dni, email, fecha_ingreso,
          word_similarity(public.immutable_unaccent(nombre), public.immutable_unaccent($1)) AS score
        FROM huella.legajo
        WHERE public.immutable_unaccent(nombre) % public.immutable_unaccent($1)
        ORDER BY score DESC
        LIMIT $2
      `,
      term,
      limit,
    );

    return results.map((r) => ({ item: r, score: r.score }));
  } catch (error) {
    console.error('Error in fuzzyFindLegajosByName, falling back:', error);
    const tokens = term.split(' ').filter(Boolean);
    const whereClause =
      tokens.length === 1
        ? {
            nombre: { contains: tokens[0], mode: 'insensitive' as const },
          }
        : {
            AND: tokens.map((token) => ({
              nombre: { contains: token, mode: 'insensitive' as const },
            })),
          };

    const fallback = await prisma.legajo.findMany({
      where: whereClause,
      take: limit,
      select: {
        cod: true,
        nombre: true,
        area: true,
        turno: true,
        estado: true,
        dni: true,
        email: true,
        fecha_ingreso: true,
      },
    });

    return fallback.map((item) => ({ item, score: 0.5 }));
  }
}

/**
 * Fuzzy finder para personas (rrhh.persona), usado en supervisores.
 */
export async function fuzzyFindPersonByName(
  nombre: string,
  limit = 5,
): Promise<
  FuzzyMatch<{
    id_persona: number;
    nombre: string;
    apellido: string;
    telefono: string | null;
    mail: string | null;
  }>[]
> {
  const term = normalizeText(nombre);
  if (!term) return [];

  try {
    const results = await prisma.$queryRawUnsafe<
      {
        id_persona: number;
        nombre: string;
        apellido: string;
        telefono: string | null;
        mail: string | null;
        score: number;
      }[]
    >(
      `
        SELECT 
          id_persona, nombre, apellido, telefono, mail,
          word_similarity(public.immutable_unaccent(nombre || ' ' || apellido), public.immutable_unaccent($1)) AS score
        FROM rrhh.persona
        WHERE public.immutable_unaccent(nombre || ' ' || apellido) % public.immutable_unaccent($1)
        ORDER BY score DESC
        LIMIT $2
      `,
      term,
      limit,
    );

    return results.map((r) => ({ item: r, score: r.score }));
  } catch (error) {
    console.error('Error in fuzzyFindPersonByName, falling back:', error);
    const tokens = term.split(' ').filter(Boolean);
    const fallback = await prisma.persona.findMany({
      where: {
        AND: tokens.map((token) => ({
          OR: [
            { nombre: { contains: token, mode: 'insensitive' as const } },
            { apellido: { contains: token, mode: 'insensitive' as const } },
          ],
        })),
      },
      take: limit,
    });

    return fallback.map((item) => ({ item, score: 0.5 }));
  }
}

export async function findSchoolId(
  nombre?: string,
  localidad?: string,
  cue?: string,
  departamento?: string,
): Promise<number | null> {
  if (cue) {
    const escuela = await prisma.escuela.findUnique({
      where: { cue: BigInt(cue) },
      select: { id_escuela: true },
    });
    return escuela?.id_escuela || null;
  }

  if (!nombre && !localidad && !departamento) return null;

  const cleanTerm = (term: string) => term.trim().replace(/\s+/g, ' ');
  let escuelasIds: number[] = [];

  if (nombre) {
    const searchTerm = normalizeText(cleanTerm(nombre));
    const localidadTerm = localidad ? normalizeText(cleanTerm(localidad)) : null;
    const departamentoTerm = departamento
      ? normalizeText(cleanTerm(departamento))
      : null;

    let query = `
      SELECT e.id_escuela,
             word_similarity(public.immutable_unaccent(e.nombre), public.immutable_unaccent($1)) as sim_score
      FROM institucional.escuela e
    `;

    const params: any[] = [searchTerm];
    let paramIdx = 2;

    if (localidadTerm) {
      query += `
        JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
        WHERE public.immutable_unaccent(l.nombre) ILIKE '%' || public.immutable_unaccent($${paramIdx}) || '%'
      `;
      params.push(localidadTerm);
      paramIdx++;
    } else if (departamentoTerm) {
      // If filtering by department but NOT locality
      // We need to join locality then department because escuela -> localidad -> departamento
      query += `
        JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
        JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
        WHERE public.immutable_unaccent(d.nombre) ILIKE '%' || public.immutable_unaccent($${paramIdx}) || '%'
      `;
      params.push(departamentoTerm);
      paramIdx++;
    }

    const hasWhere = localidadTerm || departamentoTerm;

    if (!hasWhere) {
      query += ` WHERE public.immutable_unaccent(e.nombre) % public.immutable_unaccent($1) `;
    } else {
      query += ` AND public.immutable_unaccent(e.nombre) % public.immutable_unaccent($1) `;
    }

    query += ` ORDER BY sim_score DESC LIMIT 1`;

    try {
      const results = await prisma.$queryRawUnsafe<
        { id_escuela: number; sim_score: number }[]
      >(query, ...params);
      if (results.length > 0) return results[0].id_escuela;
    } catch (e) {
      console.error('Error in fuzzy search helper:', e);
      // Fallback
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
          ...(departamentoTerm
            ? {
                localidad: {
                  departamento: {
                    nombre: { contains: departamentoTerm, mode: 'insensitive' },
                  },
                },
              }
            : {}),
        },
        select: { id_escuela: true },
        take: 1,
      });
      if (fallbackResults.length > 0) return fallbackResults[0].id_escuela;
    }
  } else {
    // No name provided, searching by location only
    // This usually returns a list, but findSchoolId is designed to return ONE ID (the best match).
    // If the user asks "schools in Capital", they probably want a list tool, not this helper.
    // BUT, if this helper is used by a tool that expects a single school (like "infra of school in Capital"),
    // it implies there's a name missing or implied.
    // However, if we just return the first one, it might be random.
    // Let's support it for consistency but it's weak without a name.

    const localidadTerm = localidad ? cleanTerm(localidad) : null;
    const departamentoTerm = departamento ? cleanTerm(departamento) : null;

    const results = await prisma.escuela.findMany({
      where: {
        ...(localidadTerm
          ? {
              localidad: {
                nombre: { contains: localidadTerm, mode: 'insensitive' },
              },
            }
          : {}),
        ...(departamentoTerm
          ? {
              localidad: {
                departamento: {
                  nombre: { contains: departamentoTerm, mode: 'insensitive' },
                },
              },
            }
          : {}),
      },
      select: { id_escuela: true },
      take: 1,
    });
    if (results.length > 0) return results[0].id_escuela;
  }

  return null;
}

/**
 * Devuelve una lista ordenada de IDs de escuela usando fuzzy search por nombre
 * y opcionalmente filtrando por localidad/departamento.
 */
export async function fuzzyFindSchoolIds(
  nombre?: string,
  localidad?: string,
  departamento?: string,
  limit = 20,
): Promise<number[]> {
  if (!nombre && !localidad && !departamento) return [];

  const cleanTerm = (term: string) => term.trim().replace(/\s+/g, ' ');
  const searchTerm = nombre ? normalizeText(cleanTerm(nombre)) : null;
  const localidadTerm = localidad ? normalizeText(cleanTerm(localidad)) : null;
  const departamentoTerm = departamento
    ? normalizeText(cleanTerm(departamento))
    : null;

  // When there is a name, use similarity ordering
  if (searchTerm) {
    let query = `
      SELECT e.id_escuela,
             word_similarity(public.immutable_unaccent(e.nombre), public.immutable_unaccent($1)) as sim_score
      FROM institucional.escuela e
    `;

    const params: any[] = [searchTerm];
    let paramIdx = 2;

    if (localidadTerm) {
      query += `
        JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
        WHERE public.immutable_unaccent(l.nombre) ILIKE '%' || public.immutable_unaccent($${paramIdx}) || '%'
      `;
      params.push(localidadTerm);
      paramIdx++;
    } else if (departamentoTerm) {
      query += `
        JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
        JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
        WHERE public.immutable_unaccent(d.nombre) ILIKE '%' || public.immutable_unaccent($${paramIdx}) || '%'
      `;
      params.push(departamentoTerm);
      paramIdx++;
    }

    const hasWhere = localidadTerm || departamentoTerm;
    if (!hasWhere) {
      query += ` WHERE public.immutable_unaccent(e.nombre) % public.immutable_unaccent($1) `;
    } else {
      query += ` AND public.immutable_unaccent(e.nombre) % public.immutable_unaccent($1) `;
    }

    query += ` ORDER BY sim_score DESC LIMIT ${limit}`;

    try {
      const results = await prisma.$queryRawUnsafe<
        { id_escuela: number; sim_score: number }[]
      >(query, ...params);
      return results.map((r) => r.id_escuela);
    } catch (error) {
      console.error('Error in fuzzyFindSchoolIds, falling back:', error);
    }
  }

  // Fallback: location-only or query failed
  const fallback = await prisma.escuela.findMany({
    where: {
      ...(searchTerm
        ? { nombre: { contains: searchTerm, mode: 'insensitive' as const } }
        : {}),
      ...(localidadTerm
        ? {
            localidad: {
              nombre: { contains: localidadTerm, mode: 'insensitive' as const },
            },
          }
        : {}),
      ...(departamentoTerm
        ? {
            localidad: {
              departamento: {
                nombre: {
                  contains: departamentoTerm,
                  mode: 'insensitive' as const,
                },
              },
            },
          }
        : {}),
    },
    select: { id_escuela: true },
    take: limit,
  });

  return fallback.map((r) => r.id_escuela);
}

/**
 * Devuelve el nombre normalizado de un departamento que coincida difusamente
 * con el término provisto. Útil para resolver "Capital", "Paso de los Libres", etc.
 */
export async function findBestDepartmentName(
  departamento: string,
): Promise<string | null> {
  const term = normalizeText(departamento);
  if (!term) return null;

  try {
    const results = await prisma.$queryRawUnsafe<
      { nombre: string; score: number }[]
    >(
      `
        SELECT nombre,
               word_similarity(public.immutable_unaccent(nombre), public.immutable_unaccent($1)) AS score
        FROM geografia.departamento
        WHERE public.immutable_unaccent(nombre) % public.immutable_unaccent($1)
        ORDER BY score DESC
        LIMIT 1
      `,
      term,
    );
    if (results.length > 0) {
      return results[0].nombre;
    }
  } catch (error) {
    console.error('Error in findBestDepartmentName:', error);
  }

  const fallback = await prisma.departamento.findFirst({
    where: { nombre: { contains: term, mode: 'insensitive' as const } },
    select: { nombre: true },
  });
  return fallback?.nombre || null;
}
