//Image carousel component
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { GenericCarouselImage } from '@/shared/interfaces/index';
import { useState, useEffect, useCallback } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.css';

const defaultBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lw2uWQAAAABJRU5ErkJggg==';

function CarouselSlide({
  slide,
  isFirst,
  onClick,
  horizontal = false,
}: {
  slide: GenericCarouselImage;
  isFirst: boolean;
  onClick?: () => void;
  horizontal?: boolean;
}) {
  const src = slide.imagen || slide.src || '';
  const alt = slide.alt || slide.titulo || '';
  const description = slide.descripcion || '';

  const orientacion = horizontal
    ? 'object-cover object-[center_75%] w-full h-full z-10'
    : 'object-contain w-full h-full z-10';

  return (
    <div
      className="relative h-64 md:h-128 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        className={orientacion}
        fill
        priority={isFirst}
        loading={isFirst ? undefined : 'lazy'}
        placeholder="blur"
        blurDataURL={defaultBlur}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-20" />
      {(alt || description) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-30">
          {alt && (
            <h4 className="text-white text-xs md:text-3xl font-bold mb-1.5 md:mb-3 drop-shadow-lg">
              {alt}
            </h4>
          )}
          {description && (
            <p className="text-white/90 drop-shadow-sm text-xs md:text-lg max-w-3xl line-clamp-2 md:line-clamp-none">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CarouselModal({
  images,
  activeIndex,
  closeModal,
}: {
  images: GenericCarouselImage[];
  activeIndex: number;
  closeModal: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={closeModal}
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:scale-110 transition"
        aria-label="Cerrar modal"
      >
        Cerrar ✖
      </button>
      <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
        <Swiper
          initialSlide={activeIndex}
          loop
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center justify-center h-full">
                <Image
                  src={img.imagen || img.src || ''}
                  alt={img.alt || ''}
                  width={1200}
                  height={800}
                  className="max-h-[90vh] w-auto object-contain rounded-xl shadow-xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default function ImageCarousel({
  images,
  horizontal,
}: {
  images: GenericCarouselImage[];
  horizontal?: boolean;
}) {
  if (!images || images.length === 0) return null;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const openModal = useCallback((index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (modalOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [modalOpen, closeModal]);

  const handleSlideClick = (i: number) => () => openModal(i);

  return (
    <div className="w-full max-w-5xl mx-auto my-11 relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        className="h-full w-full rounded-2xl"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <CarouselSlide
              slide={slide}
              isFirst={index === 0}
              onClick={handleSlideClick(index)}
              horizontal={horizontal}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {modalOpen && (
        <CarouselModal
          images={images}
          activeIndex={activeIndex}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
