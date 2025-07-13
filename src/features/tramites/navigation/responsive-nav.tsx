'use client';

import { Sidebar } from './sidebar';
import { MobileMenu } from './mobile-menu';
import type { NavSection } from '../services/docs-data';

export function ResponsiveNav({ sections }: { sections: NavSection[] }) {
  return (
    <>
      {/* El componente MobileMenu solo se muestra en pantallas <lg */}
      <MobileMenu sections={sections} />

      {/* Contenedor para la versión de escritorio del sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200">
        <Sidebar sections={sections} />
      </aside>
    </>
  );
}
