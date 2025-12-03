import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Zona horaria de Argentina
const TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Obtiene la fecha/hora actual en zona horaria de Argentina
 */
export function getArgentinaDate(): Date {
  // Crear fecha en UTC y convertir a Argentina
  const now = new Date();
  const argentinaTime = new Date(
    now.toLocaleString('en-US', { timeZone: TIMEZONE }),
  );
  return argentinaTime;
}

// @dashboard/lib/utils.ts

// 1. Obtener HOY como string fijo (sin horas/milisegundos)
export function getArgentinaDateString(): string {
  return new Date().toLocaleDateString('en-CA', {
    // 'en-CA' siempre devuelve YYYY-MM-DD
    timeZone: TIMEZONE,
  });
}

// 2. Obtener hace 30 días basado en el string
export function getThirtyDaysAgoString(dateString: string): string {
  const date = new Date(dateString); // Al ser YYYY-MM-DD, se crea a las 00:00:00 UTC
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

// 3. Obtener primer día del mes
export function getFirstOfMonthString(dateString: string): string {
  const date = new Date(dateString);
  // Simplemente forzamos el día 01
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .split('T')[0];
}

/**
 * Formatea una fecha a string YYYY-MM-DD en zona horaria Argentina
 */
export function formatDateArg(date: Date = getArgentinaDate()): string {
  return date.toLocaleDateString('sv-SE', { timeZone: TIMEZONE }); // sv-SE da formato YYYY-MM-DD
}

/**
 * Obtiene el año actual en Argentina
 */
export function getArgentinaYear(): number {
  return getArgentinaDate().getFullYear();
}

/**
 * Obtiene el mes actual en Argentina (0-11)
 */
export function getArgentinaMonth(): number {
  return getArgentinaDate().getMonth();
}

/**
 * Obtiene el primer día del mes actual en Argentina
 */
export function getFirstOfMonthArg(): Date {
  const now = getArgentinaDate();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Formatea fecha/hora para mostrar en UI (zona Argentina)
 */
export function formatDateTimeArg(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-AR', { timeZone: TIMEZONE });
}

/**
 * Traduce nombres de días en inglés a español
 */
export function translateDayName(dayName: string | null | undefined): string {
  if (!dayName) return '-';

  const dayMap: Record<string, string> = {
    // Inglés
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    // Español (por si ya viene en español)
    lunes: 'Lunes',
    martes: 'Martes',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sábado: 'Sábado',
    domingo: 'Domingo',
  };

  const normalized = dayName.toLowerCase().trim();
  return dayMap[normalized] || dayName;
}

/**
 * Traduce nombres de meses en inglés a español
 */
/**
 * Parsea una fecha YYYY-MM-DD sin problemas de timezone.
 * new Date("2025-11-17") se interpreta como UTC medianoche, lo que en Argentina
 * (UTC-3) se convierte al día anterior. Esta función evita ese problema.
 */
export function parseDateString(dateStr: string): Date {
  // Agregar T12:00:00 para evitar el bug de timezone
  return new Date(dateStr + 'T12:00:00');
}

export function translateMonthName(
  monthName: string | null | undefined,
): string {
  if (!monthName) return '-';

  const monthMap: Record<string, string> = {
    // Inglés
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
    // Español (por si ya viene en español)
    enero: 'Enero',
    febrero: 'Febrero',
    marzo: 'Marzo',
    abril: 'Abril',
    mayo: 'Mayo',
    junio: 'Junio',
    julio: 'Julio',
    agosto: 'Agosto',
    septiembre: 'Septiembre',
    octubre: 'Octubre',
    noviembre: 'Noviembre',
    diciembre: 'Diciembre',
  };

  const normalized = monthName.toLowerCase().trim();
  return monthMap[normalized] || monthName;
}
