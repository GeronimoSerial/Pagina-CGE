import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeText(text: unknown): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatDate(dateStr: string | Date) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function normalizeArticle(item: any) {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title || item.titulo,
    titulo: item.titulo,
    description: item.description || item.resumen,
    resumen: item.resumen,
    date: item.fecha
      ? new Date(item.fecha).toISOString()
      : new Date().toISOString(),
    imageUrl: item.imageUrl || item.imagen,
    imagen: item.imagen,
    categoria: item.categoria || item.subcategoria,
    content: item.content,
    esImportante: item.esImportante || false,
    imagenes_carrusel: item.imagenes_carrusel || [],
  };
}

export function filterArticles(
  article: any[],
  searchTerm: string,
  selectedCategory: string,
) {
  return article.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.categoria === selectedCategory;

    if (!searchTerm) {
      return matchesCategory;
    }

    const searchTermNormalized = normalizeText(searchTerm);
    const titleNormalized = normalizeText(item.title || item.titulo);
    const descriptionNormalized = normalizeText(
      item.description || item.resumen,
    );
    const contentToSearch = titleNormalized + ' ' + descriptionNormalized;

    const searchWords = searchTermNormalized
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const matchesSearch = searchWords.every((word) =>
      contentToSearch.includes(word),
    );

    return matchesCategory && matchesSearch;
  });
}

export const sortByDate = <T extends { date: string }>(
  items: T[],
  ascending: boolean = false,
): T[] => {
  const parseDate = (dateStr: string) => {
    let date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      const parts = dateStr.split(/[/-]/);
      if (parts.length === 3) {
        date = new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0]),
        );
      }
    }
    return date;
  };

  return [...items].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    if (isNaN(dateA.getTime())) return ascending ? -1 : 1;
    if (isNaN(dateB.getTime())) return ascending ? 1 : -1;

    return ascending
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

export const sortByAlphabetical = <T extends { titulo: string }>(
  items: T[],
  ascending: boolean = false,
): T[] => {
  const parseTitle = (title: string) => {
    const match = title.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : title.toLowerCase();
  };

  return [...items].sort((a, b) => {
    const titleA = parseTitle(a.titulo);
    const titleB = parseTitle(b.titulo);

    if (typeof titleA === 'number' && typeof titleB === 'number') {
      return ascending ? titleA - titleB : titleB - titleA;
    }

    if (typeof titleA === 'number') return ascending ? -1 : 1;
    if (typeof titleB === 'number') return ascending ? 1 : -1;

    return ascending
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });
};

export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export const filterDocuments = (
  documents: any[],
  searchTerm: string,
  filter: string = 'all',
) => {
  return documents.filter((doc) => {
    const matchesFilter = filter === 'all' || doc.category === filter;

    if (!searchTerm) {
      return matchesFilter;
    }

    const searchTermNormalized = normalizeText(searchTerm);
    const titleNormalized = normalizeText(doc.title);
    const descriptionNormalized = normalizeText(doc.description);
    const contentToSearch = titleNormalized + ' ' + descriptionNormalized;

    const searchWords = searchTermNormalized
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const matchesSearch = searchWords.every((word) =>
      contentToSearch.includes(word),
    );

    return matchesSearch && matchesFilter;
  });
};
