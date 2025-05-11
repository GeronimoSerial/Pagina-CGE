import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export interface ImagenCarruselGenerica {
  imagen?: string; // para noticias
  src?: string; // para institucional
  titulo?: string; // para noticias
  alt?: string; // para institucional
  descripcion?: string; // para noticias
}

const carouselOptions = {
  align: "start",
  loop: true,
  skipSnaps: false,
  startIndex: 0,
} as const;

function CarouselSlide({
  slide,
  idx,
}: {
  slide: ImagenCarruselGenerica;
  idx: number;
}) {
  const src = slide.imagen || slide.src || "";
  const alt = slide.titulo || slide.alt || "";
  const description = slide.descripcion || "";
  return (
    <CarouselItem>
      <div className="relative h-64 md:h-[32rem] rounded-2xl overflow-hidden shadow-xl group">
        <Image
          src={src}
          alt={alt}
          className="object-cover object-[center_75%] w-full h-full z-10 transition-transform duration-700 group-hover:scale-105"
          fill
          priority={idx === 0}
          loading={idx === 0 ? undefined : "lazy"}
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
    </CarouselItem>
  );
}

export default function CarouselDeImagenes({
  imagenes,
}: {
  imagenes: ImagenCarruselGenerica[];
}) {
  if (!imagenes || imagenes.length === 0) return null;
  return (
    <div className="w-full max-w-5xl mx-auto my-11">
      <Carousel
        className="w-full"
        opts={carouselOptions}
        autoplay={true}
        autoplayInterval={5000}
      >
        <CarouselContent>
          {imagenes.map((slide, idx) => (
            <CarouselSlide
              key={slide.imagen || slide.src || idx}
              slide={slide}
              idx={idx}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
