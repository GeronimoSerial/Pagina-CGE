import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { normalizarTexto } from "@/src/lib/utils";



function getDirectory(type: "noticias" | "tramites") {
  return path.join(process.cwd(), `/public/content/${type}`);
}

export async function getContentBySlug(
  type: "noticias" | "tramites",
  slug: string
) {
  const directory = getDirectory(type);
  const fullPath = path.join(directory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  return {
    slug,
    ...data,
    content,
  };
}

export function getAllContentSlugs(type: "noticias" | "tramites") {
  const directory = getDirectory(type);
  const filenames = fs.readdirSync(directory);
  return filenames
    .filter((filename) => {
      const fullPath = path.join(directory, filename);
      return fs.statSync(fullPath).isFile() && filename.endsWith(".md");
    })
    .map((filename) => ({
      id: filename.replace(/\.md$/, ""),
    }));
}

export function getAllContentMetadata(
  type: "noticias" | "tramites",
  page: number = 1,
  limit: number = 4,
  searchTerm: string = "",
  categoria: string = ""
) {
  const directory = getDirectory(type);
  const filenames = fs.readdirSync(directory);

  const fileDataCache: Record<string, any> = {};

  const getFileData = (filename: string) => {
    if (!fileDataCache[filename]) {
      const fullPath = path.join(directory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      fileDataCache[filename] = {
        slug: filename.replace(/\.md$/, ""),
        ...data,
      };
    }
    return fileDataCache[filename];
  };

  let filteredFilenames = filenames
    .filter((filename) => filename.endsWith(".md"))
    .sort((a, b) => {
      if (type === "noticias") {
        const dateA = a.split("-").slice(0, 3).join("-");
        const dateB = b.split("-").slice(0, 3).join("-");
        return dateB.localeCompare(dateA);
      }

      return a.localeCompare(b);
    });

  if (searchTerm || categoria) {

    const searchTermNormalized = searchTerm ? normalizarTexto(searchTerm) : "";
    const searchWords = searchTermNormalized
      ? searchTermNormalized.split(/\s+/).filter((word) => word.length > 0)
      : [];

    filteredFilenames = filteredFilenames.filter((filename) => {
      const fileData = getFileData(filename);

      if (categoria && normalizarTexto(fileData.subcategoria) !== categoria) {
        return false;
      }

      if (!searchTerm || searchWords.length === 0) {
        return true;
      }

      const titleNormalized = normalizarTexto(fileData.titulo || "");
      const descriptionNormalized = normalizarTexto(
        fileData.description || fileData.resumen || ""
      );
      const contentToSearch = titleNormalized + " " + descriptionNormalized;

      return searchWords.every((word) => contentToSearch.includes(word));
    });
  }

  const totalItems = filteredFilenames.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFilenames = filteredFilenames.slice(startIndex, endIndex);

  const metadata = paginatedFilenames.map((filename) => getFileData(filename));

  return {
    items: metadata,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function getAllContent(type: "noticias" | "tramites") {
  const directory = getDirectory(type);
  const filenames = fs.readdirSync(directory);

  const fileDataCache: Record<string, any> = {};

  return filenames
    .filter((filename) => {
      const fullPath = path.join(directory, filename);
      return fs.statSync(fullPath).isFile() && filename.endsWith(".md");
    })
    .map((filename) => {
      if (!fileDataCache[filename]) {
        const slug = filename.replace(/\.md$/, "");
        const fullPath = path.join(directory, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
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
