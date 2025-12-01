"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { MesDisponible } from "@dashboard/lib/types";
import { translateMonthName } from "@dashboard/lib/utils";

interface MonthSelectorProps {
  meses: MesDisponible[];
  currentMes: string;
}

export function MonthSelector({ meses, currentMes }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentMes} onValueChange={handleChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Seleccionar mes" />
      </SelectTrigger>
      <SelectContent>
        {meses.map((m) => (
          <SelectItem key={m.mes} value={m.mes}>
            {translateMonthName(m.mes_nombre)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
