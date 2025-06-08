//Articulo completo de una noticia o trámite
import {
  getContentBySlug,
  getAllContentSlugs,
} from "@modules/article/data/content";
import { normalizeArticle } from "@modules/article/data/article-utils";
import FullArticle from "@modules/article/components/FullArticle";
import { notFound } from "next/navigation";
import { getArticulosRelacionados } from "@/src/hooks/articles/useRelatedArticles";

const tiposPermitidos = ["noticias", "tramites"] as const;

export async function generateStaticParams() {
  const tipos = tiposPermitidos;

  const allSlugs = await Promise.all(
    tipos.map(async (articulo) => {
      const slugs = await getAllContentSlugs(articulo);
      return slugs.map(({ id }) => ({ articulo, id }));
    })
  );

  return allSlugs.flat();
}

interface PageProps {
  params: Promise<{ articulo: "noticias" | "tramites"; id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { articulo, id } = resolvedParams;

  if (!tiposPermitidos.includes(articulo)) return notFound();

  let postRaw;
  try {
    postRaw = await getContentBySlug(articulo, id);
  } catch {
    return notFound();
  }

  if (!postRaw) return notFound();
  const post = normalizeArticle(postRaw);

  const articulosRelacionados = await getArticulosRelacionados(post, articulo);

  return (
    <FullArticle
      post={post}
      sectionTitle={articulo === "noticias" ? "Noticias" : "Trámites"}
      articulosRelacionados={articulosRelacionados}
    />
  );
}
