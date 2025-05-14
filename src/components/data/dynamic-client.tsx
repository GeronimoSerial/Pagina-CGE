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

export const SupervisoresClient = dynamic(
  () => import("../../modules/supervisores/components/SupervisoresClient"),
  { ssr: false } // Desactivar SSR para este componente pesado
);

export const EscuelaDetalles = dynamic(
  () => import("../../modules/supervisores/components/EscuelaDetalles"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-[#217A4B] animate-spin" />
          <p>Cargando detalles...</p>
        </div>
      </div>
    ),
  }
);

export const EscuelasTable = dynamic(
  () =>
    import("../../modules/supervisores/components/EscuelasTable").then(
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
