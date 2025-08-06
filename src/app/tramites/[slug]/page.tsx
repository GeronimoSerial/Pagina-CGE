import { notFound } from 'next/navigation';
import {
  getProcedureBySlug,
  getAllProcedureSlugs,
  Article,
} from '@/features/tramites/services/docs-data';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { HTMLContent } from '@/shared/components/HTMLContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllProcedureSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.warn('Error generating static params for tramites:', error);
    return [];
  }
}

export const revalidate = false;

export default async function DocumentPage({ params }: PageProps) {
  const slug = (await params).slug;

  const article: Article | null = await getProcedureBySlug(slug);

  if (!article) {
    notFound();
  }

  const markdown = article.content?.[0]?.content || '';

  const date = new Date(article.lastUpdated);
  const isoDate = date.toISOString();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Organization',
      name: 'Consejo General de Educación',
      url: 'https://www.consejo.mec.gob.ar',
    },
    image: 'https://consejo.mec.gob.ar/og-tramites.webp',
    publisher: {
      '@type': 'Organization',
      name: 'Consejo General de Educación',
      logo: {
        '@type': 'ImageObject',
        url: 'https://consejo.mec.gob.ar/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://consejo.mec.gob.ar/tramites/${slug}`,
    },
  };

  return (
    <div className="min-h-screen">
      <main className="flex-1 lg:overflow-y-auto">
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
            <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              {article.description}
            </p>
          </header>

          {/* Article Content */}
          <article className="max-w-none prose prose-lg">
            <HTMLContent
              content={markdown}
              className="max-w-none prose prose-lg"
            />
          </article>
        </div>

        {/* Article Footer */}
        <footer className="px-6 pb-8 mx-auto max-w-4xl lg:px-8">
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 text-sm text-gray-600 sm:mb-0">
                ¿Encontraste un error en esta página?{' '}
                <Link
                  href="/contacto"
                  className="text-green-800 underline hover:text-green-600"
                >
                  Comunícanos
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/tramites"
                  className="flex items-center text-sm text-gray-800 hover:text-green-600"
                >
                  <span className="text-sm text-green-800">
                    ← Volver a Trámites
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getProcedureBySlug(slug);

  if (!article) {
    return {
      title: 'Página no encontrada',
    };
  }
  const url = `/tramites/${slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: url,
      type: 'article',
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      expirationTime: article.lastUpdated,
      authors: ['Consejo General de Educación'],
      tags: [article.category],
      images: [
        {
          url: 'https://consejo.mec.gob.ar/og-tramites.webp',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}
