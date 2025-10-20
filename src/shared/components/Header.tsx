'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shared/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/escuelas', label: 'Escuelas' },
  { href: '/chatbot', label: 'Chat Normativo' },
  { href: '/documentacion', label: 'Documentación' },
  { href: '/tramites', label: 'Trámites' },
  { href: '/institucional', label: 'Institución' },
  { href: '/contacto', label: 'Contacto' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="flex justify-between items-center h-14">
          <Link
            href="/"
            className="flex items-center focus:outline-hidden focus:ring-2 focus:ring-[#2D6628] rounded-lg p-1"
            aria-label="Ir al inicio - Consejo General de Educación de Corrientes"
          >
            <div className="relative w-9 h-9 bg-white rounded-full border border-gray-200">
              <Image
                src="/images/logo.png"
                alt="Logo CGE"
                width={36}
                height={36}
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-sm font-semibold text-gray-600">
                Consejo General de Educación
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Corrientes
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={pathname === link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Menú Mobile */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] bg-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left">Navegación</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      pathname === link.href
                        ? 'bg-[#2D6628] text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
