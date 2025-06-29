import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import {
  getNoticiaBySlug,
  getPortada,
  getNoticiasRelacionadas,
} from '@/features/noticias/services/noticias';
import { formatearFecha } from '@/shared/lib/utils';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import PhotoSwipeGallery from '@/shared/components/PhotoSwipeGallery';
import { MarkdownComponent } from '@/shared/components/MarkdownComponent';
import remarkGfm from 'remark-gfm';
import { Separador } from '@/shared/components/Separador';
import type { Metadata } from 'next';

// Revalida la página cada 3 horas para mantener los datos actualizados.
// export const revalidate = 60 * 60 * 3;

/**
 * Genera los metadatos de la página (título, descripción, Open Graph)
 * basándose en los datos de la noticia.
 * @param {object} props - Propiedades de la función.
 * @param {Promise<{ slug: string }>} props.params - Parámetros de la ruta que contienen el slug de la noticia.
 * @returns {Promise<Metadata>} Metadatos de la página.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return {}; // Si no se encuentra la noticia, retorna un objeto vacío.
  return {
    title: noticia.titulo,
    description: noticia.resumen || noticia.titulo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen || noticia.titulo,
      images: noticia.portada ? [noticia.portada] : [],
    },
  };
}

// Lista de enlaces institucionales para la barra lateral.
const ENLACES = [
  {
    href: 'https://www.corrientes.gob.ar/',
    label: 'Gobierno de Corrientes',
  },
  {
    href: 'https://www.mec.gob.ar/',
    label: 'Ministerio de Educación',
  },
  {
    href: 'https://ge.mec.gob.ar/',
    label: 'Gestión Educativa',
  },
];

// Define las propiedades esperadas para el componente de la página.
interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Componente principal de la página de noticias individual.
 * Muestra el contenido de una noticia, enlaces relacionados y una galería de imágenes.
 * @param {PageProps} props - Propiedades del componente.
 * @returns {JSX.Element} El componente de la página de la noticia.
 */
