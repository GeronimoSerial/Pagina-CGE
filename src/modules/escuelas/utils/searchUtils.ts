import type { Escuela } from "@src/interfaces";

/**
 * Interfaz para el índice de búsqueda simplificado
 * Incluye solo los campos principales para la búsqueda
 */
export interface SearchIndex {
  nombreIndex: Map<string, number[]>;
  directorIndex: Map<string, number[]>;
  cueIndex: Map<string, number[]>;
  localidadIndex: Map<string, number[]>;
}

/**
 * Normaliza un texto para búsqueda: convierte a minúsculas, quita acentos y otros caracteres especiales
 */
export function normalizarTexto(texto: unknown): string {
  if (texto === null || texto === undefined) return "";
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, " ") // Normalizar espacios múltiples a uno solo
    .trim();
}

/**
 * Crea un índice de búsqueda a partir de los datos de escuelas
 * Este índice se crea una sola vez y se reutiliza para todas las búsquedas
 */
export function createSearchIndex(escuelas: Escuela[]): SearchIndex {
  // Creamos los mapas de índice para cada campo
  const nombreIndex = new Map<string, number[]>();
  const directorIndex = new Map<string, number[]>();
  const cueIndex = new Map<string, number[]>();
  const localidadIndex = new Map<string, number[]>();
  
  // Indexamos cada escuela por todos sus campos
  escuelas.forEach((escuela, idx) => {
    // Indexar por nombre
    if (escuela.nombre) {
      const palabrasNombre = normalizarTexto(escuela.nombre).split(/\s+/);
      indexarPalabras(palabrasNombre, nombreIndex, idx);
      
      // También indexamos el nombre completo para búsquedas de frases
      const nombreCompleto = normalizarTexto(escuela.nombre);
      if (!nombreIndex.has(nombreCompleto)) {
        nombreIndex.set(nombreCompleto, []);
      }
      nombreIndex.get(nombreCompleto)?.push(idx);
    }
    
    // Indexar por director
    if (escuela.director) {
      const palabrasDirector = normalizarTexto(escuela.director).split(/\s+/);
      indexarPalabras(palabrasDirector, directorIndex, idx);
    }
    
    // Indexar por CUE
    if (escuela.cue) {
      const cueStr = String(escuela.cue);
      if (!cueIndex.has(cueStr)) {
        cueIndex.set(cueStr, []);
      }
      cueIndex.get(cueStr)?.push(idx);
    }
    
    // Indexar por localidad
    if (escuela.localidad) {
      const palabrasLocalidad = normalizarTexto(escuela.localidad).split(/\s+/);
      indexarPalabras(palabrasLocalidad, localidadIndex, idx);
    }
  });
  
  return { 
    nombreIndex, 
    directorIndex, 
    cueIndex, 
    localidadIndex 
  };
}

/**
 * Función auxiliar para indexar palabras en un mapa de índice
 */
function indexarPalabras(palabras: string[], indice: Map<string, number[]>, idx: number) {
  palabras.forEach(palabra => {
    if (palabra.length > 2) { // Ignoramos palabras muy cortas
      if (!indice.has(palabra)) {
        indice.set(palabra, []);
      }
      indice.get(palabra)?.push(idx);
    }
  });
}

/**
 * Interfaz para las opciones de filtrado simplificadas
 */
export interface FiltroOptions {
  supervisor?: string;
  limite?: number; // Limitar número de resultados
}

/**
 * Función para filtrar escuelas con el sistema de búsqueda mejorado
 * Usa un sistema de puntuación para ordenar resultados por relevancia
 * Busca solo por nombre, director, CUE y localidad
 */
