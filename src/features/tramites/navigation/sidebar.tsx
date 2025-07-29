'use client';

import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Paperclip,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavSection } from '../services/docs-data';

interface SidebarProps {
  sections: NavSection[];
  onLinkClick?: () => void;
}

export function Sidebar({ sections, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const currentSlug = pathname.split('/')[2] || '';

  const [openSection, setOpenSection] = useState<string | null>(() => {
    const found = sections.find((section) =>
      section.items.some((item) => item.id === currentSlug),
    );
    return found ? found.id : null;
  });

  const handleToggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-y-auto bg-white">
      <div className="lg:p-4">
        {/* Logo/Title - Visible solo en desktop */}
        <div className="mb-8 hidden lg:block">
          <h2 className="text-2xl font-bold text-gray-900">
            Consejo General de Educación
          </h2>
          <p className="mt-1 text-sm text-gray-600">Guía de Trámites</p>
        </div>
        {/* Page Navigation */}
        <nav className="mb-6 space-y-1">
          <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-900 uppercase">
            Categorías
          </h3>
          {sections.map((section: NavSection) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(section.id)}
                  className={`w-full flex items-center justify-between px-2 py-2  rounded-lg text-left transition-all duration-200 group
        ${isOpen ? 'text-[#3D8B37] bg-green-50 border-l-4 border-[#265323]' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-lg font-semibold flex-1 min-w-0 break-words"
                    title={section.title}
                  >
                    {section.title}
                  </span>
                  <ChevronDown
                    className={`flex-shrink-0 h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && section.items.length > 0 && (
                  <div className="py-1 pl-3 space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onLinkClick}
                        prefetch={true}
                        className={`flex  items-center text-sm rounded px-2 py-1 transition-colors group
              ${currentSlug === item.id ? 'bg-[#3D8B37] border-l-4 rounded-l-xl mt-3 text-white font-semibold' : 'text-gray-600 hover:text-[#3D8B37] hover:bg-green-50'}`}
                      >
                        <span
                          className="flex-1 py-2 break-words"
                          title={item.title}
                        >
                          {item.title}
                        </span>
                        <ChevronRight className="flex-shrink-0 w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100 ml-1" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Documentos descargables */}
        <div className="pt-6 mt-8 border-t border-gray-200">
          <div className="space-y-2">
            <Link
              href="/documentacion"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-green-700 "
            >
              <Paperclip className="mr-2 w-4 h-4" />
              Documentos descargables
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-6 mt-16 border-t border-gray-200">
          <div className="space-y-2">
            <a
              href="https://mec.gob.ar"
              className="flex items-center text-xs text-gray-600 transition-colors hover:text-gray-900"
            >
              <ExternalLink className="mr-2 w-4 h-4" />
              Ministerio de Educación de Corrientes
            </a>
            <a
              href="https://ge.mec.gob.ar"
              className="flex items-center text-xs text-gray-600 transition-colors hover:text-gray-900"
            >
              <ExternalLink className="mr-2 w-4 h-4" />
              Gestión Educativa
            </a>
            <a
              href="https://corrientes.gob.ar"
              className="flex items-center text-xs text-gray-600 transition-colors hover:text-gray-900"
            >
              <ExternalLink className="mr-2 w-4 h-4" />
              Gobierno de Corrientes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
