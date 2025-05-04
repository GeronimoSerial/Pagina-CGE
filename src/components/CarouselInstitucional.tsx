import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

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
    src: "/carrousel/6.jpg",
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
];

export default function CarouselInstitucional() {
  return (
    <div className="w-full max-w-5xl  my-16">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl group flex items-end">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  className="object-cover object-[center_75%] w-full h-full z-10 transition-transform duration-700 group-hover:scale-105"
                  fill
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-30">
                  <h4 className="text-white hidden md:block text-2xl font-bold mb-2 drop-shadow-lg">
                    {slide.title}
                  </h4>
                  <p className="text-white/80 drop-shadow">
                    {slide.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-16 mt-8 ">
          <CarouselPrevious className="static w-10 h-10 rounded-full bg-gray-100 text-gray-700 shadow-md hover:bg-green-300 transition-colors" />
          <CarouselNext className="static w-10 h-10 rounded-full  bg-gray-100 text-gray-700 shadow-md hover:bg-green-300 transition-colors " />
        </div>
      </Carousel>
    </div>
  );
}
