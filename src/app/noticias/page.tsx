import { NoticiaCard } from '@/src/components/noticias/NoticiaCard';
import PaginacionServer from '@/src/components/noticias/PaginacionServer';
import { getNoticiasPaginadas } from '@/src/services/noticias';
import { notFound } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams?.page) || 1;
  const { noticias, pagination } = await getNoticiasPaginadas(page, 4);
  if (!noticias || noticias.length === 0) return notFound();

  return (
    <>
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
      </main>
    </>
  );
}
