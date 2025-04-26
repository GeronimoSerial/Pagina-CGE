import { formatearFecha } from "../../lib/utils";
import ArticlesGrid from "../../modules/article/components/ArticlesGrid";
// import { getAllNews } from "../../modules/article/data/news";
import { getAllContent } from "../../modules/article/data/content";

export async function generateStaticParams(){
    return [
        { slug: []}
    ]
}



export default function TramitesGrid(){
    const rawTramites = getAllContent('tramites');
    const tramite = rawTramites.map((item: any) => {
        const date = formatearFecha(item.date || item.fecha);
        return {
            id: item.slug,
            slug: item.slug,
            title: item.title || item.titulo,
            titulo: item.titulo,
            description: item.description || item.resumen,
            resumen: item.resumen,
            date,
            fecha: date,
            imageUrl: item.imageUrl || item.imagen,
            imagen: item.imagen,
            categoria: item.categoria,
            content: item.content,           
        }
    })
    return(
        <main>
        <section id="tramites" className="py-16 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">
                Tramites Institucionales
              </h2>
              <p className="text-gray-700 max-w-3xl">
                Aprende a realizar tramites institucionales.
              </p>
            </div>
            <ArticlesGrid articles={tramite} />
          </div>
        </section>
        </main>
    );
}