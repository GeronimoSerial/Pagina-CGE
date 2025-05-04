import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ArrowDown,
  Building2,
  Info,
  Search,
  Users,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import HeroSubSection from "../../modules/layout/Hero";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import CarouselInstitucional from "../../components/CarouselInstitucional";

export default function Institucional() {
  return (
    <section
      id="institucional"
      className="bg-gradient-to-b from-white via-gray-50 to-white relative"
    >
      {/* Hero Section - 600px height */}
      <HeroSubSection
        title="Consejo General de Educación"
        description="Trabajando desde 1875 para garantizar una educación de calidad en toda la provincia."
      />

      <div className="container mx-auto px-4 md:px-6 max-w-9xl py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* CONTENIDO PRINCIPAL */}
          <div className="flex-1">
            {/* HISTORIA */}
            <section className="mb-16">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#205C3B] mb-6 flex items-center">
                <span className="inline-block w-2 h-10 bg-[#217A4B] mr-4 rounded-full" />
                Historia del CGE
              </h3>
              <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p>
                  La provincia de Corrientes fue pionera en organizar la
                  educación pública. En abril de 1853 se sancionó en la
                  provincia la primera Ley de Educación (la primera del país).
                  Posteriormente, el 14 de diciembre de 1875 se aprobó un nuevo
                  sistema educativo provincial en el cual apareció por primera
                  vez el "Consejo General de Educación".
                </p>
                <p>
                  En la Constitución provincial de 1889 ya se estableció
                  oficialmente su estructura (un director y varios vocales). El
                  CGE nació así para centralizar la gestión de la educación
                  inicial y primaria en un órgano especializado.
                </p>
                <p>
                  En 2007 fue suprimido, pero en 2011 fue restituido por decreto
                  como un organismo clave para la descentralización del sistema
                  educativo, y actualmente funciona bajo la órbita del
                  Ministerio de Educación de Corrientes.
                </p>
              </div>
            </section>

            {/* FUNCIONES */}
            <section>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#205C3B] mb-8 flex items-center">
                <span className="inline-block w-2 h-10 bg-[#217A4B] mr-4 rounded-full" />
                Funciones
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Planificación y supervisión educativa",
                    text: "Planifica y dirige la implementación de políticas y programas para el nivel inicial y primario. Organiza y supervisa la gestión escolar.",
                    icon: <Building2 className="h-5 w-5 text-[#217A4B]" />,
                  },
                  {
                    title: "Mejoramiento del aprendizaje",
                    text: "Brinda apoyo permanente a las escuelas y capacita a docentes en nuevos enfoques pedagógicos.",
                    icon: <BookOpen className="h-5 w-5 text-[#217A4B]" />,
                  },
                  {
                    title: "Inclusión y prevención del abandono",
                    text: "Desarrolla estrategias para reducir la deserción escolar, promoviendo la lectura, bibliotecas y tecnologías didácticas.",
                    icon: <Users className="h-5 w-5 text-[#217A4B]" />,
                  },
                  {
                    title: "Investigación y redes pedagógicas",
                    text: "Fomenta la investigación en aulas e impulsa redes interinstitucionales que vinculan docentes, escuelas y comunidad.",
                    icon: <Search className="h-5 w-5 text-[#217A4B]" />,
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#217A4B]/30 group"
                  >
                    <div className="flex items-start mb-3">
                      <div className="bg-[#217A4B]/10 p-1 rounded-lg mr-4 group-hover:bg-[#217A4B]/20 transition-colors">
                        {card.icon}
                      </div>
                      <h4 className="font-semibold text-lg text-[#217A4B]">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-gray-700 text-base pl-11">{card.text}</p>
                  </div>
                ))}
              </div>

              {/* ACLARACIÓN FINAL */}
              <div className="mt-12 mb-3 text-gray-700 text-base bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#217A4B]/30 transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-[#217A4B]/10 p-2 rounded-lg mr-3">
                    <Info className="h-5 w-5 text-[#217A4B]" />
                  </div>
                  <p>
                    En conjunto, estas funciones actuales reflejan el rol del
                    CGE como autoridad de gestión de la enseñanza inicial y
                    primaria en Corrientes, coordinación pedagógica y apoyo
                    institucional a las escuelas provinciales.
                  </p>
                </div>
              </div>
            </section>
            {/* Carrusel institucional */}
            <CarouselInstitucional />
          </div>

          {/* CONTACTO STICKY (ESCRITORIO) */}
          <aside className="hidden md:block w-72 mt-4 relative">
            <div className="sticky top-24">
              <div className="w-72 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-[#217A4B]/20">
                <div className="p-5">
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <p className="font-semibold text-lg text-black">
                        Presidente
                      </p>
                      <p className="text-gray-900">
                        Prof. María Silvina Rollet
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-[#217A4B] mr-3" />
                        <p>Catamarca 640, Corrientes</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-[#217A4B] mr-3" />
                        <p>(0379) 442-4264</p>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-[#217A4B] mr-3" />
                        <p>cge@mec.gob.ar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* CONTACTO MOBILE */}
      <div className="md:hidden mx-4 my-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-5">
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold text-lg text-gray-900">Presidente</p>
              <p className="text-gray-600">María Silvina Rollet</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mt-0.5 mr-3 text-[#217A4B] flex-shrink-0" />
                <p>Catamarca 640, Corrientes</p>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mt-0.5 mr-3 text-[#217A4B] flex-shrink-0" />
                <p>(0379) 442-4264</p>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-3 text-[#217A4B] flex-shrink-0" />
                <p>cge@mec.gob.ar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
