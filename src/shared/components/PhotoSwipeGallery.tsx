'use client';

import { useEffect } from 'react';
import PhotoSwipeLightBox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { getImagenes } from '@/features/noticias/services/noticias';
import { Noticia } from '@/shared/interfaces';

interface PhotoSwipeGalleryProps {
  noticia: Noticia;
}

export default function PhotoSwipeGallery({ noticia }: PhotoSwipeGalleryProps) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightBox({
      gallery: '#gallery--responsive-images', // Updated gallery selector
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4"
      id="gallery--responsive-images"
    >
      {noticia.imagen &&
        noticia.imagen.length > 0 &&
        getImagenes(noticia).map((img, index) => (
          <a
            href={img.url}
            data-pswp-width={img.width}
            data-pswp-height={img.height}
            key={index}
            target="_blank"
            rel="noreferrer"
            className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <img
              src={img.url}
              alt={img.alt || 'Imagen de la noticia'}
              className="w-full h-48 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white text-lg font-bold">Ver Imagen</span>
            </div>
          </a>
        ))}
    </div>
  );
}
