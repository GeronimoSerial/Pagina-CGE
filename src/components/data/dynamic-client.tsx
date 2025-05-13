"use client";
import dynamic from "next/dynamic";
import SkeletonLoading from "../SkeletonComponent";

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
