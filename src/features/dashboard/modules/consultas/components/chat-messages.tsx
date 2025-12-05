'use client';

import type { UIMessage } from 'ai';
import { useScrollToBottom } from '../hooks/use-scroll-to-bottom';
import { ChatMessage } from './chat-message';
import { ChatEmptyState } from './chat-empty-state';
import { IconArrowDown } from '@tabler/icons-react';
import { Button } from '@/shared/ui/button';

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  onSuggestionClick,
}: ChatMessagesProps) {
  const { containerRef, endRef, isAtBottom, scrollToBottom } =
    useScrollToBottom();

  if (messages.length === 0) {
    return <ChatEmptyState onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div ref={containerRef} className="relative flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={
              isLoading &&
              index === messages.length - 1 &&
              message.role === 'assistant'
            }
          />
        ))}
        <div ref={endRef} className="h-px" />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => scrollToBottom()}
            className="h-8 w-8 rounded-full shadow-md"
          >
            <IconArrowDown className="h-4 w-4" />
            <span className="sr-only">Ir al final</span>
          </Button>
        </div>
      )}
    </div>
  );
}
