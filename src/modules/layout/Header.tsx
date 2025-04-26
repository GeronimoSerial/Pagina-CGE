'use client'

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Header = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);

const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
};

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Desktop Header */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/images/logo.png"
                alt="CGE Logo"
                className="h-full w-full object-cover"
                width={500}
                height={500}

              />
            </div>
            <div className="ml-3">
              <span className="block text-lg font-bold md:text-xl">
                Consejo General
              </span>
              <span className="block text-xs text-gray-600 md:text-sm">
                de Educación
              </span>
            </div>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              <li>
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#3D8B37] hover:bg-[#3D8B37]/10"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/institucional"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                >
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/niveles"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                >
                  Niveles
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                >
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  href="#documentacion"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          <button
            onClick={toggleMenu}
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-base font-medium text-[#3D8B37] hover:bg-[#3D8B37]/10"
                  onClick={toggleMenu}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/institucional"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  onClick={toggleMenu}
                >
                  Institucional
                </Link>
              </li>
              <li>
                <Link
                  href="/niveles"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  onClick={toggleMenu}
                >
                  Niveles
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  onClick={toggleMenu}
                >
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  onClick={toggleMenu}
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  onClick={toggleMenu}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
