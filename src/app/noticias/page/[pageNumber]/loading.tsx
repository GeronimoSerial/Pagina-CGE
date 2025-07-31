import { PageLayout } from '@/shared/components/PageLayout';

export default function Loading() {
  return (
    <PageLayout
      pageType="wide"
      hero={{
        title: 'Cargando noticias...',
        description: 'Cargando las últimas noticias del CGE.',
      }}
      showSeparator={true}
      showInfoBar={true}
      basePath="/noticias"
    >
      <div className="space-y-8 px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="animate-pulse">
                {/* Imagen placeholder */}
                <div className="h-48 bg-gray-200"></div>

                {/* Contenido */}
                <div className="p-6 space-y-3">
                  {/* Categoría */}
                  <div className="h-4 bg-gray-200 rounded w-20"></div>

                  {/* Título */}
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  </div>

                  {/* Resumen */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  {/* Fecha */}
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton para paginación */}
        <div className="flex justify-center items-center gap-4 pt-8">
          <div className="animate-pulse flex gap-4">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
