import Image from "next/image";

export default function Institucional() {
  return (
    <section id="institucional" className="py-10 from-white to-gray-50 my-6">
      {/* <div className="container mx-auto px-1 max-w-4xl"> */}
      {/* Encabezado con estilo moderno */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Nuestra institución</h2>
          <p className="text-gray-700 max-w-3xl">
            Fundación, historia y funciones
          </p>
        </div>

        {/* Imagen destacada */}
        <div className="relative h-80 rounded-xl overflow-hidden shadow-lg mb-12">
          <Image
            src="/images/header-noticias.webp"
            alt="Consejo General de Educación"
            className="object-cover w-full h-full"
            width={1080}
            height={720}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Historia - Con diseño moderno */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#205C3B] mb-6 flex items-center">
            <span className="inline-block w-1 h-8 bg-[#217A4B] mr-3 rounded-full"></span>
            Historia del CGE
          </h3>
          <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              La provincia de Corrientes fue pionera en organizar la educación
              pública. En abril de 1853 se sancionó en la provincia la primera
              Ley de Educación (la primera del país). Posteriormente, el 14 de
              diciembre de 1875 se aprobó un nuevo sistema educativo provincial
              en el cual apareció por primera vez el "Consejo General de
              Educación". En la Constitución provincial de 1889 ya se estableció
              oficialmente su estructura (un director y varios vocales). El CGE
              nació así para centralizar la gestión de la educación inicial y
              primaria en un órgano especializado.
            </p>
            <p>
              Con el paso del tiempo este organismo cobró importancia en la
              descentralización educativa. Por ejemplo, las autoridades
              provinciales posteriores destacaron que la reapertura del CGE en
              2011 representó "la restitución de un organismo clave para la
              Educación Inicial y Primaria" y un paso hacia la descentralización
              del sistema educativo correntino. Tras subsistir más de un siglo,
              el Consejo fue suprimido en la reforma constitucional de 2007
              (sustituido por una Dirección General de Educación Inicial,
              Primaria y Especial). Sin embargo, por decreto gubernamental fue
              restituido en 2011, y actualmente funciona bajo la órbita del
              Ministerio de Educación de Corrientes.
            </p>
          </div>
        </div>

        {/* Funciones actuales - Con tarjetas modernas */}
        <div>
          <h3 className="text-2xl font-semibold text-[#205C3B] mb-8 flex items-center">
            <span className="inline-block w-1 h-8 bg-[#217A4B] mr-3 rounded-full"></span>
            Funciones actuales
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tarjeta 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#217A4B] hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-lg text-[#217A4B] mb-3">
                Planificación y supervisión educativa
              </h4>
              <p className="text-gray-700">
                Planifica y dirige la implementación de las políticas, planes y
                programas provinciales y nacionales para el nivel inicial y
                primario. Organiza y supervisa la gestión escolar en estos
                niveles.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#217A4B] hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-lg text-[#217A4B] mb-3">
                Mejoramiento del aprendizaje
              </h4>
              <p className="text-gray-700">
                Orienta el perfeccionamiento de los procesos de
                enseñanza-aprendizaje, brindando apoyo permanente a las
                escuelas. Ofrece capacitaciones a directivos y docentes en
                nuevos enfoques teóricos y metodológicos.
              </p>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#217A4B] hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-lg text-[#217A4B] mb-3">
                Inclusión y prevención del abandono
              </h4>
              <p className="text-gray-700">
                Diseña e implementa estrategias para reducir la repitencia y
                deserción escolar, atendiendo a las poblaciones más vulnerables.
                Promueve además el gusto por la lectura y el uso de bibliotecas
                y tecnologías didácticas.
              </p>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#217A4B] hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-lg text-[#217A4B] mb-3">
                Investigación y redes pedagógicas
              </h4>
              <p className="text-gray-700">
                Impulsa la investigación educativa desde las aulas para innovar
                metodologías y facilita la conformación de redes de trabajo
                interinstitucionales que vinculan escuelas, supervisores,
                docentes y la comunidad.
              </p>
            </div>
          </div>

          <p className="mt-10 text-gray-700 text-lg bg-gray-50 p-5 rounded-lg border-l-4 border-[#217A4B]">
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
