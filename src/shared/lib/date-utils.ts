/**
 * Utilidades para formateo de fechas usando Intl.DateTimeFormat nativo
 * Reemplaza date-fns para reducir el bundle size
 */

export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('es-ES', {
    ...defaultOptions,
    ...options,
  }).format(dateObj);
};

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateNumeric = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateWithTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Función para añadir días a una fecha (reemplaza addDays de date-fns)
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Formato para date picker (reemplaza el formato 'LLL dd, y' de date-fns)
export const formatDatePicker = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};
