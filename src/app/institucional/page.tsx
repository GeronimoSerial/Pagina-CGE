import Image from "next/image";

export default function Institucional() {
  return (
    // Sección Institucional
    <section id="institucional" className="py-16 rounded-2xl shadow-md mx-2 md:mx-0 my-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-[#217A4B]">Quiénes Somos</h2>
            <div className="space-y-5 text-gray-700 text-lg leading-relaxed mb-6">
              <p>
                En el Consejo General de Educación trabajamos para planificar, conducir y ejecutar la política educativa de la provincia, alineados con los lineamientos del Ministerio de Educación. Nuestra labor se centra en la organización, administración y supervisión de la enseñanza en los niveles inicial y primario, incluyendo sus diversas modalidades: <span className="font-semibold text-[#217A4B]">Educación de Adultos, Educación Especial, Domiciliaria y Hospitalaria, y planes de alfabetización</span>.
              </p>
              <p>
                Conducimos y coordinamos la aplicación del Proyecto Educativo definido para estos niveles, con el firme propósito de mejorar los procesos de enseñanza y aprendizaje, promover el desarrollo integral de niños y niñas, y fomentar una educación en valores que les permita comprender y transformar su entorno.
              </p>
              <p>
                Acompañamos a las instituciones escolares mediante planes, programas y estrategias pedagógicas que buscan reducir la repitencia y deserción, fortalecer el rol docente, promover la lectura, integrar la tecnología en el aula y atender a las poblaciones más vulnerables. También impulsamos la formación continua de docentes y directivos, la investigación pedagógica desde las aulas, y la articulación con otras áreas del sistema educativo.
              </p>
              <p>
                Nuestro compromiso es garantizar una educación inclusiva, equitativa y de calidad, a través del trabajo en red, la evaluación constante de nuestras prácticas y el cumplimiento riguroso de las normativas vigentes.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center text-[#217A4B] font-semibold hover:underline hover:text-[#205C3B] transition-colors mt-2"
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
  );
}