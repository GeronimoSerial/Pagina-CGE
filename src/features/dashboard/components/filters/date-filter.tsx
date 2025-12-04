'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/shared/ui/button';

interface DateFilterProps {
  defaultStart: string;
  defaultEnd: string;
}

function getDefaultRange() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstOfMonth.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10),
  };
}

export function DateFilter({ defaultStart, defaultEnd }: DateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get('start') as string;
    const end = formData.get('end') as string;

    const params = new URLSearchParams(searchParams.toString());
    if (start) params.set('start', start);
    if (end) params.set('end', end);

    router.push(pathname + '?' + params.toString());
  };

  return (
    <form className="flex flex-wrap items-end gap-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="start" className="text-sm font-medium">
          Desde
        </label>
        <input
          id="start"
          name="start"
          type="date"
          defaultValue={searchParams.get('start') ?? defaultStart}
          className="mt-1 rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="end" className="text-sm font-medium">
          Hasta
        </label>
        <input
          id="end"
          name="end"
          type="date"
          defaultValue={searchParams.get('end') ?? defaultEnd}
          className="mt-1 rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <Button
        type="submit"
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Actualizar
      </Button>
    </form>
  );
}
