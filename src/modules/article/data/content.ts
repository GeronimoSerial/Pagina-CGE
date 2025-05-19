// lib/news.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function getDirectory(type: 'noticias' | 'tramites') {
  return path.join(process.cwd(), `/public/content/${type}`)
}

export async function getContentBySlug(type: 'noticias' | 'tramites', slug: string) {
  const directory = getDirectory(type)
  const fullPath = path.join(directory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)

  return {
    slug,
    ...data,
    content
  }
}

export function getAllContentSlugs(type: 'noticias' | 'tramites') {
  const directory = getDirectory(type)
  const filenames = fs.readdirSync(directory)
  return filenames
    .filter((filename) => {
      const fullPath = path.join(directory, filename);
      return fs.statSync(fullPath).isFile() && filename.endsWith('.md');
    })
    .map((filename) => ({
      id: filename.replace(/\.md$/, '')
    }))
}

export function getAllContentMetadata(
  type: 'noticias' | 'tramites', 
  page: number = 1, 
  limit: number = 4,
  searchTerm: string = '',
  categoria: string = ''
) {
  const directory = getDirectory(type)
  const filenames = fs.readdirSync(directory);

  // Cache para evitar leer el mismo archivo múltiples veces
  const fileDataCache: Record<string, any> = {};

  // Función para obtener datos de archivo (con caché)
  const getFileData = (filename: string) => {
    if (!fileDataCache[filename]) {
      const fullPath = path.join(directory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      fileDataCache[filename] = {
        slug: filename.replace(/\.md$/, ''),
        ...data
      };
    }
    return fileDataCache[filename];
  };

  // Filtrar y ordenar los archivos
  let filteredFilenames = filenames
    .filter((filename) => filename.endsWith('.md'))
    .sort((a, b) => {
      // Para noticias, ordenar por fecha descendente
      if (type === 'noticias') {
        const dateA = a.split('-').slice(0, 3).join('-'); // Asume formato YYYY-MM-DD-titulo.md
        const dateB = b.split('-').slice(0, 3).join('-');
        return dateB.localeCompare(dateA);
      }
      // Para trámites, ordenar alfabéticamente
      return a.localeCompare(b);
    });

  // Si hay un término de búsqueda o categoría, filtrar los archivos
  if (searchTerm || categoria) {
    const normalizeText = (text: string = '') => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/\s+/g, "-") // Reemplazar espacios por guiones
        .replace(/[^a-z0-9\-]/g, "") // Solo letras, números y guiones
        .trim();
    };

    const searchTermNormalized = searchTerm ? normalizeText(searchTerm) : '';
    const searchWords = searchTermNormalized ? 
      searchTermNormalized.split(/\s+/).filter(word => word.length > 0) : [];

    // Filtrar usando los datos cacheados
    filteredFilenames = filteredFilenames.filter((filename) => {
      const fileData = getFileData(filename);
      
      // Filtrar por categoría si está especificada (comparando normalizado)
      if (categoria && normalizeText(fileData.subcategoria) !== categoria) {
        return false;
      }
      
      // Si no hay término de búsqueda, devolvemos true (pasa el filtro)
      if (!searchTerm || searchWords.length === 0) {
        return true;
      }
      
      // Normalizar los campos a buscar
      const titleNormalized = normalizeText(fileData.titulo || '');
      const descriptionNormalized = normalizeText(fileData.description || fileData.resumen || '');
      const contentToSearch = titleNormalized + " " + descriptionNormalized;
      
      // Todas las palabras deben coincidir para que sea un resultado válido
      return searchWords.every(word => contentToSearch.includes(word));
    });
  }

  // Calcular paginación
  const totalItems = filteredFilenames.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Obtener solo los archivos de la página actual
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFilenames = filteredFilenames.slice(startIndex, endIndex);

  // Mapear los filenames a metadata usando la caché
  const metadata = paginatedFilenames.map((filename) => getFileData(filename));

  return {
    items: metadata,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }
}

export function getAllContent(type: 'noticias' | 'tramites') {
  const directory = getDirectory(type)
  const filenames = fs.readdirSync(directory);
  
  // Cache para evitar leer el mismo archivo múltiples veces
  const fileDataCache: Record<string, any> = {};
  
  return filenames
    .filter((filename) => {
      const fullPath = path.join(directory, filename);
      return (
        fs.statSync(fullPath).isFile() && filename.endsWith('.md')
      );
    })
    .map((filename) => {
      // Usar caché si el archivo ya se ha leído
      if (!fileDataCache[filename]) {
        const slug = filename.replace(/\.md$/, '');
        const fullPath = path.join(directory, filename);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        fileDataCache[filename] = {
          slug,
          ...data,
          content,
        };
      }
      return fileDataCache[filename];
    });
}


