//Buscador de Escuelas Avanzado con implementacion de sistema de puntos, a modo de prueba no final.
import type { Escuela } from "@src/interfaces";
import {
  normalizarTexto
} from "@/src/lib/utils";
export interface SearchIndex {
  nombreIndex: Map<string, number[]>;
  directorIndex: Map<string, number[]>;
  cueIndex: Map<string, number[]>;
  localidadIndex: Map<string, number[]>;
}


export function createSearchIndex(escuelas: Escuela[]): SearchIndex {
  const nombreIndex = new Map<string, number[]>();
  const directorIndex = new Map<string, number[]>();
  const cueIndex = new Map<string, number[]>();
  const localidadIndex = new Map<string, number[]>();

  escuelas.forEach((escuela, idx) => {
    if (escuela.nombre) {
      const palabrasNombre = normalizarTexto(escuela.nombre).split(/\s+/);
      indexarPalabras(palabrasNombre, nombreIndex, idx);

      const nombreCompleto = normalizarTexto(escuela.nombre);
      if (!nombreIndex.has(nombreCompleto)) {
        nombreIndex.set(nombreCompleto, []);
      }
      nombreIndex.get(nombreCompleto)?.push(idx);
    }

    if (escuela.director) {
      const palabrasDirector = normalizarTexto(escuela.director).split(/\s+/);
      indexarPalabras(palabrasDirector, directorIndex, idx);
    }

    if (escuela.cue) {
      const cueStr = String(escuela.cue);
      if (!cueIndex.has(cueStr)) {
        cueIndex.set(cueStr, []);
      }
      cueIndex.get(cueStr)?.push(idx);
    }

    if (escuela.localidad) {
      const palabrasLocalidad = normalizarTexto(escuela.localidad).split(/\s+/);
      indexarPalabras(palabrasLocalidad, localidadIndex, idx);
    }
  });

  return {
    nombreIndex,
    directorIndex,
    cueIndex,
    localidadIndex,
  };
}

function indexarPalabras(
  palabras: string[],
  indice: Map<string, number[]>,
  idx: number
) {
  palabras.forEach((palabra) => {
    if (palabra.length > 2) {
      if (!indice.has(palabra)) {
        indice.set(palabra, []);
      }
      indice.get(palabra)?.push(idx);
    }
  });
}

export interface FiltroOptions {
  supervisor?: string;
  limite?: number;
}

