import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { ImagenCarruselGenerica } from "@interfaces/index";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/swiper-custom.css";

function CarouselSlide({
  slide,
  isFirst,
}: {
  slide: ImagenCarruselGenerica;
  isFirst: boolean;
}) {
  const src = slide.imagen || slide.src || "";
  const alt = slide.titulo || slide.alt || "";
  const description = slide.descripcion || "";
  return (
    <div className="relative h-64 md:h-[32rem] rounded-2xl overflow-hidden shadow-xl">
      <Image
        src={src}
        alt={alt}
        className="object-cover object-[center_75%] w-full h-full z-10"
        fill
        priority={isFirst}
        loading={isFirst ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lw2uWQAAAABJRU5ErkJggg=="
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

export default function CarouselDeImagenes({
  imagenes,
}: {
  imagenes: ImagenCarruselGenerica[];
}) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-11 relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        className="h-full w-full rounded-2xl"
      >
        {imagenes.map((slide, index) => (
          <SwiperSlide key={index}>
            <CarouselSlide slide={slide} isFirst={index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Los dots se mostrarán debajo con CSS */}
    </div>
  );
}
