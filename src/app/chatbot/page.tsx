import HeroSection from "@/src/modules/layout/Hero";
import Image from "next/image";
import { MessageSquare, Shield, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Normativo CGE",
  description:
    "Asistente virtual para consultar normativa educativa del Consejo General de Educación de Corrientes.",
};
const linkChat =
  "https://notebooklm.google.com/notebook/7a5e8e5c-60d4-4ee6-a38b-4526d3652f7b";

export default function ChatBot() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Chat Normativo CGE – Tu guía digital 🤖"
        description="Consultá normativa educativa en segundos con el chatbot oficial del Consejo General de Educación."
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Qué es */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="h-6 w-6 text-[#3D8B37] mr-2" />
                ¿Qué es el Chat Normativo?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                El Chat Normativo es un asistente virtual inteligente
                desarrollado por el CGE para ayudarte a encontrar y entender
                rápidamente la normativa educativa vigente. Utiliza tecnología
                avanzada de NotebookLM para proporcionar respuestas precisas y
                actualizadas.
              </p>
            </div>
            {/* funcionamiento */}
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
                  Hacé clic en <strong>Iniciar Chat</strong> para comenzar a
                  usar el asistente virtual. Podés hacer consultas sobre
                  normativas, artículos o trámites específicos. Por ejemplo:
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
                  <strong>todos los documentos</strong> y el asistente buscará
                  la información por vos.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  Las respuestas incluyen referencias numeradas. Al pasar el
                  mouse por encima del número, vas a ver el artículo o fragmento
                  original del documento donde se basa la respuesta.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  El chatbot te guiará paso a paso de forma clara e intuitiva.
                </p>
              </div>
            </section>
            {/* Información Oficial */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-[#3D8B37] mr-2" />
                Información Oficial y Segura
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Todas las respuestas provienen directamente de la documentación
                oficial del CGE. El sistema está diseñado para garantizar la
                precisión y confiabilidad de la información proporcionada,
                respaldada por las fuentes oficiales del Consejo.
              </p>
            </div>
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
          <div className="space-y-2 sticky top-24 self-start">
            <a
              href={linkChat}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-2xl font-semibold">Acceder al Chat</p>
                    <p className="text-lg mt-2">
                      Haz click para comenzar tu consulta
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-2">
                      <svg
                        className="w-6 h-6 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <Image
                  src="/images/Chatbot.png"
                  alt="Asistente virtual del CGE"
                  fill
                  className="object-fill group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </a>
            <p className="text-sm underline text-gray-400 text-center italic">
              Imagen ilustrativa del asistente virtual
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
