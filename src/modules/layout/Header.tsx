"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tramites", label: "Trámites" },
  { href: "/documentacion", label: "Documentación" },
  { href: "/escuelas", label: "Escuelas" },
  { href: "/institucional", label: "Nuestra Institución" },
  { href: "/contacto", label: "Contacto" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrolled(scrollTop > 10);
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/60"
          : "bg-white shadow-md border-b border-gray-200"
      }`}
    >
      {/* Scroll Progress Bar */}
      {/* <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#3D8B37] via-[#4a9f42] to-[#3D8B37] transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      /> */}

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section with enhanced hover effect */}
          <Link
            href="/"
            className="group flex items-center transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-[#3D8B37]/30">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3D8B37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/images/logo.png"
                alt="CGE Logo"
                className="h-full w-full object-cover relative z-10"
                width={56}
                height={56}
                priority
              />
            </div>
            <div className="ml-4">
              <span className="block text-xl font-bold tracking-tight text-gray-800 md:text-2xl group-hover:text-[#3D8B37] transition-colors duration-300">
                CGE
              </span>
              <span className="block text-sm font-medium text-gray-600 md:text-base">
                Corrientes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clean underline style */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative inline-flex items-center py-3 text-sm font-semibold transition-all duration-300 hover:text-[#3D8B37] focus:outline-none focus:text-[#3D8B37] ${
                      pathname === link.href
                        ? "text-[#3D8B37]"
                        : "text-gray-700"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {link.label}
                    {/* Enhanced underline effect */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#3D8B37] to-[#4a9f42] transition-all duration-300 ease-out ${
                        pathname === link.href
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }`}
                    />
                    {/* Subtle glow effect on active */}
                    {pathname === link.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3D8B37] blur-sm opacity-50" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Enhanced Mobile Menu Button */}
          {mounted && (
            <button
              onClick={toggleMenu}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-[#3D8B37] focus:outline-none focus:ring-2 focus:ring-[#3D8B37]/20 focus:ring-offset-2 lg:hidden shadow-sm hover:shadow-md"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              <div className="relative h-6 w-6">
                <span
                  className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 transform bg-current transition-all duration-300 ${
                    isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 transform bg-current transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 transform bg-current transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Menu - Fixed height and scrolling */}
      {mounted && (
        <div
          className={`overflow-hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl transition-all duration-500 ease-out lg:hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-3 md:px-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <nav>
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <li
                    key={link.href}
                    className={`transform transition-all duration-500 ease-out ${
                      isMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between px-3 py-3 text-base font-semibold transition-all duration-300 hover:text-[#3D8B37] focus:outline-none focus:text-[#3D8B37] relative rounded-lg hover:bg-gray-50 ${
                        pathname === link.href
                          ? "text-[#3D8B37] bg-green-50"
                          : "text-gray-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="relative">
                        {link.label}
                        {/* Mobile underline effect */}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-[#3D8B37] transition-all duration-300 ${
                            pathname === link.href
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </span>
                      {pathname === link.href && (
                        <div className="h-2 w-2 rounded-full bg-[#3D8B37] animate-pulse" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
