'use client';

import { ExternalLink, Paperclip, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { NavSection } from '../services/docs-data';
import { Section } from './section-item';
import { useSimpleSearchWithHighlighting } from '../hooks/use-search';

interface SidebarProps {
  sections: NavSection[];
  onLinkClick?: () => void;
}

export function Sidebar({ sections = [], onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/')[2] || '';

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const found = sections.find((section) =>
      section.items.some((item) => item.id === currentSlug),
    );
    return new Set(found ? [found.id] : []);
  });

  const firstResultRef = useRef<HTMLDivElement>(null);

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    filteredSections,
    clearSearch: clearSearchQuery,
    totalResults,
    getHighlightedText,
  } = useSimpleSearchWithHighlighting(sections, { debounceMs: 200 });


  const sectionsWithResults = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    return new Set(filteredSections.map((section: any) => section.id));
  }, [searchQuery, filteredSections]);


  useEffect(() => {
    if (searchQuery.trim() && sectionsWithResults.size > 0) {
      setOpenSections(sectionsWithResults);

      const timeoutId = setTimeout(() => {
        if (firstResultRef.current) {
          firstResultRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [sectionsWithResults, searchQuery]);

  const handleToggle = useCallback((id: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="mb-4 hidden lg:block">
          <h2 className="text-xl font-bold text-gray-900">
            Consejo General de Educación
          </h2>
          <p className="text-sm text-gray-600">Guía de Trámites</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar trámites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300
              bg-gray-50 text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200
            "
            aria-label="Buscar trámites"
          />
          {searchQuery && (
            <button
              onClick={clearSearchQuery}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-300 hover:scrollbar-thumb-blue-400">
        <div className="p-4">
          <nav
            className="space-y-2"
            role="navigation"
            aria-label="Categorías de trámites"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Categorías{' '}
              {searchQuery && (
                <span className="text-blue-600">
                  ({totalResults} resultados)
                </span>
              )}
            </h3>

            {filteredSections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No se encontraron resultados</p>
                <p className="text-xs mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            ) : (
              filteredSections.map((section: any, index: number) => (
                <div
                  key={section.id}
                  ref={index === 0 && searchQuery ? firstResultRef : null}
                >
                  <Section
                    section={section}
                    isOpen={openSections.has(section.id)}
                    onToggle={handleToggle}
                    currentSlug={currentSlug}
                    onLinkClick={onLinkClick}
                    filteredItems={section.filteredItems}
                    getHighlightedText={getHighlightedText}
                  />
                </div>
              ))
            )}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-6">
            <div>
              <Link
                href="/documentacion"
                className="
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  text-gray-700 hover:bg-gray-100 hover:text-blue-600
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                "
              >
                <Paperclip className="w-4 h-4 flex-shrink-0" />
                <span>Documentos descargables</span>
              </Link>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                Enlaces externos
              </h4>
              {[
                {
                  href: 'https://mec.gob.ar',
                  title: 'Ministerio de Educación de Corrientes',
                },
                { href: 'https://ge.mec.gob.ar', title: 'Gestión Educativa' },
                {
                  href: 'https://corrientes.gob.ar',
                  title: 'Gobierno de Corrientes',
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-3 px-3 py-2 rounded-lg text-xs
                    text-gray-600 hover:bg-gray-100 hover:text-blue-600
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  "
                >
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
