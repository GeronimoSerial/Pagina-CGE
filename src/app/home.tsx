'use client'
import React from "react";
import { motion } from "framer-motion";
import {HeroSection} from "../modules/home";
import { NewsGrid, NewsItem } from "../modules/news";
import { QuickAccess } from "../modules/home";
import { DocumentationSection } from "../modules/documentation";
import { Separator } from "../components/ui/separator";

type Props = { news: NewsItem[] };
const HomePage = ({ news }: Props) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80"
                alt="CGE Logo"
                className="h-10 w-auto"
              />
              <span className="ml-2 text-lg font-semibold text-[#3D8B37] hidden md:inline">
                Consejo General de Educación
              </span>
            </a>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className="text-sm font-medium text-[#3D8B37] hover:text-[#2D6A27]"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
            >
              Institucional
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
            >
              Niveles
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
            >
              Noticias
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
            >
              Documentación
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
            >
              Contacto
            </a>
          </nav>
          <button className="md:hidden p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header> */}

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Access Section */}
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 md:px-6">
            <QuickAccess />
          </div>
        </section>

        {/* News Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-[#333] mb-2">
                Noticias y Novedades
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Mantente informado sobre las últimas novedades, publicaciones y
                resoluciones del Consejo General de Educación.
              </p>
            </motion.div>
            <NewsGrid news={news} />
          </div>
        </section>

        {/* Institutional Section */}
        <section className="py-16 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-[#333] mb-4">
                  Quiénes Somos
                </h2>
                <p className="text-gray-600 mb-6">
                  El Consejo General de Educación es el organismo provincial
                  responsable de la gestión del sistema educativo, trabajando
                  para garantizar una educación pública de calidad, inclusiva y
                  accesible para todos los estudiantes de la provincia de
                  Corrientes.
                </p>
                <p className="text-gray-600 mb-6">
                  Nuestra misión es implementar políticas educativas que
                  promuevan el desarrollo integral de los estudiantes, apoyar la
                  formación docente continua y fortalecer la infraestructura
                  educativa en toda la provincia.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-[#3D8B37] font-medium hover:underline"
                >
                  Conocer más sobre nosotros
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                  alt="Consejo General de Educación"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-[#333] mb-2">
                Documentación Institucional
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Accede a recursos, guías y normativas oficiales para trámites,
                procedimientos y consultas relacionadas con el sistema educativo
                provincial.
              </p>
            </motion.div>
            <DocumentationSection />
          </div>
        </section>
      </main>

      {/* Footer
      <footer className="bg-[#3D8B37] text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                Consejo General de Educación
              </h3>
              <p className="text-sm opacity-80">
                Trabajando por una educación pública de calidad
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Institucional
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Niveles Educativos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Noticias
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Documentación</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Licencias
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Expedientes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Formularios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Normativas
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Contacto</h4>
              <address className="not-italic">
                <p className="text-sm opacity-80 mb-1">Calle Principal 123</p>
                <p className="text-sm opacity-80 mb-1">Corrientes, Argentina</p>
                <p className="text-sm opacity-80 mb-1">contacto@cge.gov.ar</p>
                <p className="text-sm opacity-80">+54 (379) 123-4567</p>
              </address>
            </div>
          </div>
          <Separator className="my-8 bg-white/20" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-70">
              © 2023 Consejo General de Educación. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-white opacity-70 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
