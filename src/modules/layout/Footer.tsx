import React from "react";
import Link from "next/link";
import { Separator } from "../../components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-[#3D8B37] text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              Consejo General de Educación
            </h3>
            <p className="text-sm opacity-80">
              Trabajando por una educación pública de calidad
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-80 hover:opacity-100">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/institucional"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/niveles"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Niveles Educativos
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Noticias
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Documentación</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/documentacion?categoria=licencias"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Licencias
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=expedientes"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Expedientes
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=formularios"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Formularios
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion?categoria=normativas"
                  className="text-sm opacity-80 hover:opacity-100"
                >
                  Normativas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contacto</h4>
            <address className="not-italic">
              <p className="text-sm opacity-80 mb-1">Calle Principal 123</p>
              <p className="text-sm opacity-80 mb-1">Corrientes, Argentina</p>
              <p className="text-sm opacity-80 mb-1">contacto@cge.gov.ar</p>
              <p className="text-sm opacity-80">+54 (379) 123-4567</p>
            </address>
          </div>
        </div>
        <Separator className="my-8 bg-white/20" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-70">
            © 2023 Consejo General de Educación. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-white opacity-70 hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-white opacity-70 hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="text-white opacity-70 hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="text-white opacity-70 hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
