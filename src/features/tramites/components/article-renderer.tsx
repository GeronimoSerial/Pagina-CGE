import { Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MarkdownComponent } from '@/shared/components/MarkdownComponent';
import type { Article } from '../services/docs-data';

interface ArticleRendererProps {
  article: Article;
}

export function ArticleRenderer({ article }: ArticleRendererProps) {
  const markdown = article.content?.[0]?.content || '';

  return (
    <div className="px-6 py-8 mx-auto max-w-4xl lg:px-8 lg:py-12">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center px-3 py-1 mr-3 text-xs font-medium text-white bg-green-800 rounded-full">
            {article.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 w-4 h-4" />
            {new Date(article.lastUpdated).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600">{article.description}</p>
      </header>

      {/* Article Content */}
      <article className="max-w-none prose prose-lg">
        <ReactMarkdown components={MarkdownComponent}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}
