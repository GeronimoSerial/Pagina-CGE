// app/noticia/[id]/page.tsx

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import ReactMarkdown from "react-markdown";
import { getNewsBySlug, getAllNewsSlugs, getAllNews } from "../../../modules/news/data/news";

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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">
            Noticia no encontrada
          </h1>
          <p className="mt-4">
            Lo sentimos, la noticia que estás buscando no existe o ha sido removida.
          </p>
          <Link href="/">
            <Button className="mt-6 bg-[#3D8B37] hover:bg-[#2D6A27]">
              <ArrowLeftIcon className="mr-2" size={16} />
              Volver a la página principal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 border-[#3D8B37] text-[#3D8B37] hover:bg-[#3D8B37]/10"
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            Volver a noticias
          </Button>
        </Link>

        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-[400px] overflow-hidden">
            <img
              src={post.imagen ?? "/images/default.jpg"}
              alt={post.titulo ?? "Noticia"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-4">
              {/* No hay categoría en el frontmatter, así que se omite */}
              <span className="text-sm text-gray-500">{post.fecha ?? ""}</span>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.titulo ?? ""}</h1>
            <p className="text-lg text-gray-600 mb-6">{post.resumen ?? ""}</p>

            <hr className="my-6" />

            <div className="prose prose-neutral max-w-none prose-headings:text-[#3D8B37] prose-a:text-[#3D8B37]">
              <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}