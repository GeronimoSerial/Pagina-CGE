import { formatearFecha } from "../../lib/utils";
import ArticlesGrid from "../../modules/article/components/ArticlesGrid";
import { getAllContent } from "../../modules/article/data/content";
// import { useState } from "react";
import { Search, HelpCircle, FileText, Phone } from "lucide-react";

export async function generateStaticParams(){
    return [
        { slug: []}
    ]
}

export default function TramitesGrid(){
    const rawTramites = getAllContent('tramites');
    const categorias = [
        "Licencias",
        "Certificaciones", 
        "Inscripciones",
        "Jubilaciones",
        "Cambios de destino"
    ];

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
            esUrgente: item.esUrgente || false
        }
    })

    return(
        <main className="bg-gray-50">
            <section id="tramites" className="py-16">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Encabezado */}
                    <div className="mb-10 text-center" role="heading" aria-level={1}>
                        <h1 className="text-4xl font-bold mb-4">
                            Trámites y Gestiones
                        </h1>
                        <p className="text-gray-700 max-w-3xl mx-auto">
                            Gestione sus trámites institucionales de manera simple y eficiente
                        </p>
                    </div>

                    {/* Buscador y Filtros */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="search"
                                    placeholder="Buscar trámites..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D8B37]"
                                />
                            </div>
                            <select className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8B37]">
                                <option value="">Todas las categorías</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grid de Trámites */}
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-9">
                            <ArticlesGrid articles={tramite} />
                        </div>

                        {/* Sidebar */}
                        <aside className="md:col-span-3 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <HelpCircle className="text-[#3D8B37] w-5 h-5" />
                                    Preguntas Frecuentes
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">¿Cómo inicio un trámite?</a></li>
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">Documentación necesaria</a></li>
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">Plazos de gestión</a></li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="text-[#3D8B37] w-5 h-5" />
                                    Recursos
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">Guías y tutoriales</a></li>
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">Formularios</a></li>
                                    <li><a href="#" className="text-[#3D8B37] hover:underline">Videos instructivos</a></li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="text-[#3D8B37] w-5 h-5" />
                                    Contacto
                                </h3>
                                <p className="text-gray-600 mb-2">¿Necesita ayuda?</p>
                                <p className="text-gray-800">Tel: (0000) 000-0000</p>
                                <p className="text-gray-800">Email: ayuda@institucion.edu</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}