export function filtrarEscuelas(
  escuelas: Escuela[],
  termino: string,
  opciones: FiltroOptions = {}
): Escuela[] {
  let escuelasFiltradas = [...escuelas];

  if (opciones.supervisor) {
    escuelasFiltradas = escuelasFiltradas.filter(
      (escuela) => String(escuela.supervisorID) === opciones.supervisor
    );
  }

  if (!termino || termino.trim() === "") {
    const limite = opciones.limite || escuelasFiltradas.length;
    return escuelasFiltradas.slice(0, limite);
  }

  const indiceTemp = createSearchIndex(escuelasFiltradas);

  const terminoNormalizado = normalizarTexto(termino);

  const puntuaciones = new Map<number, number>();

  const esPosibleCUE = /^\d+$/.test(terminoNormalizado);

  escuelasFiltradas.forEach((escuela, idx) => {
    let puntuacion = 0;

    // Coincidencia exacta del nombre completo (máxima prioridad)
    if (
      escuela.nombre &&
      normalizarTexto(escuela.nombre) === terminoNormalizado
    ) {
      puntuacion += 5000;
    }

    // Coincidencia exacta de CUE (alta prioridad)
    if (
      esPosibleCUE &&
      escuela.cue &&
      String(escuela.cue) === terminoNormalizado
    ) {
      puntuacion += 4000;
    }

    // El nombre contiene el término completo (alta prioridad)
    if (
      escuela.nombre &&
      normalizarTexto(escuela.nombre).includes(terminoNormalizado)
    ) {
      puntuacion += 3000;
    }

    // El director contiene el término completo
    if (
      escuela.director &&
      normalizarTexto(escuela.director).includes(terminoNormalizado)
    ) {
      puntuacion += 2000;
    }

    // La localidad contiene el término completo
    if (
      escuela.localidad &&
      normalizarTexto(escuela.localidad).includes(terminoNormalizado)
    ) {
      puntuacion += 1500;
    }

    // Si hay puntuación, la guardamos
    if (puntuacion > 0) {
      puntuaciones.set(idx, puntuacion);
    }
  });

  // Si encontramos coincidencias exactas, no hacemos búsqueda por términos individuales
  if (puntuaciones.size === 0) {
    // Dividir el término en palabras individuales para búsqueda
    const terminosBusqueda = terminoNormalizado
      .split(/\s+/)
      .filter((term) => term.length > 2);

    escuelasFiltradas.forEach((escuela, idx) => {
      let puntuacion = 0;
      let terminosEncontrados = 0;

      // Verificar si todos los términos están presentes en algún campo
      const cumpleTodosLosTerminos = terminosBusqueda.every((termino) => {
        const estaEnNombre = escuela.nombre
          ? normalizarTexto(escuela.nombre).includes(termino)
          : false;
        const estaEnDirector = escuela.director
          ? normalizarTexto(escuela.director).includes(termino)
          : false;
        const estaEnCUE = escuela.cue
          ? String(escuela.cue).includes(termino)
          : false;
        const estaEnLocalidad = escuela.localidad
          ? normalizarTexto(escuela.localidad).includes(termino)
          : false;

        return estaEnNombre || estaEnDirector || estaEnCUE || estaEnLocalidad;
      });

      if (cumpleTodosLosTerminos) {
        puntuacion += 500;
      }

      // Asignar puntos por cada término encontrado en cada campo
      terminosBusqueda.forEach((termino) => {
        // Buscar en nombre (campo más importante)
        if (
          escuela.nombre &&
          normalizarTexto(escuela.nombre).includes(termino)
        ) {
          puntuacion += 50;
          terminosEncontrados++;
        }

        // Buscar en director
        if (
          escuela.director &&
          normalizarTexto(escuela.director).includes(termino)
        ) {
          puntuacion += 30;
          terminosEncontrados++;
        }

        // Buscar en CUE
        if (escuela.cue && String(escuela.cue).includes(termino)) {
          puntuacion += 40;
          terminosEncontrados++;
        }

        // Buscar en localidad
        if (
          escuela.localidad &&
          normalizarTexto(escuela.localidad).includes(termino)
        ) {
          puntuacion += 25;
          terminosEncontrados++;
        }
      });

      // Bonificación por porcentaje de términos encontrados
      if (terminosBusqueda.length > 0) {
        const porcentajeEncontrado =
          terminosEncontrados / (terminosBusqueda.length * 4); // 4 campos
        puntuacion += Math.round(porcentajeEncontrado * 100);
      }

      // Si hay puntuación, la guardamos
      if (puntuacion > 0) {
        puntuaciones.set(idx, puntuacion);
      }
    });
  }

  // Convertir los resultados y ordenar por puntuación
  const limite = opciones.limite || 20; // Default a 20 resultados si no se especifica

  return Array.from(puntuaciones.entries())
    .sort((a, b) => b[1] - a[1]) // Ordenar por puntuación descendente
    .map(([idx]) => escuelasFiltradas[idx])
    .slice(0, limite);
}

export function buscarEscuelas(
  escuelas: Escuela[],
  termino: string,
  supervisor = ""
): Escuela[] {
  return filtrarEscuelas(escuelas, termino, {
    supervisor,
    limite: 20,
  });
}

export function destacarTerminos(texto: string, termino: string): string {
  if (!texto || !termino) return texto;

  const terminoNormalizado = normalizarTexto(termino);
  const terminosSeparados = terminoNormalizado
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terminosSeparados.length === 0) return texto;

  const regexPartes = terminosSeparados.map((t) => {
    const termEscapado = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return termEscapado;
  });

  let resultado = texto;

  regexPartes.forEach((termRegex) => {
    const regex = new RegExp(`(${termRegex})`, "gi");
    resultado = resultado.replace(regex, "<mark>$1</mark>");
  });

  return resultado;
}

