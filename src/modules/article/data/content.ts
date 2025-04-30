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


