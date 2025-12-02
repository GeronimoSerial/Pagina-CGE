/**
 * Formatea Date a string ISO (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[0];
}

/**
 * Formatea Date a string de tiempo (HH:MM:SS)
 */
export function formatTimeToString(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[1].substring(0, 8);
}

/**
 * Formatea timestamp completo a string
 */
export function formatTimestampToString(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Convierte string de fecha a Date para queries de Prisma
 */
export function parseStringToDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00.000Z');
}

/**
 * Convierte BigInt a number (con cuidado de overflow)
 */
export function bigIntToNumber(value: bigint | null): number {
  if (value === null) return 0;
  return Number(value);
}