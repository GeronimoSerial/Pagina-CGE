import { NoticiaCard } from '@/src/components/noticias/NoticiaCard';
import PaginacionServer from '@/src/components/noticias/PaginacionServer';
import { getNoticiasPaginadas } from '@/src/services/noticias';
import { notFound } from 'next/navigation';
import HeroSection from '@/src/modules/layout/Hero';
import FAQSection from '@/src/modules/layout/FAQSection';
interface NoticiasPageProps {
  searchParams?: { page?: string };
}

export default async function NoticiasPage({
  searchParams,
}: NoticiasPageProps) {
  const SearchParams = await searchParams;
  const page = Number(SearchParams?.page) || 1;
  const { noticias, pagination } = await getNoticiasPaginadas(page, 2);
  if (!noticias || noticias.length === 0) return notFound();

  return (
    <>
      <HeroSection
        title="Noticias"
        description="Últimas noticias y actualizaciones"
      />
      <main className="flex flex-col items-center justify-center min-h-screen p-4 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia: any) => (
            <NoticiaCard
              key={noticia.id}
              noticia={{
                id: noticia.id,
                ...noticia,
              }}
            />
          ))}
        </div>
        <PaginacionServer
          currentPage={pagination.page}
          totalItems={pagination.total}
          pageSize={pagination.pageSize}
        />
        <FAQSection basePath="/noticias" />
      </main>
    </>
  );
}