export function filtrarEscuelas(
  escuelas: Escuela[], 
  termino: string, 
  opciones: FiltroOptions = {}
): Escuela[] {
  // Aplicamos filtros duros (criterios que deben cumplirse sí o sí)
  let escuelasFiltradas = [...escuelas];
  
  // Filtrar por supervisor si está especificado
  if (opciones.supervisor) {
    escuelasFiltradas = escuelasFiltradas.filter(escuela => 
      String(escuela.supervisorID) === opciones.supervisor
    );
  }
  
  // Si no hay término de búsqueda, devolvemos las escuelas filtradas por supervisor
  if (!termino || termino.trim() === "") {
    const limite = opciones.limite || escuelasFiltradas.length;
    return escuelasFiltradas.slice(0, limite);
  }
  
  // Creamos un índice temporal para las escuelas filtradas
  const indiceTemp = createSearchIndex(escuelasFiltradas);
  
  // Normalizar el término de búsqueda
  const terminoNormalizado = normalizarTexto(termino);
  
  // Sistema de puntuación para resultados
  const puntuaciones = new Map<number, number>();
  
  // Detectar si es una búsqueda por CUE
  const esPosibleCUE = /^\d+$/.test(terminoNormalizado);
  
  // Buscar coincidencias exactas del término completo
  escuelasFiltradas.forEach((escuela, idx) => {
    let puntuacion = 0;
    
    // Coincidencia exacta del nombre completo (máxima prioridad)
    if (escuela.nombre && normalizarTexto(escuela.nombre) === terminoNormalizado) {
      puntuacion += 5000;
    }
    
    // Coincidencia exacta de CUE (alta prioridad)
    if (esPosibleCUE && escuela.cue && String(escuela.cue) === terminoNormalizado) {
      puntuacion += 4000;
    }
    
    // El nombre contiene el término completo (alta prioridad)
    if (escuela.nombre && normalizarTexto(escuela.nombre).includes(terminoNormalizado)) {
      puntuacion += 3000;
    }
    
    // El director contiene el término completo
    if (escuela.director && normalizarTexto(escuela.director).includes(terminoNormalizado)) {
      puntuacion += 2000;
    }
    
    // La localidad contiene el término completo
    if (escuela.localidad && normalizarTexto(escuela.localidad).includes(terminoNormalizado)) {
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
    const terminosBusqueda = terminoNormalizado.split(/\s+/).filter(term => term.length > 2);
    
    escuelasFiltradas.forEach((escuela, idx) => {
      let puntuacion = 0;
      let terminosEncontrados = 0;
      
      // Verificar si todos los términos están presentes en algún campo
      const cumpleTodosLosTerminos = terminosBusqueda.every(termino => {
        const estaEnNombre = escuela.nombre ? normalizarTexto(escuela.nombre).includes(termino) : false;
        const estaEnDirector = escuela.director ? normalizarTexto(escuela.director).includes(termino) : false;
        const estaEnCUE = escuela.cue ? String(escuela.cue).includes(termino) : false;
        const estaEnLocalidad = escuela.localidad ? normalizarTexto(escuela.localidad).includes(termino) : false;
        
        return estaEnNombre || estaEnDirector || estaEnCUE || estaEnLocalidad;
      });
      
      // Bonificación importante si cumple todos los términos
      if (cumpleTodosLosTerminos) {
        puntuacion += 500;
      }
      
      // Asignar puntos por cada término encontrado en cada campo
      terminosBusqueda.forEach(termino => {
        // Buscar en nombre (campo más importante)
        if (escuela.nombre && normalizarTexto(escuela.nombre).includes(termino)) {
          puntuacion += 50;
          terminosEncontrados++;
        }
        
        // Buscar en director
        if (escuela.director && normalizarTexto(escuela.director).includes(termino)) {
          puntuacion += 30;
          terminosEncontrados++;
        }
        
        // Buscar en CUE
        if (escuela.cue && String(escuela.cue).includes(termino)) {
          puntuacion += 40;
          terminosEncontrados++;
        }
        
        // Buscar en localidad
        if (escuela.localidad && normalizarTexto(escuela.localidad).includes(termino)) {
          puntuacion += 25;
          terminosEncontrados++;
        }
      });
      
      // Bonificación por porcentaje de términos encontrados
      if (terminosBusqueda.length > 0) {
        const porcentajeEncontrado = terminosEncontrados / (terminosBusqueda.length * 4); // 4 campos
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

/**
 * Versión simplificada de la función de filtrado para uso rápido
 * sin necesidad de crear índices
 */
export function buscarEscuelas(escuelas: Escuela[], termino: string, supervisor = ""): Escuela[] {
  return filtrarEscuelas(escuelas, termino, { 
    supervisor, 
    limite: 20
  });
}

/**
 * Destaca los términos de búsqueda en un texto
 * @param texto El texto donde buscar
 * @param terminos Los términos a destacar
 * @returns El texto con los términos destacados en <mark>
 */
export function destacarTerminos(texto: string, termino: string): string {
  if (!texto || !termino) return texto;
  
  const terminoNormalizado = normalizarTexto(termino);
  const terminosSeparados = terminoNormalizado.split(/\s+/).filter(t => t.length > 2);
  
  // Si no hay términos válidos, devolver el texto original
  if (terminosSeparados.length === 0) return texto;
  
  // Crear una expresión regular que busque todos los términos, ignorando mayúsculas/minúsculas y acentos
  const regexPartes = terminosSeparados.map(t => {
    // Escapar caracteres especiales de regex
    const termEscapado = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return termEscapado;
  });
  
  let resultado = texto;
  
  // Aplicar cada término por separado para evitar problemas con la normalización
  regexPartes.forEach(termRegex => {
    // Expresión que captura el término con posibles acentos
    const regex = new RegExp(`(${termRegex})`, 'gi');
    resultado = resultado.replace(regex, '<mark>$1</mark>');
  });
  
  return resultado;
}

/**
 * Función avanzada para buscar escuelas con sistema de puntuación
 * Optimizada para búsquedas específicas como "Escuela 17"
 */
export function buscarEscuelasAvanzado(
  escuelas: Escuela[],
  termino: string,
  limite: number = 20
): Escuela[] {
  if (!termino || termino.trim() === "") {
    return [];
  }

  const terminoNormalizado = normalizarTexto(termino);
  
  // Sistema de puntuación para ordenar resultados por relevancia
  const resultadosConPuntuacion: Array<{ escuela: Escuela; puntuacion: number }> = [];
  
  // Buscar patrones numéricos (como "Escuela 17", "Escuela N° 17", etc.)
  const numeroEscuelaMatch = terminoNormalizado.match(/escuela\s*(?:n[°º.]?)?\s*(\d+)/i);
  const numeroEscuela = numeroEscuelaMatch ? numeroEscuelaMatch[1] : null;
  
  // Buscar coincidencias en todas las escuelas
  escuelas.forEach(escuela => {
    let puntuacion = 0;
    const nombreNormalizado = normalizarTexto(escuela.nombre);
    const directorNormalizado = normalizarTexto(escuela.director);
    const cueString = escuela.cue.toString();
    const departamentoNormalizado = normalizarTexto(escuela.departamento);
    const localidadNormalizada = normalizarTexto(escuela.localidad);
    const tipoEscuelaNormalizado = normalizarTexto(escuela.tipoEscuela);
    
    // Buscar por número específico de escuela
    if (numeroEscuela) {
      // Intentar extraer el número de la escuela del nombre
      const escuelaNumeroMatch = nombreNormalizado.match(/escuela\s*(?:n[°º.]?)?\s*(\d+)/i);
      if (escuelaNumeroMatch && escuelaNumeroMatch[1] === numeroEscuela) {
        puntuacion += 5000; // Coincidencia exacta de número de escuela
      }
      
      // Buscar números en otras formas (por ejemplo "N° 17" sin la palabra "escuela")
      else if (nombreNormalizado.match(new RegExp(`\\bn[°º.]?\\s*${numeroEscuela}\\b`, 'i'))) {
        puntuacion += 4500; // Coincidencia de N° XX
      }
      
      // Buscar solo el número si está como palabra independiente
      else if (nombreNormalizado.match(new RegExp(`\\b${numeroEscuela}\\b`, 'i'))) {
        puntuacion += 3000; // Coincidencia solo del número
      }
    }
    
    // Buscar el término completo (podría ser "Profesora Corina")
    if (terminoNormalizado !== "escuela" && terminoNormalizado !== "n" && terminoNormalizado.length > 2) {
      // Coincidencia exacta en el nombre
      if (nombreNormalizado === terminoNormalizado) {
        puntuacion += 1000;
      } 
      // Nombre comienza con el término de búsqueda
      else if (nombreNormalizado.startsWith(terminoNormalizado)) {
        puntuacion += 500;
      }
      // Nombre contiene el término de búsqueda como palabra completa
      else if (nombreNormalizado.includes(` ${terminoNormalizado} `) || 
              nombreNormalizado.includes(`${terminoNormalizado} `) || 
              nombreNormalizado.includes(` ${terminoNormalizado}`)) {
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
        const partes = terminoNormalizado.split(' ');
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
      } else if (tipoEscuelaNormalizado && tipoEscuelaNormalizado.includes(terminoNormalizado)) {
        puntuacion += 50;
      }
    }
    
    // Si hay puntuación, agregar a los resultados
    if (puntuacion > 0) {
      resultadosConPuntuacion.push({ escuela, puntuacion });
    }
  });
  
  // Ordenar por puntuación y obtener solo las escuelas
  return resultadosConPuntuacion
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .map(item => item.escuela)
    .slice(0, limite);
}