'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './sidebar';
import type { NavSection } from '../services/docs-data';

interface MobileMenuProps {
  sections: NavSection[];
}

export function MobileMenu({ sections }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Consejo General de Educación
            </h2>
            <p className="text-sm text-gray-600">Guía de Trámites</p>
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md transition-colors hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden mt-5 pt-24 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar sections={sections} onLinkClick={closeMenu} />
      </aside>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
