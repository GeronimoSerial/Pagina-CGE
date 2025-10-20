'use client';

import { Sidebar } from './sidebar';
import { MobileMenu } from './mobile-menu';
import type { NavSection } from '../services/docs-data';

export function ResponsiveNav({ sections }: { sections: NavSection[] }) {
  return (
    <>
      {/* El componente MobileMenu solo se muestra en pantallas <lg */}
      <MobileMenu sections={sections} />

      <aside className="hidden lg:block sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-white border-r border-gray-200 overflow-y-auto">
        <Sidebar sections={sections} />
      </aside>
    </>
  );
}
