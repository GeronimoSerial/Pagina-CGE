import {
  getNoticiaBySlug,
  getNoticiaPortada,
  getImagenes,
} from '@/src/services/noticias';
import { formatearFecha } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import PhotoSwipeGallery from '@/src/components/PhotoSwipeGallery';

interface NoticiaDetalleProps {
  params: { slug: string };
}

export default async function NoticiaDetalle({ params }: NoticiaDetalleProps) {
  params = await params;
  const noticia = await getNoticiaBySlug(params.slug);

  if (!noticia) return notFound();
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{noticia.titulo}</h1>
      <div className="flex gap-2 mb-2">
        <span className="text-xs bg-gray-200 rounded px-2 py-1">
          {noticia.categoria}
        </span>
        {noticia.esImportante && (
          <span className="text-xs bg-red-500 text-white rounded px-2 py-1">
            Importante
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        {formatearFecha(noticia.fecha)}
      </div>
      {noticia.portada && (
        <img
          src={getNoticiaPortada({ noticia }) || ''}
          alt={noticia.titulo}
          className="mb-4 rounded w-full object-cover max-h-96"
        />
      )}
      <p className="mb-4 text-lg">{noticia.resumen}</p>
      <div className="prose dark:prose-invert mb-4">
        <ReactMarkdown>{noticia.contenido}</ReactMarkdown>
      </div>
      {noticia.imagen && noticia.imagen.length > 0 && (
        <PhotoSwipeGallery noticia={noticia} />
      )}
    </main>
  );
}
