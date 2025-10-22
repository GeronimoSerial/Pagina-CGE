'use client';
import { useEffect, useState, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const SANITIZE_CONFIG = {
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
};

const TAG_CLASS_MAP: Record<string, string> = {
  h1: 'text-3xl font-bold text-slate-900 mt-8 mb-4 border-b pb-1 border-slate-200',
  h2: 'text-2xl font-semibold mt-6 mb-3 text-slate-900',
  h3: 'text-xl font-medium mt-6 mb-3 text-slate-900',
  a: 'text-gray-800 underline hover:text-blue-800 hover:underline transition-colors font-medium',
  img: 'rounded-xl shadow-xl my-8 w-full',
  blockquote:
    'border-l-4 border-slate-400 bg-slate-50 pl-5 py-3 my-8 italic rounded-r-lg text-slate-700',
  code: 'bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm',
  pre: 'bg-slate-800 text-slate-100 rounded-xl p-5 overflow-x-auto my-8 shadow-md text-sm',
  ul: 'list-disc pl-6 my-5 space-y-2 marker:text-slate-500',
  ol: 'list-decimal pl-6 my-5 space-y-2 marker:text-slate-500',
  li: 'mb-2 leading-relaxed',
  table:
    'w-full border border-slate-200 rounded-xl overflow-hidden text-sm sm:text-base',
  th: 'border border-slate-200 px-2 py-1.5 sm:px-4 sm:py-2.5 bg-slate-100 text-left text-slate-700 font-medium',
  td: 'border border-slate-200 px-2 py-1.5 sm:px-4 sm:py-2.5',
  p: 'mb-6 text-slate-800 leading-relaxed text-base',
  b: 'font-bold text-slate-900',
  strong: 'font-bold text-slate-900',
};

const wrapTablesWithResponsiveContainer = (html: string): string => {
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  return html.replace(
    tableRegex,
    '<div class="overflow-x-auto -mx-6 sm:-mx-8 my-6"><div class="inline-block min-w-full px-6 sm:px-8">$&</div></div>',
  );
};

const addClassesToTags = (html: string): string => {
  const classAttrRegex = /class\s*=\s*(['"])(.*?)\1/;

  return html.replace(
    /<(\/)?([a-zA-Z0-9]+)([^>]*)>/g, 
    (match, slash, tag, attrs) => {
      const tagName = tag.toLowerCase();
      if (slash) return match;

      if (TAG_CLASS_MAP[tagName]) {
        if (classAttrRegex.test(attrs)) {
          return `<${tag}${attrs.replace(
            classAttrRegex,
            (m: string, q: string, c: string) =>
              `class=${q}${c} ${TAG_CLASS_MAP[tagName]}${q}`,
          )}>`;
        } else {
          return `<${tag}${attrs ? ' ' : ''}${attrs.trim()} class="${TAG_CLASS_MAP[tagName]}">`;
        }
      }

      return match;
    },
  );
};

const secureLinkTargets = (html: string): string => {
  return html.replace(
    /<a\s+([^>]*target=["']_blank["'][^>]*)>/gi,
    (match, attrs) => {
      if (/rel\s*=\s*["'][^"']*["']/i.test(attrs)) {
        return match.replace(
          /rel\s*=\s*["']([^"']*)["']/i,
          (relMatch, relValue) => {
            const values = relValue.split(/\s+/).filter(Boolean);
            if (!values.includes('noopener')) values.push('noopener');
            if (!values.includes('noreferrer')) values.push('noreferrer');
            return `rel="${values.join(' ')}"`;
          },
        );
      } else {
        return `<a ${attrs} rel="noopener noreferrer">`;
      }
    },
  );
};

export function HTMLContent({ content, className = '' }: HTMLContentProps) {
  const [finalSanitizedContent, setFinalSanitizedContent] = useState('');

  useEffect(() => {
    let clean = DOMPurify.sanitize(content, SANITIZE_CONFIG);

    clean = addClassesToTags(clean);

    clean = secureLinkTargets(clean);

    clean = wrapTablesWithResponsiveContainer(clean);

    setFinalSanitizedContent(clean);
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: finalSanitizedContent }}
    />
  );
}
