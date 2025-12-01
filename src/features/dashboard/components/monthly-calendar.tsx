"use client";

import * as React from "react";
import { cn } from "@dashboard/lib/utils";

interface MonthlyCalendarProps {
  year: number;
  month: number; // 0-indexed (0 = January)
  presentDays: string[]; // Array of date strings "YYYY-MM-DD"
  absentDays: string[]; // Array of date strings "YYYY-MM-DD"
  holidays?: string[]; // Array of date strings "YYYY-MM-DD"
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Normaliza una fecha a formato YYYY-MM-DD
function normalizeDate(dateStr: string): string {
  // Tomar solo los primeros 10 caracteres (YYYY-MM-DD)
  const trimmed = dateStr.trim().slice(0, 10);
  return trimmed;
}

export function MonthlyCalendar({
  year,
  month,
  presentDays,
  absentDays,
  holidays = [],
}: MonthlyCalendarProps) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Normalizar todas las fechas para comparación consistente
  const presentSet = new Set(presentDays.map(normalizeDate));
  const absentSet = new Set(absentDays.map(normalizeDate));
  const holidaySet = new Set(holidays.map(normalizeDate));

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture = dateStr > todayStr;
    const isHoliday = holidaySet.has(dateStr);
    const isPresent = presentSet.has(dateStr);
    const isAbsent = absentSet.has(dateStr);
    const isToday = dateStr === todayStr;

    return {
      dateStr,
      isWeekend,
      isFuture,
      isHoliday,
      isPresent,
      isAbsent,
      isToday,
    };
  };

  const renderDay = (day: number) => {
    const { isWeekend, isFuture, isHoliday, isPresent, isAbsent, isToday } =
      getDayStatus(day);

    let bgClass = "bg-muted/30"; // default - no data
    let textClass = "text-muted-foreground";

    if (isFuture) {
      bgClass = "bg-transparent";
      textClass = "text-muted-foreground/50";
    } else if (isHoliday) {
      bgClass = "bg-blue-100 dark:bg-blue-900/30";
      textClass = "text-blue-700 dark:text-blue-300";
    } else if (isWeekend) {
      bgClass = "bg-slate-100 dark:bg-slate-800/50";
      textClass = "text-slate-500";
    } else if (isPresent) {
      bgClass = "bg-green-100 dark:bg-green-900/30";
      textClass = "text-green-700 dark:text-green-300";
    } else if (isAbsent) {
      bgClass = "bg-red-100 dark:bg-red-900/30";
      textClass = "text-red-700 dark:text-red-300";
    }

    return (
      <div
        key={day}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
          bgClass,
          textClass,
          isToday && "ring-2 ring-primary ring-offset-1"
        )}
      >
        {day}
      </div>
    );
  };

  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="h-9 w-9" />
  ));

  const monthDays = Array.from({ length: daysInMonth }, (_, i) =>
    renderDay(i + 1)
  );

  const monthName = firstDayOfMonth.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-center text-lg font-semibold capitalize">
        {monthName}
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="flex h-9 w-9 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {emptyDays}
        {monthDays}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-900/30" />
          <span>Presente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-red-100 dark:bg-red-900/30" />
          <span>Ausente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800/50" />
          <span>Fin de semana</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-900/30" />
          <span>Feriado</span>
        </div>
      </div>
    </div>
  );
}
