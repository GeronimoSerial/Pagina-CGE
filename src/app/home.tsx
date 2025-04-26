import React from "react";
import {HeroSection} from "../modules/home";
import { NewsGrid, NewsItem } from "../modules/news";
import { QuickAccess } from "../modules/home";
import { DocumentationSection } from "../modules/documentation";
import Image from "next/image";
// import { Separator } from "../components/ui/separator";

type Props = { news: NewsItem[] };
const HomePage = ({ news }: Props) => {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Access Section */}
        <section className="py-12 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <QuickAccess />
          </div>
        </section>

        {/* News Section */}
        <section className="py-16 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">
                Noticias y Novedades
              </h2>
              <p className="text-gray-700 max-w-3xl">
                Mantente informado sobre las últimas novedades, publicaciones y resoluciones del Consejo General de Educación.
              </p>
            </div>
            <NewsGrid news={news} />
          </div>
        </section>

        {/* Institutional Section */}
        <section className="py-16 rounded-2xl shadow-md mx-2 md:mx-0 my-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Quiénes Somos
                </h2>
                <p className="text-gray-700 mb-6">
                  El Consejo General de Educación es el organismo provincial responsable de la gestión del sistema educativo, trabajando para garantizar una educación pública de calidad, inclusiva y accesible para todos los estudiantes de la provincia de Corrientes.
                </p>
                <p className="text-gray-700 mb-6">
                  Nuestra misión es implementar políticas educativas que promuevan el desarrollo integral de los estudiantes, apoyar la formación docente continua y fortalecer la infraestructura educativa en toda la provincia.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-[#217A4B] font-semibold hover:underline hover:text-[#205C3B] transition-colors"
                >
                  Conocer más sobre nosotros
                </a>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/clases.jpg"
                  alt="Consejo General de Educación"
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1080}
                  height={1920}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-16 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">
                Documentación Institucional
              </h2>
              <p className="text-gray-700 max-w-3xl">
                Accede a recursos, guías y normativas oficiales para trámites, procedimientos y consultas relacionadas con el sistema educativo provincial.
              </p>
            </div>
            <DocumentationSection />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
