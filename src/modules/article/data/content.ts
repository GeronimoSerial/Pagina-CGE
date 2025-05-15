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

export function getAllContentMetadata(type: 'noticias' | 'tramites', page: number = 1, limit: number = 4) {
  const directory = getDirectory(type)
  const filenames = fs.readdirSync(directory);

  // Filtrar y ordenar los archivos
  const filteredFiles = filenames
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

  // Calcular paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(filteredFiles.length / limit);

  // Obtener solo los archivos de la página actual
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  const metadata = paginatedFiles.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const fullPath = path.join(directory, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      ...data
    }
  });

  return {
    items: metadata,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: filteredFiles.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }
}
export function getAllContent(type: 'noticias' | 'tramites') {
  const directory = getDirectory(type)
  const filenames = fs.readdirSync(directory);
  return filenames
    .filter((filename) => {
      const fullPath = path.join(directory, filename);
      return (
        fs.statSync(fullPath).isFile() && filename.endsWith('.md')
      );
    })
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(directory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        ...data,
        content,
      };
    });
}


