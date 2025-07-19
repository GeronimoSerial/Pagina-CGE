import Link from 'next/link';
import NewsGrid from './NewsGrid';
import { Button } from '@/shared/ui/button';
import { ArrowRight } from 'lucide-react';

interface StaticNewsSectionProps {
  initialData: {
    noticias: any[];
    pagination: any;
  };
  categorias: Array<{ id: number; nombre: string }>;
}

export default function StaticNewsSection({
  initialData,
  categorias,
}: StaticNewsSectionProps) {
  const { noticias, pagination } = initialData;

  const noticiasDestacadas =
    noticias.filter((noticia: any) => noticia.esImportante) || [];
  const noticiasRegulares =
    noticias.filter((noticia: any) => !noticia.esImportante) || [];

  return (
    <div className="space-y-8">
      <div>
        <NewsGrid
          noticiasDestacadas={noticiasDestacadas}
          noticiasRegulares={noticiasRegulares}
        />
      </div>

      {pagination?.pageCount > 1 && (
        <div className="flex justify-center pt-8">
          <Link href="/noticias?page=2">
            <Button variant="outline" className="flex items-center gap-2">
              Ver más noticias
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
