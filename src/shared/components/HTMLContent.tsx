'use client';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

export function HTMLContent({ content, className = '' }: HTMLContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    const tagClassMap: Record<string, string> = {
      h1: 'text-3xl font-bold text-gray-900 mt-8 mb-4 border-b pb-1 border-gray-200',
      h2: 'text-2xl font-semibold mt-6 mb-3 text-gray-900',
      h3: 'text-xl font-medium mt-6 mb-3 text-gray-900',
      a: 'text-gray-800 underline hover:text-blue-800 hover:underline transition-colors font-medium',
      img: 'rounded-xl shadow-xl my-8 w-full',
      blockquote:
        'border-l-4 border-gray-400 bg-gray-50 pl-5 py-3 my-8 italic rounded-r-lg text-gray-700',
      code: 'bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono text-sm',
      pre: 'bg-gray-800 text-gray-100 rounded-xl p-5 overflow-x-auto my-8 shadow-md text-sm',
      ul: 'list-disc pl-6 my-5 space-y-2 marker:text-gray-500',
      ol: 'list-decimal pl-6 my-5 space-y-2 marker:text-gray-500',
      li: 'mb-2 leading-relaxed',
      table: 'min-w-full border border-gray-200 rounded-xl overflow-hidden',
      th: 'border border-gray-200 px-5 py-3 bg-gray-100 text-left text-gray-700 font-medium',
      td: 'border border-gray-200 px-5 py-3',
      p: 'mb-6 text-gray-700 leading-relaxed text-lg',
      b: 'font-bold text-gray-900',
      strong: 'font-bold text-gray-900'
    };
    const classAttrRegex = /class\s*=\s*(['"])(.*?)\1/;

    function addClassesToTags(html: string): string {
      return html.replace(
        /<(\/_)?([a-zA-Z0-9]+)([^>]*)>/g,
        (match, slash, tag, attrs) => {
          const tagName = tag.toLowerCase();
          if (slash) return match;

          if (tagClassMap[tagName]) {
            if (classAttrRegex.test(attrs)) {
              return `<${tag}${attrs.replace(
                classAttrRegex,
                (m: string, q: string, c: string) =>
                  `class=${q}${c} ${tagClassMap[tagName]}${q}`,
              )}>`;
            } else {
              return `<${tag} ${attrs.trim()} class="${tagClassMap[tagName]}">`;
            }
          }

          return match;
        },
      );
    }

    let clean = DOMPurify.sanitize(content, {
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

    clean = addClassesToTags(clean);
    setSanitizedContent(clean);
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
