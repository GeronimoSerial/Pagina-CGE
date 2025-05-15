import HeroSection from "@modules/layout/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description:
    "Políticas de accesibilidad del Consejo General de Educación (CGE) en Corrientes",
};

export default function AccesibilidadPage() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title="Políticas de Accesibilidad"
        description="Nuestro compromiso con la accesibilidad web"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Nuestro Compromiso
            </h2>
            <p className="mb-6">
              El Consejo General de Educación de Corrientes se compromete a
              garantizar la accesibilidad de su sitio web para todas las
              personas, independientemente de sus capacidades o discapacidades.
              Trabajamos continuamente para asegurar que todos los usuarios
              puedan acceder a la información y servicios de manera efectiva y
              eficiente.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Navegación por Teclado
            </h2>
            <p className="mb-4">
              Nuestro sitio web está completamente optimizado para la navegación
              por teclado. Los usuarios pueden:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Utilizar la tecla{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                  Tab
                </kbd>{" "}
                para navegar secuencialmente por todos los elementos
                interactivos
              </li>
              <li>
                Usar{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                  Shift + Tab
                </kbd>{" "}
                para navegar en dirección inversa
              </li>
              <li>
                Activar enlaces y botones con la tecla{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                  Enter
                </kbd>
              </li>
              <li>
                Utilizar las teclas de flecha para navegar dentro de menús
                desplegables
              </li>
              <li>
                Presionar{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                  Esc
                </kbd>{" "}
                para cerrar diálogos o menús
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Atajos de Teclado Principales
            </h3>
            <div className="mb-6">
              <ul className="list-none pl-0 space-y-2">
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                    Alt + 1
                  </kbd>{" "}
                  - Ir al contenido principal
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                    Alt + 2
                  </kbd>{" "}
                  - Ir al menú de navegación
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                    Alt + 3
                  </kbd>{" "}
                  - Ir al pie de página
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">
                    Alt + S
                  </kbd>{" "}
                  - Ir al buscador
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Estándares de Accesibilidad
            </h2>
            <p className="mb-4">
              Nuestro sitio web sigue las pautas de accesibilidad WCAG 2.1 nivel
              AA y cumple con la normativa vigente. Implementamos las siguientes
              medidas:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Navegación mediante teclado completa y visible</li>
              <li>
                Compatibilidad con lectores de pantalla (NVDA, JAWS, VoiceOver)
              </li>
              <li>Alto contraste y tipografía legible con tamaño ajustable</li>
              <li>Textos alternativos descriptivos en todas las imágenes</li>
              <li>Estructura semántica del contenido con landmarks ARIA</li>
              <li>Subtítulos y transcripciones para contenido multimedia</li>
              <li>
                Formularios con etiquetas claras y mensajes de error accesibles
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Adaptación Visual
            </h2>
            <p className="mb-4">
              Para mejorar la legibilidad, ofrecemos las siguientes
              características:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Contraste suficiente entre texto y fondo (mínimo 4.5:1)</li>
              <li>
                Posibilidad de aumentar el tamaño del texto hasta un 200% sin
                pérdida de funcionalidad
              </li>
              <li>Espaciado consistente entre elementos</li>
              <li>Fuentes legibles y ajustables</li>
              <li>Sin contenido que parpadee o destelle</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Compatibilidad con Tecnologías de Asistencia
            </h2>
            <p className="mb-4">
              Nuestro sitio es compatible con las siguientes tecnologías:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Lectores de pantalla modernos (NVDA, JAWS, VoiceOver, TalkBack)
              </li>
              <li>Software de reconocimiento de voz</li>
              <li>Magnificadores de pantalla</li>
              <li>Dispositivos de entrada alternativos</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Reportar Problemas
            </h2>
            <p className="mb-6">
              Si encuentra alguna dificultad para acceder a nuestro contenido o
              desea reportar un problema de accesibilidad, por favor contáctenos
              a través de nuestra{" "}
              <a href="/contacto" className="text-primary hover:underline">
                sección de contacto
              </a>
              . Nos comprometemos a:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Responder a su consulta dentro de las 48 horas hábiles</li>
              <li>
                Proporcionar la información en formatos alternativos si es
                necesario
              </li>
              <li>Resolver los problemas de accesibilidad lo antes posible</li>
              <li>Mantenerle informado sobre el progreso de la resolución</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Mejora Continua
            </h2>
            <p className="mb-6">
              Trabajamos constantemente para mejorar la accesibilidad de nuestro
              sitio web mediante:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Auditorías regulares de accesibilidad</li>
              <li>
                Pruebas con usuarios que utilizan tecnologías de asistencia
              </li>
              <li>
                Capacitación continua de nuestro equipo en mejores prácticas de
                accesibilidad
              </li>
              <li>Actualización de tecnologías y estándares</li>
              <li>Incorporación de feedback de usuarios</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
