import {
  getPaginatedNews,
  getNewsCategories,
  getFeaturedNews,
} from '@/features/noticias/services/news';
import { PageLayout } from '@/shared/components/PageLayout';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StaticNewsSection from '@/features/noticias/components/StaticNewsSection';

export async function generateStaticParams() {
  try {
    const { pagination } = await getPaginatedNews(1, 9);

    const totalPages = pagination.pageCount;

    const initialPages = Math.min(totalPages, 3);

    const params = [];
    for (let i = 1; i <= initialPages; i++) {
      params.push({ pageNumber: i.toString() });
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ pageNumber: '1' }, { pageNumber: '2' }, { pageNumber: '3' }];
  }
}

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}): Promise<Metadata> {
  const { pageNumber } = await params;
  const pageNum = parseInt(pageNumber);

  return {
    title: `Noticias - Página ${pageNum} | Consejo General de Educación`,
    description: `Últimas noticias del Consejo General de Educación de Corrientes - Página ${pageNum}.`,
    openGraph: {
      title: `Noticias - Página ${pageNum} | CGE Corrientes`,
      description: `Últimas noticias del Consejo General de Educación de Corrientes - Página ${pageNum}.`,
      url: `/noticias/page/${pageNum}`,
    },
  };
}

interface PageProps {
  params: Promise<{ pageNumber: string }>;
}

export default async function NoticiasPageNumber({ params }: PageProps) {
  const { pageNumber } = await params;
  const pageNum = parseInt(pageNumber);

  if (pageNum < 1 || isNaN(pageNum)) {
    notFound();
  }

  try {
    const [initialNoticias, categorias, featuredNews] = await Promise.all([
      getPaginatedNews(pageNum, 9),
      getNewsCategories(),
      pageNum === 1 ? getFeaturedNews(5) : Promise.resolve([]),
    ]);

    if (initialNoticias.noticias.length === 0 && pageNum > 1) {
      notFound();
    }

    return (
      <PageLayout
        pageType="wide"
        hero={{
          title: `Noticias - Página ${pageNum}`,
          description:
            'Últimas noticias del Consejo General de Educación de Corrientes.',
        }}
        showSeparator={true}
        showInfoBar={true}
        basePath="/noticias"
      >
        <StaticNewsSection
          initialData={initialNoticias}
          featuredNews={featuredNews}
          currentPage={pageNum}
        />
      </PageLayout>
    );
  } catch (error) {
    console.error('Error loading noticias page:', error);
    notFound();
  }
}
