import {
  getContentBySlug,
  getAllContentSlugs,
  getAllContent,
} from "../../../modules/article/data/content";
import FullArticle from "../../../modules/article/components/FullArticle";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getAllContentSlugs("tramites");
  return slugs.map((slug) => ({
    id: String(typeof slug === "object" ? slug.id || "" : slug),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const id = String((await params).id);
  let postRaw;
  try {
    postRaw = await getContentBySlug("tramites", id);
  } catch {
    return notFound();
  }
  if (!postRaw) {
    return notFound();
  }
  const post = { ...postRaw };
  const todosLosArticulos = await getAllContent("tramites");
  const articulosRelacionados = todosLosArticulos.filter(
    (articulo) =>
      (articulo as any).subcategoria === (post as any).subcategoria &&
      articulo.slug !== post.slug
  );
  return (
    <FullArticle
      post={post}
      sectionTitle="Tramites"
      articulosRelacionados={articulosRelacionados}
    />
  );
}
