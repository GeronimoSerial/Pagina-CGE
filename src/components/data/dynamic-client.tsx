"use client";
import dynamic from "next/dynamic";
import SkeletonLoading from "../SkeletonComponent";
import { Loader2 } from "lucide-react";

export const ClientCarousel = dynamic(() => import("../CarouselDeImagenes"), {
  ssr: false,
  loading: () => (
    // <SkeletonLoading />
    <div className="flex items-center justify-center h-[600px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#217A4B]"></div>
    </div>
  ),
});

export const ClientOrganigrama = dynamic(
  () => import("../../modules/institucional/components/Organigrama"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#217A4B]"></div>
      </div>
    ),
  }
);

export const EscuelasClient = dynamic(
  () => import("@/src/modules/escuelas/components/EscuelasClient"),
  { ssr: false }
);

export const SupervisoresClient = dynamic(
  () => import("@modules/escuelas/components/SupervisoresClient")
);

export const EscuelaDetalles = dynamic(
  () => import("../../modules/escuelas/components/EscuelaDetalles"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-xl shadow-xl flex items-center space-x-4 border border-gray-100">
          <div className="bg-[#217A4B]/10 p-2.5 rounded-full">
            <Loader2 className="h-6 w-6 text-[#217A4B] animate-spin" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Cargando detalles...</p>
            <p className="text-sm text-gray-500">Espere un momento por favor</p>
          </div>
        </div>
      </div>
    ),
  }
);

export const EscuelasTable = dynamic(
  () =>
    import("../../modules/escuelas/components/EscuelasTable").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin mb-4" />
          <p className="text-gray-600 text-sm">
            Cargando escuelas asignadas...
          </p>
        </div>
      </div>
    ),
  }
);

export const ArticlesGridClient = dynamic(
  () =>
    import("../../modules/article/components/ArticlesGrid").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Cargando artículos...</p>
        </div>
      </div>
    ),
  }
);
