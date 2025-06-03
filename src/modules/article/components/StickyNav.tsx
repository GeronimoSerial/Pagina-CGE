// components/StickyNavbar.tsx
"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";

interface StickyNavbarProps {
  sectionTitle: string;
  section: string;
  postTitle: string;
  children?: React.ReactNode; // Para el ShareButton
}

export default function StickyNavbar({
  sectionTitle,
  section,
  postTitle,
  children,
}: StickyNavbarProps) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Buscar el elemento h1 en el DOM
      const titleElement = document.querySelector("article h1");
      if (titleElement) {
        const rect = titleElement.getBoundingClientRect();
        // Mostrar título cuando el h1 ya no esté visible
        setShowTitle(rect.bottom < 80);
      }
    };

    // Throttle del scroll para mejor rendimiento
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null as any;
      }, 16); // ~60fps
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Ejecutar una vez al cargar
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <Link href={`/${section}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver a {sectionTitle.toLowerCase()}
              </Button>
            </Link>

            {/* Título que aparece con animación cuando se hace scroll */}
            <div
              className={`
              ml-4 transition-all duration-300 ease-in-out overflow-hidden flex-1 min-w-0
              ${showTitle ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}
            `}
            >
              <div className="border-l border-gray-300 pl-4">
                <h2 className="text-sm font-medium text-gray-900 truncate">
                  {postTitle}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
