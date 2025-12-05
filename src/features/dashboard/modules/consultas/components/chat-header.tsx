'use client';

import { IconRobot } from '@tabler/icons-react';

export function ChatHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <IconRobot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold">Asistente CGE</h1>
          <p className="text-xs text-muted-foreground">
            Consultas sobre el sistema educativo
          </p>
        </div>
      </div>
    </div>
  );
}
