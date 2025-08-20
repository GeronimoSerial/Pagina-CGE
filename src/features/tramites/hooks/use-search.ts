import { useState, useMemo, useCallback } from 'react';
import { NavSection, NavItem } from '../services/docs-data';
import { useDebounce } from '@/shared/hooks/use-debounce';


function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); 
}

interface UseSimpleSearchOptions {
  debounceMs?: number;
}

interface UseSimpleSearchResult {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  filteredSections: Array<NavSection & { filteredItems: NavItem[] }>;
  clearSearch: () => void;
  totalResults: number;
}

export function useSimpleSearch(
  sections: NavSection[],
  options: UseSimpleSearchOptions = {}
): UseSimpleSearchResult {
  const { debounceMs = 300 } = options;
  
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);
  
  const isSearching = query !== debouncedQuery;
  
  const filteredSections = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return sections.map(section => ({
        ...section,
        filteredItems: section.items,
      }));
    }
    
    const normalizedQuery = normalizeText(debouncedQuery.trim());
    const searchWords = normalizedQuery.split(/\s+/).filter(Boolean);
    
    const filteredSectionsList = sections
      .map(section => {
        const filteredItems = section.items.filter(item => {
          const normalizedItemText = normalizeText(`${item.title} ${section.title}`);
          
          return searchWords.every(word => normalizedItemText.includes(word));
        });
        
        return {
          ...section,
          filteredItems,
        };
      })
      .filter(section => section.filteredItems.length > 0);
    
    return filteredSectionsList;
  }, [sections, debouncedQuery]);
  
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);
  
  const totalResults = useMemo(() => {
    return filteredSections.reduce((total, section) => total + section.filteredItems.length, 0);
  }, [filteredSections]);
  
  return {
    query,
    setQuery,
    isSearching,
    filteredSections,
    clearSearch,
    totalResults,
  };
}


export function useSimpleSearchWithHighlighting(
  sections: NavSection[],
  options: UseSimpleSearchOptions = {}
) {
  const searchResult = useSimpleSearch(sections, options);
  
  const getHighlightedText = useCallback((item: NavItem) => {
    const query = searchResult.query.trim();
    if (!query) return item.title;
    
    const normalizedQuery = normalizeText(query);
    const searchWords = normalizedQuery.split(/\s+/).filter(Boolean);
    let highlightedText = item.title;
    
    searchWords.forEach(normalizedWord => {
      const escapedWord = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const words = item.title.split(/\s+/);
      words.forEach(word => {
        if (normalizeText(word).includes(normalizedWord)) {
          const escapedOriginalWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedOriginalWord})\\b`, 'gi');
          highlightedText = highlightedText.replace(
            regex,
            '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>'
          );
        }
      });
    });
    
    return highlightedText;
  }, [searchResult.query]);
  
  return {
    ...searchResult,
    getHighlightedText,
  };
}
