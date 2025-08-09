// YYYY-MM-DD
const createLocalDate = (dateString: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateString);
};

export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = typeof date === 'string' ? createLocalDate(date) : date;

  if (isNaN(dateObj.getTime())) {
    console.warn('Fecha inválida proporcionada:', date);
    return 'Fecha inválida';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires', 
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
    timeZone: 'America/Argentina/Buenos_Aires',
  });
};

export const formatDateNumeric = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  });
};

export const formatDateWithTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Verificar que la fecha sea válida
  if (isNaN(dateObj.getTime())) {
    console.warn('Fecha inválida proporcionada:', date);
    return 'Fecha inválida';
  }

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(dateObj);
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDatePicker = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(date);
};
