'use client';

import { cn } from '@/shared/lib/utils';
import { IconRobot } from '@tabler/icons-react';
import { useUserName } from '@/features/dashboard/providers/session-provider';

const suggestions = [
  '¿Cuántas escuelas hay en el sistema?',
  '¿Cómo consulto la asistencia de un empleado?',
  '¿Qué información tiene cada escuela?',
  '¿Cómo funciona el sistema de supervisión?',
];

interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  const userName = useUserName();
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 animate-in fade-in zoom-in-95 duration-300">
        <IconRobot className="h-8 w-8 text-primary" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
        ¡Hola, <strong>{userName ? userName : 'bienvenido'}</strong> 👋!
      </h2>

      <p className="mb-8 text-center text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
        ¿En qué puedo ayudarte hoy?
      </p>

      <div className="grid w-full max-w-md gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-150">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              'w-full rounded-xl border border-border/50 bg-background px-4 py-3',
              'text-left text-sm text-muted-foreground',
              'transition-all duration-200 hover:border-primary/50 hover:bg-muted/50 hover:text-foreground',
              'active:scale-[0.99]',
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
