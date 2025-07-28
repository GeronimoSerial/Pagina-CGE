'use client';
import dynamic from 'next/dynamic';
import SkeletonLoading from '../components/SkeletonComponent';

const LoadingSpinner = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center h-[600px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#217A4B]/20"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-[#217A4B] border-t-transparent animate-spin"></div>
      </div>
      {text && (
        <div className="text-center">
          <p className="text-gray-700 font-medium">{text}</p>
          <p className="text-sm text-gray-500 mt-1">
            Espere un momento por favor
          </p>
        </div>
      )}
    </div>
  </div>
);

export const ClientCarousel = dynamic(
  () => import('../components/ImageCarousel'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando carrusel de imagenes" />,
  },
);

export const SchoolsClient = dynamic(
  () => import('@/features/escuelas/components/Index'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando escuelas" />,
  },
);

export const StickyImage = dynamic(
  () => import('@src/features/chatbot/components/StickyImage'),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner text="Cargando imagen ilustrativa del chatbot" />
    ),
  },
);

export const EscuelaDetalles = dynamic(
  () => import('@src/features/escuelas/components/EscuelaDetalles/index'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4 border border-gray-100 max-w-sm w-full mx-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#217A4B]/20"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-[#217A4B] border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-800 text-lg">
              Cargando detalles
            </p>
            <p className="text-gray-500 mt-1">Espere un momento por favor</p>
          </div>
        </div>
      </div>
    ),
  },
);

export const EscuelasTable = dynamic(
  () =>
    import('@src/features/escuelas/components/EscuelaTable/index').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando escuelas asignadas" />,
  },
);

export const DocumentacionSection = dynamic(
  () => import('@src/features/documentation/components/DocumentationSection'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando documentación" />,
  },
);

// Componentes lazy para homepage optimization
export const LatestNewsStatic = dynamic(
  () => import('@/features/noticias/components/LatestNews'),
  {
    ssr: false,
    loading: () => (
      <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="w-full lg:w-96">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border">
                    <div className="h-48 bg-gray-200 rounded-t-xl animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },
);

export const SocialMediaSection = dynamic(
  () => import('@/features/socials/components/SocialMediaSection'),
  {
    ssr: false,
    loading: () => (
      <section className="relative overflow-hidden bg-gray-50">
        <div className="container relative mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-2xl py-2 mx-auto">
            <div className="flex-1 h-24 bg-gray-200 rounded-3xl animate-pulse"></div>
            <div className="flex-1 h-24 bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    ),
  },
);
