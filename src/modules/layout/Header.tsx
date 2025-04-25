import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80"
              alt="CGE Logo"
              className="h-10 w-auto"
            />
            <span className="ml-2 text-lg font-semibold text-[#3D8B37] hidden md:inline">
              Consejo General de Educación
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#3D8B37] hover:text-[#2D6A27]"
          >
            Inicio
          </Link>
          <Link
            href="/institucional"
            className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
          >
            Institucional
          </Link>
          <Link
            href="/niveles"
            className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
          >
            Niveles
          </Link>
          <Link
            href="/noticias"
            className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
          >
            Noticias
          </Link>
          <Link
            href="/documentacion"
            className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
          >
            Documentación
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium text-gray-700 hover:text-[#3D8B37]"
          >
            Contacto
          </Link>
        </nav>
        <button className="md:hidden p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
