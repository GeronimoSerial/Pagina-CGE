import { Clock, Smartphone } from "lucide-react";

export default function Contact({ basePath }: { basePath: string }) {
  const isNoticia = basePath.includes("noticias");
  return (
    <main>
      <div className="mt-16 mb-3 bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-[#3D8B37]/10 p-4 rounded-xl mr-5">
              <Clock className="h-8 w-8 text-[#3D8B37]" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-800">
                {isNoticia ? "Sala de Prensa" : "Horario de atención"}
              </h4>
              <p className="text-gray-600 text-lg">
                {isNoticia
                  ? "Atención a medios: Lunes a Viernes de 8:00 a 12:00 hs"
                  : "Lunes a Viernes de 8:00 a 12:00 hs"}
              </p>
            </div>
          </div>
          <a
            href={
              isNoticia
                ? "https://wa.me/5493794376025?text=Hola,%20necesito%20contactar%20a%20la%20sala%20de%20prensa.%20"
                : "https://wa.me/5493794852954?text=Hola,%20necesito%20ayuda%20con%20mi%20tr%C3%A1mite.%20Gracias!"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            {isNoticia
              ? "Contactar Prensa"
              : "Contactar Mesa de Entradas y Salidas"}
            <Smartphone className="h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </main>
  );
}
