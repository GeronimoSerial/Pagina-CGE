"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#noticias", label: "Noticias" },
  { href: "/tramites", label: "Trámites" },
  { href: "/documentacion", label: "Documentación" },
  { href: "/contacto", label: "Contacto" },
  { href: "/institucional", label: "Nuestra Institución" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
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
                CGE
              </span>
              <span className="block text-xs text-gray-600 md:text-sm">
                Corrientes
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-block px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#3D8B37] transition-colors"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 h-[2px] w-full scale-x-0 origin-left bg-[#3D8B37] transition-transform duration-300 group-hover:scale-x-100"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
            <Link
              href=""
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#3D8B37] hover:bg-[#2b6e28] focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2 transition-colors"
            >
             <span>Acceder a SIRE</span> 
            </Link>

          {/* Mobile Menu Button */}
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
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav>
            <ul className="flex flex-col space-y-6 text-lg">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 font-medium text-gray-700 hover:text-[#3D8B37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
