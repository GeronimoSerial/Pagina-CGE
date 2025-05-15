import type { Escuela } from "@src/interfaces"

// Tipo para representar el índice de búsqueda
export interface SearchIndex {
  nombreIndex: Map<string, number[]>;
  directorIndex: Map<string, number[]>;
  cueIndex: Map<string, number[]>;
}

/**
 * Crea un índice de búsqueda a partir de los datos de escuelas
 * Este índice se crea una sola vez y se reutiliza para todas las búsquedas
 */
export function createSearchIndex(escuelas: Escuela[]): SearchIndex {
  // Creamos los mapas de índice
  const nombreIndex = new Map<string, number[]>();
  const directorIndex = new Map<string, number[]>();
  const cueIndex = new Map<string, number[]>();
  
  // Indexamos cada escuela
  escuelas.forEach((escuela, idx) => {
    // Dividimos el nombre en palabras y las normalizamos
    if (escuela.nombre) {
      const palabrasNombre = normalizeText(escuela.nombre).split(/\s+/);
      palabrasNombre.forEach(palabra => {
        if (palabra.length > 2) { // Ignoramos palabras muy cortas
          if (!nombreIndex.has(palabra)) {
            nombreIndex.set(palabra, []);
          }
          nombreIndex.get(palabra)?.push(idx);
        }
      });
    }
    
    // Dividimos el nombre del director en palabras y las normalizamos
    if (escuela.director) {
      const palabrasDirector = normalizeText(escuela.director).split(/\s+/);
      palabrasDirector.forEach(palabra => {
        if (palabra.length > 2) { // Ignoramos palabras muy cortas
          if (!directorIndex.has(palabra)) {
            directorIndex.set(palabra, []);
          }
          directorIndex.get(palabra)?.push(idx);
        }
      });
    }
    
    // Indexamos el CUE como string
    if (escuela.cue) {
      const cueStr = String(escuela.cue);
      if (!cueIndex.has(cueStr)) {
        cueIndex.set(cueStr, []);
      }
      cueIndex.get(cueStr)?.push(idx);
    }
  });
  
  return { nombreIndex, directorIndex, cueIndex };
}

/**
 * Normaliza un texto para búsqueda: convierte a minúsculas, quita acentos y otros caracteres especiales
 */
function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^\w\s]/g, " ") // Reemplazar caracteres especiales con espacios
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim();
}

/**
 * Busca escuelas en el índice por el término de búsqueda
 */
export function searchEscuelas(
  escuelas: Escuela[],
  searchIndex: SearchIndex,
  searchTerm: string
): Escuela[] {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }
  
  // Normalizar el término de búsqueda
  const normalizedTerm = normalizeText(searchTerm);
  const searchTerms = normalizedTerm.split(/\s+/);
  
  // Conjunto para evitar duplicados
  const resultIndices = new Set<number>();
  
  // Verificar si el término es un número (posible CUE)
  const isNumeric = /^\d+$/.test(normalizedTerm);
  
  // Buscar en el índice de CUE si es un número
  if (isNumeric) {
    // Corrección: en lugar de usar entries(), iteramos con Array.from
    Array.from(searchIndex.cueIndex.keys()).forEach((cue) => {
      if (cue.includes(normalizedTerm)) {
        const indices = searchIndex.cueIndex.get(cue);
        if (indices) {
          indices.forEach((idx: number) => resultIndices.add(idx));
        }
      }
    });
  }
  
  // Buscar cada término en los índices de nombre y director
  searchTerms.forEach(term => {
    if (term.length > 2) { // Solo buscar términos relevantes
      // Buscar en el índice de nombres
      // Corrección: en lugar de usar entries(), iteramos con Array.from
      Array.from(searchIndex.nombreIndex.keys()).forEach((palabra) => {
        if (palabra.includes(term)) {
          const indices = searchIndex.nombreIndex.get(palabra);
          if (indices) {
            indices.forEach((idx: number) => resultIndices.add(idx));
          }
        }
      });
      
      // Buscar en el índice de directores
      // Corrección: en lugar de usar entries(), iteramos con Array.from
      Array.from(searchIndex.directorIndex.keys()).forEach((palabra) => {
        if (palabra.includes(term)) {
          const indices = searchIndex.directorIndex.get(palabra);
          if (indices) {
            indices.forEach((idx: number) => resultIndices.add(idx));
          }
        }
      });
    }
  });
  
  // Convertir los índices en escuelas
  return Array.from(resultIndices).map(idx => escuelas[idx]);
} 