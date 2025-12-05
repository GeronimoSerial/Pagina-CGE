'use client';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { IconSend, IconPlayerStop } from '@tabler/icons-react';
import { useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  onStop,
  isLoading,
  placeholder = 'Escribe tu pregunta aquí...',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="relative flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              'max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2',
              'text-sm outline-none placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />

          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={onStop}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <IconPlayerStop className="h-4 w-4" />
              <span className="sr-only">Detener</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <IconSend className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          La IA puede cometer errores. Verificá la información importante.
        </p>
      </div>
    </div>
  );
}
