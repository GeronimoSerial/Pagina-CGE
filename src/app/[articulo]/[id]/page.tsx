//Articulo completo de una noticia o trámite
import {
  getContentBySlug,
  getAllContentSlugs,
  getAllContent,
} from "@modules/article/data/content";
import FullArticle from "@modules/article/components/FullArticle";
import { notFound } from "next/navigation";

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
  const post = { ...postRaw };

  const todosLosArticulos = await getAllContent(articulo);

  const articulosRelacionados = todosLosArticulos.filter(
    (art) =>
      (art as any).subcategoria === (post as any).subcategoria &&
      art.slug !== post.slug
  );
  return (
    <FullArticle
      post={postRaw}
      sectionTitle={articulo === "noticias" ? "Noticias" : "Trámites"}
      articulosRelacionados={articulosRelacionados}
    />
  );
}
