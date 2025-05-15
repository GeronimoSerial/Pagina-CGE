import React from "react";
import Link from "next/link";
import { Separator } from "@components/ui/separator";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3">
                <Image
                  src="/images/logo.png"
                  alt="Logo CGE"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">
                Consejo General
                <br />
                de Educación
              </h3>
            </div>
            <p className="text-sm text-white/90">
              Trabajando por una educación pública de calidad, inclusiva y
              accesible para todos los estudiantes de la provincia.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-5 flex items-center">
              <span className="w-1 h-5 bg-white/80 mr-2 rounded-full"></span>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  title="Inicio"
                  href="/"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  title="Institucional"
                  href="/institucional"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  title="Trámites"
                  href="/tramites"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Trámites
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
                  title="Noticias"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Noticias
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-5 flex items-center">
              <span className="w-1 h-5 bg-white/80 mr-2 rounded-full"></span>
              Documentación
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  title="Licencias"
                  href="/documentacion?categoria=licencias"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Licencias
                </Link>
              </li>
              <li>
                <Link
                  title="Expedientes"
                  href="/documentacion?categoria=expedientes"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Expedientes
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=formularios"
                  title="Formularios"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Formularios
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=normativas"
                  title="Normativas"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Normativas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-5 flex items-center">
              <span className="w-1 h-5 bg-white/80 mr-2 rounded-full"></span>
              Contacto
            </h4>
            <address className="not-italic space-y-3">
              <p className="text-sm text-white/80 flex items-center">
                <a
                  href="https://www.google.com/maps?q=Consejo+General+de+Educación+Corrientes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  title="Ver en Google Maps"
                >
                  <MapPin size={16} className="mr-2 text-white/70" />
                  Calle Catamarca 640, Corrientes Capital
                </a>
              </p>
              <p className="text-sm text-white/80 flex items-center">
                <a
                  href="mailto:cge@mec.gob.ar?subject=Consulta&body=Hola, me gustaría realizar una consulta..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  title="Enviar un correo electrónico"
                >
                  <Mail size={16} className="mr-2 text-white/70" />
                  cge@mec.gob.ar
                </a>
              </p>
              <p className="text-sm text-white/80 flex items-center">
                <Phone size={16} className="mr-2 text-white/70" />
                <a
                  title="Enviar un mensaje por WhatsApp"
                  href="https://wa.me/5403794424264?text=Hola%2C%20me%20comunico%20con%20el%20Consejo%20para%20realizar%20una%20consulta.%20Agradecer%C3%ADa%20su%20orientaci%C3%B3n.%20Muchas%20gracias.
"
                >
                  +54 (379) 442-4264
                </a>
              </p>
            </address>
          </div>
        </div>
        <Separator className="my-10 bg-white/20" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/70">
            © 2025 Consejo General de Educación.{" "}
            <Link
              href="https://www.mec.gob.ar/"
              title="Ministerio de Educación"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:underline"
            >
              {" "}
              Ministerio de Educación.
            </Link>{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              title="Gobierno de la Provincia de Corrientes"
              href="https://www.corrientes.gob.ar/"
              className="text-white no-underline hover:underline"
            >
              Gobierno de la Provincia de Corrientes.
            </Link>
          </p>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a
              href="https://facebook.com/ConsejoGeneralEducacion"
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com/consejogeneral"
              title="Instagram"
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-6 gap-2">
          <Link
            href="/accesibilidad"
            className="text-xs text-white/70 hover:text-white underline transition-colors mx-2"
            title="Accesibilidad"
          >
            Accesibilidad
          </Link>
          <span className="hidden md:inline text-white/40">|</span>
          <Link
            href="/terminos"
            title="Términos de uso"
            className="text-xs text-white/70 hover:text-white underline transition-colors mx-2"
          >
            Términos de uso
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
