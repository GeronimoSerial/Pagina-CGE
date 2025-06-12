import HeroSection from "@/src/modules/layout/Hero";
import Image from "next/image";
import { MessageSquare, Shield, Sparkles, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Normativo CGE",
  description:
    "Asistente virtual para consultar normativa educativa del Consejo General de Educación de Corrientes.",
};

const linkChat =
  "https://notebooklm.google.com/notebook/7a5e8e5c-60d4-4ee6-a38b-4526d3652f7b";

function DesktopView() {
  return (
    <div className="hidden md:block container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Columna de información */}
        <div className="space-y-6 lg:space-y-8">
          {/* Qué es */}
          <section
            className="bg-white p-6 lg:p-8 rounded-xl shadow-md border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 hover:shadow-lg"
            aria-labelledby="que-es"
          >
            <h2
              id="que-es"
              className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
            >
              <MessageSquare className="h-6 w-6 text-[#3D8B37] mr-3 flex-shrink-0" />
              ¿Qué es el Chat Normativo?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              El Chat Normativo es un asistente virtual inteligente desarrollado
              por el CGE para ayudarte a encontrar y entender rápidamente la
              normativa educativa vigente. Utiliza tecnología avanzada de
              NotebookLM para proporcionar respuestas precisas y actualizadas.
            </p>
          </section>

          {/* Cómo funciona */}
          <section
            className="bg-white p-6 lg:p-8 rounded-xl shadow-md border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 hover:shadow-lg"
            aria-labelledby="como-funciona"
          >
            <h2
              id="como-funciona"
              className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
            >
              <Sparkles className="h-6 w-6 text-[#3D8B37] mr-3 flex-shrink-0" />
              ¿Cómo funciona?
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Hacé clic en <strong>Iniciar Chat</strong> para comenzar a usar
                el asistente virtual. Podés hacer consultas sobre normativas,
                artículos o trámites específicos. Por ejemplo:
              </p>

              <blockquote className="pl-4 border-l-4 border-[#3D8B37] italic bg-gray-50 p-3 rounded-r-md">
                <p className="text-gray-700">
                  "¿En qué artículo se menciona el traslado docente?"
                </p>
              </blockquote>

              <p className="text-gray-600 leading-relaxed">
                Si conocés el documento que trata el tema (por ejemplo, el
                Estatuto Docente o el Reglamento Escolar), podés seleccionarlo
                antes de iniciar el chat para obtener respuestas más precisas.
                Si no estás seguro, simplemente dejá seleccionados{" "}
                <strong>todos los documentos</strong> y el asistente buscará la
                información por vos.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Las respuestas incluyen referencias numeradas. Al pasar el mouse
                por encima del número, vas a ver el artículo o fragmento
                original del documento donde se basa la respuesta.
              </p>

              <p className="text-gray-600 leading-relaxed">
                El chatbot te guiará paso a paso de forma clara e intuitiva.
              </p>
            </div>
          </section>

          {/* Información Oficial */}
          <section
            className="bg-white p-6 lg:p-8 rounded-xl shadow-md border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 hover:shadow-lg"
            aria-labelledby="info-oficial"
          >
            <h2
              id="info-oficial"
              className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
            >
              <Shield className="h-6 w-6 text-[#3D8B37] mr-3 flex-shrink-0" />
              Información Oficial y Segura
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Todas las respuestas provienen directamente de la documentación
              oficial del CGE. El sistema está diseñado para garantizar la
              precisión y confiabilidad de la información proporcionada,
              respaldada por las fuentes oficiales del Consejo.
            </p>
          </section>

          {/* Botón de acción */}
          <a
            href={linkChat}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-8 py-4 rounded-xl bg-[#216B1D] hover:bg-[#195016] text-white font-medium text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3D8B37] focus:outline-none"
            aria-label="Iniciar Chat Normativo CGE"
          >
            Iniciar Chat
            <MessageSquare className="h-5 w-5 ml-2" />
          </a>
        </div>

        {/* Imagen ilustrativa */}
        <div className="sticky top-24 self-start">
          <div className="relative">
            <a
              href={linkChat}
              target="_blank"
              rel="noopener noreferrer"
              className="block group focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2 rounded-xl"
              aria-label="Acceder al Chat Normativo CGE"
            >
              <div className="cursor-pointer transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-[#3D8B37]/30 transform hover:-translate-y-2 rounded-2xl p-1 bg-gradient-to-r from-[#216B1D] via-[#3D8B37] to-[#195016]">
                <div className="relative h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-2xl font-semibold">Acceder al Chat</p>
                      <p className="text-lg mt-2">
                        Haz click para comenzar tu consulta
                      </p>
                      <div className="mt-6 flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                  <Image
                    src="/images/Chatbot.png"
                    alt="Asistente virtual del CGE - Interfaz del Chat Normativo"
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </a>
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center z-20">
              <span className="text-sm text-[#3D8B37] font-medium italic bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md whitespace-nowrap border border-[#3D8B37]/20">
                Imagen ilustrativa del asistente virtual
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileView() {
  return (
    <div className="md:hidden px-4 py-6">
      {/* CTA Principal arriba */}
      <div className="mb-8">
        <a
          href={linkChat}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#216B1D] text-white text-center py-4 px-6 rounded-lg font-semibold text-lg shadow-lg active:bg-[#195016] transition-colors duration-200"
          aria-label="Iniciar Chat Normativo CGE"
        >
          <MessageSquare className="h-6 w-6 inline mr-2" />
          Iniciar Chat Ahora
        </a>
      </div>

      {/* Imagen compacta */}
      <div className="mb-8">
        <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/Chatbot.png"
            alt="Chat Normativo CGE"
            fill
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2 italic">
          Interfaz del asistente virtual
        </p>
      </div>

      {/* Información en formato compacto */}
      <div className="space-y-6">
        {/* Qué es - Versión móvil */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-[#3D8B37]/10 rounded-lg mr-3">
              <MessageSquare className="h-5 w-5 text-[#3D8B37]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">¿Qué es?</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Asistente virtual del CGE para consultar normativa educativa de
            forma rápida y precisa usando tecnología NotebookLM.
          </p>
        </div>

        {/* Cómo usar - Versión móvil */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-[#3D8B37]/10 rounded-lg mr-3">
              <Sparkles className="h-5 w-5 text-[#3D8B37]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">¿Cómo usar?</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              1. <strong>Hacé tu consulta</strong> en lenguaje natural
            </p>
            <p>
              2. <strong>Seleccioná documentos</strong> específicos o dejá todos
            </p>
            <p>
              3. <strong>Revisá las referencias</strong> numeradas en las
              respuestas
            </p>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-[#3D8B37] mt-3">
              <p className="italic text-gray-700 text-xs">
                Ejemplo: "¿En qué artículo se menciona el traslado docente?"
              </p>
            </div>
          </div>
        </div>

        {/* Información oficial - Versión móvil */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-[#3D8B37]/10 rounded-lg mr-3">
              <Shield className="h-5 w-5 text-[#3D8B37]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Información Oficial
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Todas las respuestas provienen de documentación oficial del CGE,
            garantizando precisión y confiabilidad.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href={linkChat}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[#3D8B37] font-medium text-sm"
          aria-label="Acceder al Chat Normativo CGE"
        >
          Acceder al chat
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  );
}

export default function ChatBot() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Chat Normativo CGE – Tu guía digital 🤖"
        description="Consultá normativa educativa en segundos con el chatbot oficial del Consejo General de Educación."
      />
      <DesktopView />
      <MobileView />
    </main>
  );
}
