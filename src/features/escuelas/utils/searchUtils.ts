import type { School } from '@/shared/interfaces';
import { normalizeText } from '@/shared/lib/utils';
export interface SearchIndex {
  nombreIndex: Map<string, number[]>;
  directorIndex: Map<string, number[]>;
  cueIndex: Map<string, number[]>;
  localidadIndex: Map<string, number[]>;
}

export function createSearchIndex(escuelas: School[]): SearchIndex {
  const nombreIndex = new Map<string, number[]>();
  const directorIndex = new Map<string, number[]>();
  const cueIndex = new Map<string, number[]>();
  const localidadIndex = new Map<string, number[]>();

  escuelas.forEach((escuela, idx) => {
    if (escuela.nombre) {
      const nameWords = normalizeText(escuela.nombre).split(/\s+/);
      indexWords(nameWords, nombreIndex, idx);

      const nombreCompleto = normalizeText(escuela.nombre);
      if (!nombreIndex.has(nombreCompleto)) {
        nombreIndex.set(nombreCompleto, []);
      }
      nombreIndex.get(nombreCompleto)?.push(idx);
    }

    if (escuela.director) {
      const directorWords = normalizeText(escuela.director).split(/\s+/);
      indexWords(directorWords, directorIndex, idx);
    }

    if (escuela.cue) {
      const cueStr = String(escuela.cue);
      if (!cueIndex.has(cueStr)) {
        cueIndex.set(cueStr, []);
      }
      cueIndex.get(cueStr)?.push(idx);
    }

    if (escuela.localidad) {
      const localityWords = normalizeText(escuela.localidad).split(/\s+/);
      indexWords(localityWords, localidadIndex, idx);
    }
  });

  return {
    nombreIndex,
    directorIndex,
    cueIndex,
    localidadIndex,
  };
}

function indexWords(
  words: string[],
  index: Map<string, number[]>,
  idx: number,
) {
  words.forEach((word) => {
    if (word.length > 2) {
      if (!index.has(word)) {
        index.set(word, []);
      }
      index.get(word)?.push(idx);
    }
  });
}

export interface FiltroOptions {
  supervisor?: string;
  limit?: number;
}

export function filterSchools(
  escuelas: School[],
  term: string,
  options: FiltroOptions = {},
): School[] {
  let filteredSchools = [...escuelas];

  if (options.supervisor) {
    filteredSchools = filteredSchools.filter(
      (escuela) => String(escuela.supervisorID) === options.supervisor,
    );
  }

  if (!term || term.trim() === '') {
    const limit = options.limit || filteredSchools.length;
    return filteredSchools.slice(0, limit);
  }

  const tempIndex = createSearchIndex(filteredSchools);

  const normalizedTerm = normalizeText(term);

  const scorees = new Map<number, number>();

  const esPosibleCUE = /^\d+$/.test(normalizedTerm);

  filteredSchools.forEach((escuela, idx) => {
    let score = 0;

    if (escuela.nombre && normalizeText(escuela.nombre) === normalizedTerm) {
      score += 5000;
    }

    if (esPosibleCUE && escuela.cue && String(escuela.cue) === normalizedTerm) {
      score += 4000;
    }

    if (
      escuela.nombre &&
      normalizeText(escuela.nombre).includes(normalizedTerm)
    ) {
      score += 3000;
    }

    if (
      escuela.director &&
      normalizeText(escuela.director).includes(normalizedTerm)
    ) {
      score += 2000;
    }

    if (
      escuela.localidad &&
      normalizeText(escuela.localidad).includes(normalizedTerm)
    ) {
      score += 1500;
    }

    if (score > 0) {
      scorees.set(idx, score);
    }
  });

  if (scorees.size === 0) {
    const searchTerms = normalizedTerm
      .split(/\s+/)
      .filter((term) => term.length > 2);

    filteredSchools.forEach((escuela, idx) => {
      let score = 0;
      let foundTerms = 0;

      const meetsAllTerms = searchTerms.every((term) => {
        const estaEnNombre = escuela.nombre
          ? normalizeText(escuela.nombre).includes(term)
          : false;
        const estaEnDirector = escuela.director
          ? normalizeText(escuela.director).includes(term)
          : false;
        const estaEnCUE = escuela.cue
          ? String(escuela.cue).includes(term)
          : false;
        const estaEnLocalidad = escuela.localidad
          ? normalizeText(escuela.localidad).includes(term)
          : false;

        return estaEnNombre || estaEnDirector || estaEnCUE || estaEnLocalidad;
      });

      if (meetsAllTerms) {
        score += 500;
      }

      searchTerms.forEach((term) => {
        if (escuela.nombre && normalizeText(escuela.nombre).includes(term)) {
          score += 50;
          foundTerms++;
        }

        if (
          escuela.director &&
          normalizeText(escuela.director).includes(term)
        ) {
          score += 30;
          foundTerms++;
        }

        if (escuela.cue && String(escuela.cue).includes(term)) {
          score += 40;
          foundTerms++;
        }

        if (
          escuela.localidad &&
          normalizeText(escuela.localidad).includes(term)
        ) {
          score += 25;
          foundTerms++;
        }
      });

      if (searchTerms.length > 0) {
        const porcentajeEncontrado = foundTerms / (searchTerms.length * 4);
        score += Math.round(porcentajeEncontrado * 100);
      }

      if (score > 0) {
        scorees.set(idx, score);
      }
    });
  }

  const limit = options.limit || 20;

  return Array.from(scorees.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([idx]) => filteredSchools[idx])
    .slice(0, limit);
}

