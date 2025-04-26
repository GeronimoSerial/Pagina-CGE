// lib/news.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const newsDirectory = path.join(process.cwd(), 'public/content/noticias')

export async function getNewsBySlug(slug: string) {
  const fullPath = path.join(newsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)

  return {
    slug,
    ...data,
    content
  }
}

export function getAllNewsSlugs() {
  const filenames = fs.readdirSync(newsDirectory)

  return filenames.map((filename) => ({
    id: filename.replace(/\.md$/, '')
  }))
}

export function getAllNews() {
  const filenames = fs.readdirSync(newsDirectory);
  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(newsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      ...data,
      content,
    };
  });
}
