import {
  getContentBySlug,
  getAllContentSlugs,
  getAllContent,
} from "../../../modules/article/data/content";
import FullArticle from "../../../modules/article/components/FullArticle";

export async function generateStaticParams() {
  const slugs = await getAllContentSlugs("tramites");
  return slugs.map((slug) => ({
    id: String(typeof slug === "object" ? slug.id || "" : slug),
  }));
}
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const id = String(params.id);
  const post = await getContentBySlug("tramites", id);
  const todosLosArticulos = getAllContent("tramites");
  const articulosRelacionados = (await todosLosArticulos).filter(
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
