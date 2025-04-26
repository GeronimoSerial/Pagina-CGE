
import { ArrowLeftIcon, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatearFecha } from "../../../lib/utils";


export default function FullArticle({ post, sectionTitle = "Articulo" }: { post: any, sectionTitle?: string }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center justify-center h-32 w-32 mx-auto mb-6 rounded-full bg-red-50">
            <span className="text-red-500 text-5xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 text-center">
            {sectionTitle} no encontrado
          </h1>
          <p className="mt-4 text-center text-gray-600">
            Lo sentimos, El articulo que estás buscando no existe o ha sido removida.
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
            Volver a {sectionTitle.toLowerCase()}
          </Button>
        </Link>

        <article className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
          <div className="relative h-[450px] overflow-hidden">
            <img
              src={post.imagen ?? "/images/default.jpg"}
              alt={post.titulo ?? "Articulo"}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center gap-3 text-white mb-2">
                <span className="text-sm font-medium bg-[#3D8B37] px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={14} />
                  {post.categoria}
                </span>
                <span className="text-sm flex items-center gap-1">
                  {formatearFecha(post.fecha)}
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
                  <span className="text-[#3D8B37] font-bold">⤴</span>
                </button>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:text-[#3D8B37] prose-a:text-[#217A4B] hover:prose-a:text-[#2D6A27] prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-[#3D8B37] prose-blockquote:bg-[#F7FAF9] prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-1 prose-code:rounded-md prose-code:text-[#3D8B37] prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                  a: ({node, ...props}) => <a className="underline hover:text-[#2D6A27] transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                  img: ({node, ...props}) => <img className="rounded-lg shadow-md my-4" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#3D8B37] bg-[#F7FAF9] text-gray-600 pl-4 py-2 my-4" {...props} />,
                  code: ({node, ...props}) => <code className="bg-gray-100 px-1.5 py-1 rounded-md text-[#3D8B37]" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  table: ({node, ...props}) => <table className="min-w-full border mt-4 mb-6" {...props} />,
                  th: ({node, ...props}) => <th className="border px-3 py-2 bg-gray-100" {...props} />,
                  td: ({node, ...props}) => <td className="border px-3 py-2" {...props} />,
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
                Para más detalles sobre este {sectionTitle}, puede contactar a la oficina de prensa del CGE.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}