export function searchSchools(
  escuelas: School[],
  term: string,
  supervisor = '',
): School[] {
  return filterSchools(escuelas, term, {
    supervisor,
    limit: 20,
  });
}

export function highlightTerms(texto: string, term: string): string {
  if (!texto || !term) return texto;

  const normalizedTerm = normalizeText(term);
  const terminosSeparados = normalizedTerm
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terminosSeparados.length === 0) return texto;

  const regexPartes = terminosSeparados.map((t) => {
    const termEscapado = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return termEscapado;
  });

  let resultado = texto;

  regexPartes.forEach((termRegex) => {
    const regex = new RegExp(`(${termRegex})`, 'gi');
    resultado = resultado.replace(regex, '<mark>$1</mark>');
  });

  return resultado;
}

export function searchSchoolsAdvanced(
  escuelas: School[],
  term: string,
  limit: number = 20,
): School[] {
  if (!term || term.trim() === '') {
    return [];
  }

  const normalizedTerm = normalizeText(term);

  const resultadosConPuntuacion: Array<{
    escuela: School;
    score: number;
  }> = [];

  const numeroEscuelaMatch = normalizedTerm.match(
    /escuela\s*(?:n[°º.]?)?\s*(\d+)/i,
  );
  const numeroEscuela = numeroEscuelaMatch ? numeroEscuelaMatch[1] : null;

  escuelas.forEach((escuela) => {
    let score = 0;
    const nombreNormalizado = normalizeText(escuela.nombre);
    const directorNormalizado = normalizeText(escuela.director);
    const cueString = escuela.cue.toString();
    const departamentoNormalizado = normalizeText(escuela.departamento);
    const localidadNormalizada = normalizeText(escuela.localidad);
    const tipoEscuelaNormalizado = normalizeText(escuela.tipoEscuela);

    if (numeroEscuela) {
      const escuelaNumeroMatch = nombreNormalizado.match(
        /escuela\s*(?:n[°º.]?)?\s*(\d+)/i,
      );
      if (escuelaNumeroMatch && escuelaNumeroMatch[1] === numeroEscuela) {
        score += 5000; // Coincidencia exacta de número de escuela
      }

      // Buscar números en otras formas (por ejemplo "N° 17" sin la palabra "escuela")
      else if (
        nombreNormalizado.match(
          new RegExp(`\\bn[°º.]?\\s*${numeroEscuela}\\b`, 'i'),
        )
      ) {
        score += 4500; // Coincidencia de N° XX
      }

      // Buscar solo el número si está como palabra independiente
      else if (
        nombreNormalizado.match(new RegExp(`\\b${numeroEscuela}\\b`, 'i'))
      ) {
        score += 3000; // Coincidencia solo del número
      }
    }

    // Buscar el término completo
    if (
      normalizedTerm !== 'escuela' &&
      normalizedTerm !== 'n' &&
      normalizedTerm.length > 2
    ) {
      if (nombreNormalizado === normalizedTerm) {
        score += 1000;
      }
      // Nombre comienza con el término de búsqueda
      else if (nombreNormalizado.startsWith(normalizedTerm)) {
        score += 500;
      }
      // Nombre contiene el término de búsqueda como palabra completa
      else if (
        nombreNormalizado.includes(` ${normalizedTerm} `) ||
        nombreNormalizado.includes(`${normalizedTerm} `) ||
        nombreNormalizado.includes(` ${normalizedTerm}`)
      ) {
        score += 300;
      }
      // Nombre contiene el término de búsqueda como parte
      else if (nombreNormalizado.includes(normalizedTerm)) {
        score += 200;
      }

      // Coincidencia en otros campos
      if (directorNormalizado.includes(normalizedTerm)) {
        score += 100;
      } else {
        // Si el término tiene dos palabras, buscar también el orden invertido
        const partes = normalizedTerm.split(' ');
        if (partes.length === 2) {
          const invertido = `${partes[1]} ${partes[0]}`;
          if (directorNormalizado.includes(invertido)) {
            score += 100;
          }
        }
      }

      if (cueString === normalizedTerm) {
        score += 800; // Coincidencia exacta de CUE
      } else if (cueString.includes(normalizedTerm)) {
        score += 150; // Coincidencia parcial de CUE
      }

      if (departamentoNormalizado === normalizedTerm) {
        score += 100;
      } else if (departamentoNormalizado.includes(normalizedTerm)) {
        score += 50;
      }

      if (localidadNormalizada === normalizedTerm) {
        score += 100;
      } else if (localidadNormalizada.includes(normalizedTerm)) {
        score += 50;
      }

      if (tipoEscuelaNormalizado === normalizedTerm) {
        score += 100;
      } else if (
        tipoEscuelaNormalizado &&
        tipoEscuelaNormalizado.includes(normalizedTerm)
      ) {
        score += 50;
      }
    }

    if (score > 0) {
      resultadosConPuntuacion.push({ escuela, score });
    }
  });

  // Ordenar por puntuación y obtener solo las escuelas
  return resultadosConPuntuacion
    .sort((a, b) => b.score - a.score)
    .map((item) => item.escuela)
    .slice(0, limit);
}
