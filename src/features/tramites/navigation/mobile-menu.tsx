'use client';

import { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';
import Link from 'next/link';
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
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-white border-b border-gray-200 lg:hidden shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Consejo General de Educación
            </h2>
            <p className="text-xs text-gray-600">Guía de Trámites</p>
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
          lg:hidden bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ paddingTop: '80px' }}
      >
        <div className="p-4">
          <div className="mb-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center p-2  rounded-lg text-green-700 hover:bg-green-100 transition-colors"
            >
              <Home className="mr-2" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
          </div>

          <div className="block" style={{ display: 'block' }}>
            <Sidebar sections={sections} onLinkClick={closeMenu} />
          </div>
        </div>
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
