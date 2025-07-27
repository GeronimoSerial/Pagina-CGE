// Componentes cargados dinamicamente
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
  () => import('../components/CarouselDeImagenes'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando carrusel de imagenes" />,
  },
);

export const ClientOrganigrama = dynamic(
  () => import('@src/features/institucional/components/Organigrama'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Cargando organigrama" />,
  },
);

export const EscuelasClient = dynamic(
  () => import('@/features/escuelas/components/index'),
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
