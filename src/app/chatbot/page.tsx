import HeroSection from "@/src/modules/layout/Hero";
import Image from "next/image";
import { MessageSquare, Shield, Sparkles, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { StickyImage } from "@src/components/data/dynamic-client";

export const metadata: Metadata = {
  title: "Chat Normativo",
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

          {/* Funcionamiento */}
          <section
            className="bg-white p-6 lg:p-8 rounded-xl shadow-md border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 hover:shadow-lg"
            aria-labelledby="como-funciona"
          >
            <h2
              id="como-funciona"
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
            >
              <Sparkles className="h-6 w-6 text-[#3D8B37] mr-3 flex-shrink-0" />
              ¿Cómo funciona?
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              {/* Inicio del chat */}
              <div>
                <h3 className="font-semibold text-xl text-gray-800 mb-1">
                  Iniciar una consulta
                </h3>
                <p>
                  Hacé clic en <strong>Iniciar Chat</strong> para comenzar a
                  usar el asistente virtual. Podés hacer preguntas sobre
                  normativas, artículos o trámites específicos.
                </p>
                <blockquote className="pl-4 border-l-4 border-[#3D8B37] italic bg-gray-50 p-3 rounded-r-md mt-2">
                  <p className="text-gray-700">
                    "¿En qué artículo se menciona el traslado docente?"
                  </p>
                </blockquote>
              </div>

              {/* Selección de documentos */}
              <div>
                <h3 className="font-semibold text-xl text-gray-800 mb-1">
                  Elegir documentos
                </h3>
                <p>
                  Si conocés el documento que trata el tema (por ejemplo, el
                  Estatuto Docente o el Reglamento Escolar), podés seleccionarlo
                  antes de iniciar el chat. Si no estás seguro, dejá
                  seleccionados
                  <strong> todos los documentos</strong> y el asistente buscará
                  por vos.
                </p>
              </div>

              {/* Referencias en las respuestas */}
              <div className="group">
                <h3 className="font-semibold text-xl text-gray-800 mb-1">
                  Referencias visibles
                </h3>
                <p>
                  Las respuestas incluyen <strong>números de referencia</strong>{" "}
                  <span className="relative inline-block">
                    <span className="text-[#3D8B37] font-medium cursor-help">
                      (1)
                    </span>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-white text-sm text-gray-700 rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                      <strong className="inline-block italic">
                        Esto es un ejemplo de referencia
                      </strong>
                      Artículo 30. Se entiende por permuta el cambio de destino
                      de común acuerdo entre dos o más miembros del personal.
                      Para ser considerada, los aspirantes deberán reunir las
                      siguientes condiciones...
                    </span>
                  </span>
                  . Al pasar el mouse por encima, verás el artículo o fragmento
                  original del documento donde se basa la respuesta.
                </p>
              </div>

              {/* Navegación simple */}
              <div>
                <h3 className="font-semibold text-xl text-gray-800 mb-1">
                  Asistencia intuitiva
                </h3>
                <p>
                  El chatbot te guiará paso a paso de forma clara y sencilla.
                </p>
              </div>
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
              Basado en Documentación Oficial
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                El asistente virtual accede a documentos oficiales del CGE para
                brindar respuestas orientativas. Sin embargo, puede contener
                imprecisiones o interpretaciones erróneas.
              </p>
              <div className="bg-[#3D8B37]/10 p-4 rounded-lg border border-[#3D8B37]/20">
                <p className="text-gray-800">
                  <strong className="text-[#216B1D] font-semibold">
                    Importante:
                  </strong>{" "}
                  Toda información consultada deberá ser verificada en la
                  normativa original vigente antes de tomar decisiones formales
                  o administrativas.
                </p>
              </div>
              <p className="text-gray-700 font-medium flex items-start">
                <span className="inline-block w-2 h-2 bg-[#3D8B37] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Cada respuesta incluye su referencia documental correspondiente,
                la cual es recomendable leer completa para una comprensión
                precisa y contextualizada.
              </p>
              <p className="text-gray-700 font-medium flex items-start">
                <span className="inline-block w-2 h-2 bg-[#3D8B37] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                El uso del asistente no exime al usuario de verificar la fuente
                oficial correspondiente.
              </p>
            </div>
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
        {/* Imagen del chatbot */}
        <StickyImage enlace={linkChat} />
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
              Basado en Documentación Oficial
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            El asistente virtual ofrece respuestas orientativas basadas en
            documentación oficial del CGE. Sin embargo,{" "}
            <strong>
              toda consulta o decisión administrativa deberá basarse
              exclusivamente en la normativa original vigente.
            </strong>{" "}
            El uso del asistente{" "}
            <strong>
              no exime al usuario de verificar la fuente oficial
              correspondiente.
            </strong>
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
