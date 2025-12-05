'use client';

import { cn } from '@/shared/lib/utils';
import { IconRobot, IconUser } from '@tabler/icons-react';
import type { UIMessage } from 'ai';
import { memo } from 'react';
import { MarkdownResponse } from './markdown-response';

interface ChatMessageProps {
  message: UIMessage;
  isLoading?: boolean;
}

function PureChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Extract text content from parts
  const content =
    message.parts
      ?.filter(
        (part): part is { type: 'text'; text: string } => part.type === 'text',
      )
      .map((part) => part.text)
      .join('') || '';

  return (
    <div
      className={cn(
        'group/message flex w-full animate-in fade-in duration-200',
        isUser ? 'justify-end' : 'justify-start',
      )}
      data-role={message.role}
    >
      {!isUser && (
        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-border">
          <IconRobot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-2xl',
          isUser
            ? 'bg-primary px-4 py-2.5 text-primary-foreground'
            : 'bg-transparent',
        )}
      >
        {isUser ? (
          <div className="break-words text-sm">{content}</div>
        ) : (
          <div className="text-sm text-foreground">
            {content ? (
              <MarkdownResponse>{content}</MarkdownResponse>
            ) : isLoading ? (
              <span className="inline-flex items-center gap-1 px-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </span>
            ) : null}
          </div>
        )}
      </div>

      {isUser && (
        <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <IconUser className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

export const ChatMessage = memo(PureChatMessage);
