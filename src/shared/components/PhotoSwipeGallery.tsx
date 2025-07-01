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
      className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
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
            className="block overflow-hidden relative rounded-lg shadow-md transition-shadow duration-300 ease-in-out group hover:shadow-xl"
          >
            <img
              src={img.url}
              alt={img.alt || 'Imagen de la noticia'}
              className="object-cover w-full h-48 rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
            <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-25 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <span className="text-lg font-bold text-white">Ampliar</span>
            </div>
          </a>
        ))}
    </div>
  );
}
