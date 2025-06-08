import { getAllContentMetadata } from "@/src/modules/article/data/content";
import { normalizeArticle } from "@/src/modules/article/data/article-utils";
import { Article } from "@/src/interfaces";

export async function getArticulosRelacionados(
  post: Article,
  articulo: "noticias" | "tramites"
) {
  const todosLosArticulos = await getAllContentMetadata(articulo);
  const articulosNormalizados = todosLosArticulos.items.map(normalizeArticle);

  let articulosRelacionados = articulosNormalizados.filter(
    (art) => art.categoria === post.categoria && art.slug !== post.slug
  );

  if (articulosRelacionados.length < 3) {
    const otrosArticulos = articulosNormalizados
      .filter(
        (art) => art.categoria !== post.categoria && art.slug !== post.slug
      )
      .sort(() => Math.random() - 0.5);
    articulosRelacionados = [
      ...articulosRelacionados,
      ...otrosArticulos.slice(0, 3 - articulosRelacionados.length),
    ];
  }

  return articulosRelacionados.slice(0, 3);
}
