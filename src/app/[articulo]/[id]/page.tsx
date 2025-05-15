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

// El tipo de params es efectivamente una Promise que resuelve a un objeto con las variables de ruta
interface PageProps {
  params: Promise<{ articulo: "noticias" | "tramites"; id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Esperamos a que params esté completamente resuelto
  const resolvedParams = await params;
  const { articulo, id } = resolvedParams;

  // Verificamos si 'articulo' es uno de los permitidos
  if (!tiposPermitidos.includes(articulo)) return notFound();

  let postRaw;
  try {
    // Llamamos a la función con el tipo dinámico basado en el valor de 'articulo'
    postRaw = await getContentBySlug(articulo, id); // Sin necesidad de casteo forzado
  } catch {
    return notFound();
  }

  if (!postRaw) return notFound();
  const post = { ...postRaw };

  const todosLosArticulos = await getAllContent(articulo); // Usamos 'articulo' dinámicamente

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
