'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/documentacion', label: 'Documentación' },
  { href: '/escuelas', label: 'Escuelas' },
  { href: '/chatbot', label: 'Chat Normativo' },
  { href: '/institucional', label: 'Nuestra Institución' },
  { href: '/tramites', label: 'Trámites' },
  { href: '/contacto', label: 'Contacto' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-hidden focus:ring-2 focus:ring-[#2D6628] rounded-lg p-1"
            aria-label="Ir al inicio"
            onClick={closeMenu}
          >
            <div className="relative w-10 h-10 bg-white rounded-full border border-gray-200 sm:h-12 sm:w-12">
              <Image
                src="/images/logo.png"
                alt="Logo CGE"
                width={48}
                height={48}
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="ml-3">
              <span className="block text-lg font-bold text-gray-900 sm:text-xl">
                CGE
              </span>
              <span className="block text-xs text-gray-700 sm:text-sm">
                Corrientes
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-4 xl:space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-[#205C3B] font-semibold'
                        : 'text-gray-800 hover:text-[#205C3B]'
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#205C3B] rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botón Mobile */}
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-800 rounded-md lg:hidden"
            aria-label={
              isMenuOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
            }
            aria-expanded={isMenuOpen}
          >
            <div className="flex flex-col items-center w-6">
              <span
                className={`block h-0.5 w-6 bg-current transform transition-transform ${
                  isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-0.5'
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current mt-1.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current mt-1.5 transform transition-transform ${
                  isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-0.5'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Menú Mobile */}
      </div>
      {isMenuOpen && (
        <div className="lg:hidden border-t fixed inset-x-0 bg-gray-50 top-16 border-gray-200 py-2 space-x-3">
          <nav>
            <ul className="grid grid-cols-2 gap-2 px-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block py-6 mb-6 text-md font-medium rounded-lg text-center ${
                      pathname === link.href
                        ? 'bg-linear-to-b from-[#3D8B37] to-[#2D6A27] text-white'
                        : 'text-gray-900 bg-gray-200/50'
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </a>
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