export function buscarEscuelasAvanzado(
  escuelas: Escuela[],
  termino: string,
  limite: number = 20
): Escuela[] {
  if (!termino || termino.trim() === "") {
    return [];
  }

  const terminoNormalizado = normalizarTexto(termino);

  const resultadosConPuntuacion: Array<{
    escuela: Escuela;
    puntuacion: number;
  }> = [];

  const numeroEscuelaMatch = terminoNormalizado.match(
    /escuela\s*(?:n[°º.]?)?\s*(\d+)/i
  );
  const numeroEscuela = numeroEscuelaMatch ? numeroEscuelaMatch[1] : null;

  escuelas.forEach((escuela) => {
    let puntuacion = 0;
    const nombreNormalizado = normalizarTexto(escuela.nombre);
    const directorNormalizado = normalizarTexto(escuela.director);
    const cueString = escuela.cue.toString();
    const departamentoNormalizado = normalizarTexto(escuela.departamento);
    const localidadNormalizada = normalizarTexto(escuela.localidad);
    const tipoEscuelaNormalizado = normalizarTexto(escuela.tipoEscuela);

    if (numeroEscuela) {
      // Intentar extraer el número de la escuela del nombre
      const escuelaNumeroMatch = nombreNormalizado.match(
        /escuela\s*(?:n[°º.]?)?\s*(\d+)/i
      );
      if (escuelaNumeroMatch && escuelaNumeroMatch[1] === numeroEscuela) {
        puntuacion += 5000; // Coincidencia exacta de número de escuela
      }

      // Buscar números en otras formas (por ejemplo "N° 17" sin la palabra "escuela")
      else if (
        nombreNormalizado.match(
          new RegExp(`\\bn[°º.]?\\s*${numeroEscuela}\\b`, "i")
        )
      ) {
        puntuacion += 4500; // Coincidencia de N° XX
      }

      // Buscar solo el número si está como palabra independiente
      else if (
        nombreNormalizado.match(new RegExp(`\\b${numeroEscuela}\\b`, "i"))
      ) {
        puntuacion += 3000; // Coincidencia solo del número
      }
    }

    // Buscar el término completo
    if (
      terminoNormalizado !== "escuela" &&
      terminoNormalizado !== "n" &&
      terminoNormalizado.length > 2
    ) {
      if (nombreNormalizado === terminoNormalizado) {
        puntuacion += 1000;
      }
      // Nombre comienza con el término de búsqueda
      else if (nombreNormalizado.startsWith(terminoNormalizado)) {
        puntuacion += 500;
      }
      // Nombre contiene el término de búsqueda como palabra completa
      else if (
        nombreNormalizado.includes(` ${terminoNormalizado} `) ||
        nombreNormalizado.includes(`${terminoNormalizado} `) ||
        nombreNormalizado.includes(` ${terminoNormalizado}`)
      ) {
        puntuacion += 300;
      }
      // Nombre contiene el término de búsqueda como parte
      else if (nombreNormalizado.includes(terminoNormalizado)) {
        puntuacion += 200;
      }

      // Coincidencia en otros campos
      if (directorNormalizado.includes(terminoNormalizado)) {
        puntuacion += 100;
      } else {
        // Si el término tiene dos palabras, buscar también el orden invertido
        const partes = terminoNormalizado.split(" ");
        if (partes.length === 2) {
          const invertido = `${partes[1]} ${partes[0]}`;
          if (directorNormalizado.includes(invertido)) {
            puntuacion += 100;
          }
        }
      }

      if (cueString === terminoNormalizado) {
        puntuacion += 800; // Coincidencia exacta de CUE
      } else if (cueString.includes(terminoNormalizado)) {
        puntuacion += 150; // Coincidencia parcial de CUE
      }

      if (departamentoNormalizado === terminoNormalizado) {
        puntuacion += 100;
      } else if (departamentoNormalizado.includes(terminoNormalizado)) {
        puntuacion += 50;
      }

      if (localidadNormalizada === terminoNormalizado) {
        puntuacion += 100;
      } else if (localidadNormalizada.includes(terminoNormalizado)) {
        puntuacion += 50;
      }

      if (tipoEscuelaNormalizado === terminoNormalizado) {
        puntuacion += 100;
      } else if (
        tipoEscuelaNormalizado &&
        tipoEscuelaNormalizado.includes(terminoNormalizado)
      ) {
        puntuacion += 50;
      }
    }

    if (puntuacion > 0) {
      resultadosConPuntuacion.push({ escuela, puntuacion });
    }
  });

  // Ordenar por puntuación y obtener solo las escuelas
  return resultadosConPuntuacion
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .map((item) => item.escuela)
    .slice(0, limite);
}