export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  // Obtiene la noticia y las noticias relacionadas en paralelo para mejorar el rendimiento.
  const [noticia, related] = await Promise.all([
    getNoticiaBySlug(slug),
    (async () => {
      const n = await getNoticiaBySlug(slug);
      return n ? getNoticiasRelacionadas(n.categoria) : [];
    })(),
  ]);
  // Si la noticia no se encuentra, muestra la página 404.
  if (!noticia) return notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        {/* Contenido principal de la noticia */}
        <main className="flex-1 transition-all duration-300">
          <div className="px-4 py-8 mx-auto max-w-5xl sm:px-6 lg:px-8">
            {/* Breadcrumb para la navegación */}
            <nav className="flex items-center mb-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-800">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <Link href="/noticias" className="hover:text-green-800">
                Noticias
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{noticia.titulo}</span>
            </nav>
            {/* Artículo principal de la noticia */}
            <article className="mb-8 bg-white rounded-xl shadow-sm">
              <div className="p-6 sm:p-8">
                {/* Encabezado del artículo con metadatos de la noticia */}
                <header className="mb-8">
                  <div className="flex flex-wrap gap-4 items-center mb-4 text-sm text-gray-500">
                    {/* Fecha de publicación */}
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-4 h-4" />
                      <span>{formatearFecha(noticia.fecha)}</span>
                    </div>
                    {/* Autor de la noticia */}
                    <div className="flex items-center">
                      <User className="mr-1 w-4 h-4" />
                      <span>Redacción CGE</span>
                    </div>
                    {/* Categoría de la noticia */}
                    <span className="px-2 py-1 text-xs text-white bg-green-800 rounded-full">
                      {noticia.categoria}
                    </span>
                  </div>
                  {/* Título de la noticia */}
                  <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    {noticia.titulo}
                  </h1>
                  {/* Resumen de la noticia */}
                  <p className="text-xl leading-relaxed text-gray-600">
                    {noticia.resumen}
                  </p>
                </header>
                {/* Imagen de portada de la noticia, si existe */}
                {noticia.portada && (
                  <img
                    src={getPortada({ noticia }) || ''}
                    alt={noticia.titulo}
                    className="object-cover mb-8 w-full max-h-96 rounded"
                  />
                )}
                {/* Contenido de la noticia renderizado desde Markdown */}
                <div className="mb-8 max-w-none prose prose-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponent}
                  >
                    {noticia.contenido}
                  </ReactMarkdown>
                </div>
                {/* Galería de imágenes, si la noticia tiene imágenes */}
                {noticia.imagen && noticia.imagen.length > 0 && (
                  <>
                    <Separador titulo="Galería de imágenes" />
                    <PhotoSwipeGallery noticia={noticia} />
                  </>
                )}
              </div>
            </article>
          </div>
        </main>
        {/* Barra lateral (estática, a la derecha) */}
        <aside className="hidden overflow-hidden sticky top-24 mt-24 mr-3 mb-3 w-72 h-full border-t-2 border-r border-b border-l shadow-lg backdrop-blur-sm transition-all duration-500 ease-out border-slate-200 border-t-slate-300 shadow-slate-200/50 lg:block bg-white/95">
          <div className="flex flex-col h-full">
            {/* Sección de navegación: Enlaces institucionales */}
            <div className="px-2 py-6">
              <h3 className="px-4 mb-5 text-sm font-semibold tracking-[0.1em] text-black ">
                ENLACES INSTITUCIONALES
              </h3>
              {/* Enlaces de navegación mejorados */}
              <div className="space-y-1">
                {ENLACES.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center px-4 py-3.5 text-black-800 transition-all duration-300 ease-out hover:text-black-900 hover:underline"
                  >
                    {/* Línea de acento izquierda que aparece al pasar el ratón */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>
                    {/* Contenedor de contenido con mejor espaciado */}
                    <div className="flex items-center ml-3 w-full">
                      {/* Elemento decorativo pequeño */}
                      <div className="w-1.5 h-1.5 bg-green-800 rounded-full mr-3 group-hover:bg-green-700 transition-colors duration-300"></div>
                      {/* Texto del enlace */}
                      <span className="text-sm font-medium tracking-wide transition-transform duration-300 ease-out group-hover:translate-x-1">
                        {enlace.label}
                      </span>
                    </div>
                    {/* Fondo sutil al pasar el ratón */}
                    <div className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-out bg-slate-50 group-hover:opacity-60"></div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Separador elegante entre secciones */}
            {Array.isArray(related) && related.length > 0 && (
              <div className="px-6">
                <div className="relative">
                  <div className="flex absolute inset-0 items-center">
                    <div className="w-full">
                      <div className="border-t border-slate-300 mb-0.5"></div>
                      <div className="border-t border-slate-200"></div>
                    </div>
                  </div>
                  <div className="flex relative justify-center">
                    <div className="px-4 bg-white">
                      <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Sección de artículos relacionados */}
            {Array.isArray(related) && related.length > 0 && (
              <div className="flex-1 px-2 py-6">
                <h3 className="px-4 mb-5 text-sm font-semibold tracking-[0.1em] text-black ">
                  ARTÍCULOS RELACIONADOS
                </h3>
                {/* Enlaces a artículos relacionados */}
                <div className="space-y-2">
                  {related.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/noticias/${item.slug}`}
                      className="block relative px-4 py-3 transition-all duration-300 ease-out group hover:text-slate-900"
                    >
                      {/* Línea de acento izquierda */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>
                      {/* Contenido con mejor uso del margen izquierdo */}
                      <div className="ml-3">
                        <div className="mb-2 text-sm font-medium leading-snug transition-transform duration-300 ease-out text-slate-800 group-hover:text-slate-900 group-hover:translate-x-1">
                          {item.titulo}
                        </div>
                        <div className="pr-2 text-xs leading-relaxed transition-colors duration-300 text-slate-500 group-hover:text-black">
                          {item.resumen.slice(0, 160)}
                        </div>
                      </div>
                      {/* Fondo sutil al pasar el ratón */}
                      <div className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-out bg-slate-50 group-hover:opacity-40"></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
