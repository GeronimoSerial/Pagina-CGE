'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

export function HTMLContent({ content, className = '' }: HTMLContentProps) {
  const sanitizedContent = useMemo(() => {
    // Solo sanitizar en el cliente
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'br',
          'div',
          'span',
          'strong',
          'em',
          'b',
          'i',
          'u',
          'ul',
          'ol',
          'li',
          'a',
          'img',
          'blockquote',
          'code',
          'pre',
          'table',
          'thead',
          'tbody',
          'tr',
          'td',
          'th',
        ],
        ALLOWED_ATTR: [
          'href',
          'target',
          'rel',
          'src',
          'alt',
          'width',
          'height',
          'class',
          'id',
          'style',
        ],
        ALLOWED_URI_REGEXP:
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      });
    }
    return content;
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
