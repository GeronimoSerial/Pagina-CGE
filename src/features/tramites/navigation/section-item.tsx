import { ChevronRight, ChevronDown } from 'lucide-react';
import { memo, useCallback } from 'react';
import { NavSection } from '../services/docs-data';
import Link from 'next/link';

export const SectionItem = memo(
  ({
    item,
    currentSlug,
    onLinkClick,
    getHighlightedText,
  }: {
    item: any;
    currentSlug: string;
    onLinkClick?: () => void;
    getHighlightedText?: (item: any) => string;
  }) => {
    const isActive = currentSlug === item.id;

    return (
      <Link
        href={item.href}
        onClick={onLinkClick}
        prefetch={true}
        className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 
        ${
          isActive
            ? 'bg-green-800 text-white shadow-md'
            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
        }
      `}
        aria-current={isActive ? 'page' : undefined}
      >
        <ChevronRight
          className={`
          w-4 h-4 transition-transform duration-200 flex-shrink-0
          ${isActive ? 'text-white' : 'text-gray-400'}
        `}
        />
        <span
          className="flex-1"
          title={item.title}
          dangerouslySetInnerHTML={{
            __html: getHighlightedText ? getHighlightedText(item) : item.title,
          }}
        />
      </Link>
    );
  },
);

SectionItem.displayName = 'SectionItem';

export const Section = memo(
  ({
    section,
    isOpen,
    onToggle,
    currentSlug,
    onLinkClick,
    filteredItems,
    getHighlightedText,
  }: {
    section: NavSection;
    isOpen: boolean;
    onToggle: (id: string) => void;
    currentSlug: string;
    onLinkClick?: () => void;
    filteredItems: any[];
    getHighlightedText?: (item: any) => string;
  }) => {
    const handleToggle = useCallback(() => {
      onToggle(section.id);
    }, [section.id, onToggle]);

    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={handleToggle}
          className={`
          w-full flex items-center justify-between px-3 py-3 rounded-lg text-left
          transition-all duration-200 ease-in-out group
          focus:outline-none focus:ring-2 focus:ring-transparent
          ${
            isOpen
              ? 'bg-green-50 text-green-800 border-l-4 border-green-600'
              : 'text-gray-800 hover:bg-gray-100 '
          }
        `}
          aria-expanded={isOpen}
          aria-controls={`section-${section.id}`}
        >
          <span className="font-semibold text-sm flex-1" title={section.title}>
            {section.title}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {isOpen && filteredItems.length > 0 && (
          <div
            id={`section-${section.id}`}
            className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200"
          >
            {filteredItems.map((item) => (
              <SectionItem
                key={item.id}
                item={item}
                currentSlug={currentSlug}
                onLinkClick={onLinkClick}
                getHighlightedText={getHighlightedText}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Section.displayName = 'Section';
