import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (cat: string) => void;
  allLabel?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  allLabel = 'Todas',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full space-y-3">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder || 'Buscar...'}
          className={`w-full pl-10 bg-white border-2 border-gray-300 rounded-xl py-2.5 px-4 
            focus:outline-hidden focus:ring-2 focus:ring-[#3D8B37]/30 focus:border-[#3D8B37] 
            transition-all duration-200 ease-in-out text-sm placeholder:text-gray-500 
            hover:border-[#3D8B37] shadow-xs ${className || ''}`}
          value={value}
          onChange={onChange}
        />
      </div>

      {categories.length > 0 && onCategoryChange && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 border
              ${
                !selectedCategory
                  ? 'bg-[#216B1D] hover:bg-[#195016] text-white border-transparent font-medium shadow-md'
                  : 'text-gray-700 border-gray-200 bg-white hover:border-[#3D8B37] hover:text-[#3D8B37] hover:bg-[#3D8B37]/10 shadow-xs'
              }`}
            onClick={() => onCategoryChange('')}
          >
            {allLabel}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 border
                ${
                  selectedCategory === cat
                    ? 'bg-[#205C3B] border-transparent text-white font-medium shadow-md hover:bg-[#194931]'
                    : 'text-gray-800 border-gray-200 bg-white hover:border-[#205C3B] hover:text-[#205C3B] hover:bg-[#205C3B]/10 shadow-xs'
                }`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
