import Image from "next/image";

export default function Institucional() {
  return (
    <section
      id="institucional"
      className="py-16 bg-gradient-to-b from-white via-gray-50 to-white"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Título principal */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-[#205C3B] mb-4">
            Nuestra Institución
          </h2>
          <p className="text-gray-600 text-lg">
            Fundación, historia y funciones
          </p>
        </div>

        {/* Imagen destacada con superposición */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-16 group">
          <div className="absolute inset-0 bg-gray-200 animate-pulse skeleton pointer-events-none" />
          <Image
            src="/images/header-noticias.webp"
            alt="Consejo General de Educación"
            className="object-cover w-full h-full z-10"
            width={1080}
            height={720}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
        </div>

        {/* Historia */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-[#205C3B] mb-6 flex items-center">
            <span className="inline-block w-1.5 h-8 bg-[#217A4B] mr-4 rounded-full"></span>
            Historia del CGE
          </h3>
          <div className="space-y-6 text-gray-700 text-base leading-relaxed">
            <p>
              La provincia de Corrientes fue pionera en organizar la educación
              pública. En abril de 1853 se sancionó en la provincia la primera
              Ley de Educación (la primera del país). Posteriormente, el 14 de
              diciembre de 1875 se aprobó un nuevo sistema educativo provincial
              en el cual apareció por primera vez el "Consejo General de
              Educación".
            </p>
            <p>
              En la Constitución provincial de 1889 ya se estableció
              oficialmente su estructura (un director y varios vocales). El CGE
              nació así para centralizar la gestión de la educación inicial y
              primaria en un órgano especializado.
            </p>
            <p>
              En 2007 fue suprimido, pero en 2011 fue restituido por decreto
              como un organismo clave para la descentralización del sistema
              educativo, y actualmente funciona bajo la órbita del Ministerio de
              Educación de Corrientes.
            </p>
          </div>
        </div>

        {/* Funciones */}
        <div>
          <h3 className="text-2xl font-semibold text-[#205C3B] mb-8 flex items-center">
            <span className="inline-block w-1.5 h-8 bg-[#217A4B] mr-4 rounded-full"></span>
            Funciones actuales
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Planificación y supervisión educativa",
                text: "Planifica y dirige la implementación de políticas y programas para el nivel inicial y primario. Organiza y supervisa la gestión escolar.",
              },
              {
                title: "Mejoramiento del aprendizaje",
                text: "Brinda apoyo permanente a las escuelas y capacita a docentes en nuevos enfoques pedagógicos.",
              },
              {
                title: "Inclusión y prevención del abandono",
                text: "Desarrolla estrategias para reducir la deserción escolar, promoviendo la lectura, bibliotecas y tecnologías didácticas.",
              },
              {
                title: "Investigación y redes pedagógicas",
                text: "Fomenta la investigación en aulas e impulsa redes interinstitucionales que vinculan docentes, escuelas y comunidad.",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#217A4B] hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="font-semibold text-lg text-[#217A4B] mb-3">
                  {card.title}
                </h4>
                <p className="text-gray-700 text-base">{card.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-gray-700 text-base bg-gray-50 p-6 rounded-xl border-l-4 border-[#217A4B]">
            En conjunto, estas funciones actuales reflejan el rol del CGE como
            autoridad de gestión de la enseñanza inicial y primaria en
            Corrientes, coordinación pedagógica y apoyo institucional a las
            escuelas provinciales.
          </p>
        </div>
      </div>
    </section>
  );
}
