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

/**
 * Sección estática que muestra noticias pre-renderizadas
 * No hace API calls - Todo el contenido viene del SSG
 */
export default function StaticNewsSection({
  initialData,
  categorias,
}: StaticNewsSectionProps) {
  const { noticias, pagination } = initialData;

  // Separar noticias destacadas de regulares
  const noticiasDestacadas =
    noticias.filter((noticia: any) => noticia.esImportante) || [];
  const noticiasRegulares =
    noticias.filter((noticia: any) => !noticia.esImportante) || [];

  return (
    <div className="space-y-8">
      {/* Noticias grid */}
      <div>
        <NewsGrid
          noticiasDestacadas={noticiasDestacadas}
          noticiasRegulares={noticiasRegulares}
        />
      </div>

      {/* Navegación a todas las noticias */}
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

      {/* Categorías populares */}
      {categorias && categorias.length > 0 && (
        <div className="border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Explorar por categoría
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorias.slice(0, 6).map((categoria) => (
              <Link
                key={categoria.id}
                href={`/noticias?categoria=${categoria.nombre}`}
              >
                <Button variant="secondary" size="sm" className="text-sm">
                  {categoria.nombre}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje informativo sobre actualización automática */}
      <div className="text-center text-sm text-gray-500 pt-4">
        Las noticias se actualizan automáticamente cada hora
      </div>
    </div>
  );
}
