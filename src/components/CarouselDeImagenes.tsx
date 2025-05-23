import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { ImagenCarruselGenerica } from "@interfaces/index";
import { useState, useEffect, useCallback } from "react";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/swiper-custom.css";

const defaultBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lw2uWQAAAABJRU5ErkJggg==";

function CarouselSlide({
  slide,
  isFirst,
  onClick,
  horizontal = false,
}: {
  slide: ImagenCarruselGenerica;
  isFirst: boolean;
  onClick?: () => void;
  horizontal?: boolean;
}) {
  const src = slide.imagen || slide.src || "";
  const alt = slide.alt || slide.titulo || "";
  const description = slide.descripcion || "";

  const orientacion = horizontal
    ? "object-cover object-[center_75%] w-full h-full z-10"
    : "object-contain w-full h-full z-10";

  return (
    <div
      className="relative h-[16rem] md:h-[32rem] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        className={orientacion}
        fill
        priority={isFirst}
        loading={isFirst ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={defaultBlur}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />
      {(alt || description) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-30">
          {alt && (
            <h4 className="text-white text-xs md:text-3xl font-bold mb-1.5 md:mb-3 drop-shadow-lg">
              {alt}
            </h4>
          )}
          {description && (
            <p className="text-white/90 drop-shadow text-xs md:text-lg max-w-3xl line-clamp-2 md:line-clamp-none">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ModalCarrusel({
  imagenes,
  indiceActivo,
  cerrarModal,
}: {
  imagenes: ImagenCarruselGenerica[];
  indiceActivo: number;
  cerrarModal: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={cerrarModal}
    >
      <button
        onClick={cerrarModal}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:scale-110 transition"
        aria-label="Cerrar modal"
      >
        Cerrar ✖
      </button>
      <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
        <Swiper
          initialSlide={indiceActivo}
          loop
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-full h-full"
        >
          {imagenes.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center justify-center h-full">
                <Image
                  src={img.imagen || img.src || ""}
                  alt={img.alt || ""}
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

export default function CarouselDeImagenes({
  imagenes,
  horizontal,
}: {
  imagenes: ImagenCarruselGenerica[];
  horizontal?: boolean;
}) {
  if (!imagenes || imagenes.length === 0) return null;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceActivo, setIndiceActivo] = useState(0);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
  }, []);

  const abrirModal = useCallback((indice: number) => {
    setIndiceActivo(indice);
    setModalAbierto(true);
  }, []);

  useEffect(() => {
    const manejarEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cerrarModal();
      }
    };
    if (modalAbierto) {
      window.addEventListener("keydown", manejarEsc);
    }
    return () => {
      window.removeEventListener("keydown", manejarEsc);
    };
  }, [modalAbierto, cerrarModal]);

  const manejarClickSlide = (i: number) => () => abrirModal(i);

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
        {imagenes.map((slide, index) => (
          <SwiperSlide key={index}>
            <CarouselSlide
              slide={slide}
              isFirst={index === 0}
              onClick={manejarClickSlide(index)}
              horizontal={horizontal}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {modalAbierto && (
        <ModalCarrusel
          imagenes={imagenes}
          indiceActivo={indiceActivo}
          cerrarModal={cerrarModal}
        />
      )}
    </div>
  );
}
