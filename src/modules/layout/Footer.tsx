import React from "react";
import Link from "next/link";
import { Separator } from "../../components/ui/separator";
import { Facebook, Instagram, Mail, MapPin, Phone,  } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="text-[#3D8B37] font-bold text-lg">CGE</span>
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
                  href="/"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/institucional"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Documentacion Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
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
                  href="/documentacion?categoria=licencias"
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Licencias
                </Link>
              </li>
              <li>
                <Link
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
                  className="text-sm text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                  Formularios
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=normativas"
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
                <MapPin size={16} className="mr-2 text-white/70" />
                Calle Principal 123, Corrientes
              </p>
              <p className="text-sm text-white/80 flex items-center">
                <Mail size={16} className="mr-2 text-white/70" />
                contacto@cge.gov.ar
              </p>
              <p className="text-sm text-white/80 flex items-center">
                <Phone size={16} className="mr-2 text-white/70" />
                +54 (379) 123-4567
              </p>
            </address>
          </div>
        </div>
        <Separator className="my-10 bg-white/20" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/70">
            © 2023 Consejo General de Educación. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
