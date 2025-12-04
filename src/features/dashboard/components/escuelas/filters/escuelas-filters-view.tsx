'use client';

import { useRef, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { IconSearch, IconX } from '@tabler/icons-react';

interface FilterOption {
  label: string;
  value: string;
}

interface EscuelasFiltersViewProps {
  modalidades: FilterOption[];
  zonas: FilterOption[];
  categorias: FilterOption[];
  departamentos: FilterOption[];
  supervisores: FilterOption[];
}

export function EscuelasFiltersView({
  modalidades,
  zonas,
  categorias,
  departamentos,
  supervisores,
}: EscuelasFiltersViewProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (term: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('q', term);
        } else {
          params.delete('q');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
      }, 300);
    },
    [searchParams, pathname, replace],
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    replace(pathname);
  };

  const hasActiveFilters =
    searchParams.has('q') ||
    searchParams.has('modalidad') ||
    searchParams.has('zona') ||
    searchParams.has('categoria') ||
    searchParams.has('departamento') ||
    searchParams.has('supervisor');

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o CUE..."
            className="pl-8"
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-10 px-2 lg:px-3"
          >
            Limpiar filtros
            <IconX className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Select
          defaultValue={searchParams.get('modalidad')?.toString()}
          onValueChange={(val) => handleFilterChange('modalidad', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Modalidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {modalidades.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get('zona')?.toString()}
          onValueChange={(val) => handleFilterChange('zona', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Zona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {zonas.map((z) => (
              <SelectItem key={z.value} value={z.value}>
                {z.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get('categoria')?.toString()}
          onValueChange={(val) => handleFilterChange('categoria', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get('departamento')?.toString()}
          onValueChange={(val) => handleFilterChange('departamento', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {departamentos.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get('supervisor')?.toString()}
          onValueChange={(val) => handleFilterChange('supervisor', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {supervisores.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
