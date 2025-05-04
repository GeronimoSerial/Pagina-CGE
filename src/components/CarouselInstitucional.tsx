import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { memo } from "react";

const slides = [
  {
    src: "/carrousel/2.jpg",
    alt: "Docentes ascendidos – Consejo General de Educación",
    title: "Impulsamos el desarrollo profesional",
    description: "Acompañamos el crecimiento de nuestros docentes",
  },
  {
    src: "/carrousel/4.jpg",
    alt: "Supervisores del Consejo General de Educación",
    title: "Transformando la educación con dedicación",
    description:
      "El trabajo constante es esencial para un sistema educativo más fuerte",
  },
  {
    src: "/carrousel/3.jpg",
    alt: "Funcionarios",
    title: "Gestión educativa al servicio de la comunidad",
    description: "Cerca de las escuelas, junto a los docentes",
  },
  {
    src: "/carrousel/gob.png",
    alt: "La presidente, gobernador y ministra en escuela",
    title: "Juntos por una educación de calidad",
    description:
      "El trabajo conjunto entre autoridades impulsa el desarrollo educativo en Corrientes",
  },
  {
    src: "/images/header-noticias.webp",
    alt: "Consejo General de Educación",
    title: "Educación de calidad",
    description: "Comprometidos con el futuro de Corrientes",
  },
] as const;

const CarouselSlide = memo(function CarouselSlide({
  slide,
  idx,
}: {
  slide: (typeof slides)[number];
  idx: number;
}) {
  return (
    <CarouselItem>
      <div className="relative h-64 md:h-[32rem] rounded-2xl overflow-hidden shadow-xl group">
        <Image
          src={slide.src}
          alt={slide.alt}
          className="object-cover object-[center_75%] w-full h-full z-10 transition-transform duration-700 group-hover:scale-105"
          fill
          priority={idx === 0}
          loading={idx === 0 ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lw2uWQAAAABJRU5ErkJggg=="
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-30">
          <h4 className="text-white text-xs md:text-3xl font-bold mb-1.5 md:mb-3 drop-shadow-lg">
            {slide.title}
          </h4>
          <p className="text-white/90 drop-shadow text-xs md:text-lg max-w-3xl line-clamp-2 md:line-clamp-none">
            {slide.description}
          </p>
        </div>
      </div>
    </CarouselItem>
  );
});

const carouselOptions = {
  align: "start",
  loop: true,
  skipSnaps: false,
  startIndex: 0,
} as const;

function CarouselInstitucional() {
  return (
    <div className="w-full max-w-5xl mx-auto my-11">
      <Carousel
        className="w-full"
        opts={carouselOptions}
        autoplay={true}
        autoplayInterval={5000}
      >
        <CarouselContent>
          {slides.map((slide, idx) => (
            <CarouselSlide key={slide.src} slide={slide} idx={idx} />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default memo(CarouselInstitucional);
