"use client";

import { parseDateString } from "@dashboard/lib/utils";

interface DaysListProps {
  title: string;
  days: string[];
}

export function DaysList({ title, days }: DaysListProps) {
  return (
    <div className="rounded-md border p-4">
      <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      {days.length ? (
        <div className="flex flex-wrap gap-2">
          {days.map((dia) => (
            <span
              key={dia}
              className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              {parseDateString(dia).toLocaleDateString("es-AR")}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Sin datos para el rango seleccionado.
        </p>
      )}
    </div>
  );
}
