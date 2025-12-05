/**
 * Search utilities for building flexible Prisma queries
 * Supports token-based search for names and special handling for school numbers
 */

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
  const hasNumber = tokens.some((t) => /^\d+$/.test(t));

  // Single token
  if (tokens.length === 1) {
    const token = tokens[0];

    // If it's just a number, search for various formats
    if (/^\d+$/.test(token)) {
      return {
        OR: [
          { nombre: { contains: ` ${token}`, mode: 'insensitive' as const } },
          { nombre: { contains: `N° ${token}`, mode: 'insensitive' as const } },
          { nombre: { contains: `Nº ${token}`, mode: 'insensitive' as const } },
          { nombre: { contains: `N°${token}`, mode: 'insensitive' as const } },
          { nombre: { contains: `Nº${token}`, mode: 'insensitive' as const } },
        ],
      };
    }

    return {
      nombre: {
        contains: token,
        mode: 'insensitive' as const,
      },
    };
  }

  // Multiple tokens with number handling
  if (hasNumber) {
    const nonNumericTokens = tokens.filter((t) => !/^\d+$/.test(t));
    const numericToken = tokens.find((t) => /^\d+$/.test(t));

    const conditions = nonNumericTokens.map((token) => ({
      nombre: {
        contains: token,
        mode: 'insensitive' as const,
      },
    }));

    // Add number search with OR for various formats
    if (numericToken) {
      conditions.push({
        OR: [
          {
            nombre: { contains: ` ${numericToken}`, mode: 'insensitive' },
          },
          {
            nombre: { contains: `N° ${numericToken}`, mode: 'insensitive' },
          },
          {
            nombre: { contains: `Nº ${numericToken}`, mode: 'insensitive' },
          },
        ],
      } as PrismaWhereClause);
    }

    return { AND: conditions };
  }

  // Multiple tokens without numbers
  return {
    AND: tokens.map((token) => ({
      nombre: {
        contains: token,
        mode: 'insensitive' as const,
      },
    })),
  };
}
