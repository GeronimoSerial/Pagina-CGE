'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Home,
  Newspaper,
  School,
  MessageCircle,
  FileText,
  ClipboardList,
  Building,
  Phone,
} from 'lucide-react';
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
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/tramites', label: 'Trámites', icon: ClipboardList },
  { href: '/documentacion', label: 'Documentos', icon: FileText },
  { href: '/chatbot', label: 'Chat Normativo', icon: MessageCircle },
  { href: '/escuelas', label: 'Escuelas', icon: School },
  { href: '/institucional', label: 'Institución', icon: Building },
  { href: '/contacto', label: 'Contacto', icon: Phone },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="flex justify-between items-center h-14 flex-wrap md:flex-nowrap">
          <Link
            href="/"
            className="flex items-center flex-shrink-0 min-w-0 focus:outline-none focus:ring-2 focus:ring-[#2D6628] rounded-lg p-1"
            aria-label="Ir al inicio"
          >
            <div className="relative w-9 h-9 flex-shrink-0 bg-white rounded-full border border-gray-200">
              <Image
                src="/images/logo.png"
                alt="Logo CGE"
                width={36}
                height={36}
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="ml-3 flex flex-col min-w-0 sm:max-w-[180px] md:max-w-none">
              <span className="text-sm font-semibold text-gray-600 sm:leading-tight sm:truncate">
                Consejo General de Educación
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Corrientes
              </span>
            </div>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    asChild
                    className={
                      navigationMenuTriggerStyle() +
                      (pathname === link.href ? ' bg-[#2D6628] text-white' : '')
                    }
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                        pathname === link.href
                          ? 'bg-[#2D6628] text-white'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
