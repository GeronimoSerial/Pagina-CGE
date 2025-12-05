'use client';

import { type ComponentProps, memo } from 'react';
import { Streamdown } from 'streamdown';
import { cn } from '@/shared/lib/utils';

type MarkdownResponseProps = ComponentProps<typeof Streamdown>;

export const MarkdownResponse = memo(
  ({ className, children, ...props }: MarkdownResponseProps) => (
    <Streamdown
      className={cn(
        // Base prose styles
        'prose prose-sm dark:prose-invert max-w-none',
        // Spacing
        '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        // Code blocks
        '[&_code]:whitespace-pre-wrap [&_code]:break-words',
        '[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-3',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-zinc-100',
        // Lists
        '[&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5',
        // Tables - Excel/spreadsheet style
        '[&_table]:w-full [&_table]:border-collapse [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-border',
        '[&_thead]:bg-muted/80',
        '[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground',
        '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm',
        '[&_tr:nth-child(even)]:bg-muted/30',
        '[&_tr]:transition-colors hover:[&_tr]:bg-muted/50',
        // Links
        '[&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_a]:underline-offset-4',
        // Headings
        '[&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
        '[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2',
        '[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1',
        // Blockquotes
        '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
        // Paragraphs
        '[&_p]:leading-relaxed',
        className,
      )}
      {...props}
    >
      {children}
    </Streamdown>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

MarkdownResponse.displayName = 'MarkdownResponse';
