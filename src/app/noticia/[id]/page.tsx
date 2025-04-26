// app/noticia/[id]/page.tsx

import { ArrowLeftIcon, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import ReactMarkdown from "react-markdown";
import { getNewsBySlug, getAllNewsSlugs } from "../../../modules/news/data/news";

type Props = {
    params: { id: string }
}


// Esta función le dice a Next.js qué páginas debe generar
export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
//   const rawNews = await getAllNews();
  return slugs;
}

// Componente de página
export default async function NewsArticlePage({ params }: Props) {
  const post: Record<string, any> = await getNewsBySlug(params.id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-32 w-32 mx-auto mb-6 rounded-full bg-red-50">
          <span className="text-red-500 text-5xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-red-600 text-center">
          Noticia no encontrada
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Lo sentimos, la noticia que estás buscando no existe o ha sido
          removida.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button className="mt-6 bg-[#3D8B37] hover:bg-[#2D6A27] transition-all duration-300 shadow-md hover:shadow-lg">
              <ArrowLeftIcon className="mr-2" size={16} />
              Volver a la página principal
            </Button>
          </Link>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 border-[#3D8B37] text-[#3D8B37] hover:bg-[#3D8B37]/20 transition-all duration-300 font-medium"
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            Volver a noticias
          </Button>
        </Link>

        <article className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
          <div className="relative h-[450px] overflow-hidden">
            <img
              src={post.imagen ?? "/images/default.jpg"}
              alt={post.titulo ?? "Noticia"}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center gap-3 text-white mb-2">
                {/* Si tienes categoría, descomenta la siguiente línea */}
                <span className="text-sm font-medium bg-[#3D8B37] px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={14} />
                  {post.categoria}
                </span>
                <span className="text-sm flex items-center gap-1">
                  {/* <Calendar size={14} /> */}
                  {post.fecha ?? ""}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {post.titulo ?? ""}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Compartir:</span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  {/* <Share2 size={18} className="text-[#3D8B37]" /> */}
                  {/* Puedes agregar aquí el icono de compartir que uses */}
                  <span className="text-[#3D8B37] font-bold">⤴</span>
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-6 text-gray-700 leading-relaxed text-lg" {...props} />
                  ),
                }}
              >
                {post.content ?? ""}
              </ReactMarkdown>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-[#3D8B37] mb-4">
                Más información
              </h3>
              <p className="text-gray-600">
                Para más detalles sobre esta noticia, puede contactar a la
                oficina de prensa del CGE.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}