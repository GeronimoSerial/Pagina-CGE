import { Clock, Smartphone } from "lucide-react";

export default function Contact({ basePath }: { basePath: string }) {
  const isNoticia = basePath.includes("noticias");
  return (
    <main>
      <div className="mt-8 mb-2 bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-[#3D8B37]/10 p-3 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-[#3D8B37]" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-800">
                {isNoticia ? "Sala de Prensa" : "Horario de atención"}
              </h4>
              <p className="text-gray-600 text-base">
                {isNoticia
                  ? "Atención a medios: Lunes a Viernes de 8:00 a 12:00 hs"
                  : "Lunes a Viernes de 8:00 a 12:00 hs"}
              </p>
            </div>
          </div>
          <a
            href={isNoticia
                ? "https://wa.me/5493794376025?text=Hola,%20necesito%20contactar%20a%20la%20sala%20de%20prensa.%20"
                : "https://wa.me/5493794852954?text=Hola,%20necesito%20ayuda%20con%20mi%20tr%C3%A1mite.%20Gracias!"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[#216B1D] hover:bg-[#195016] text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            {isNoticia ? "Contactar Prensa" : "Contactar Mesa de Entradas y Salidas"}
            <Smartphone className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </main>
  );
}
