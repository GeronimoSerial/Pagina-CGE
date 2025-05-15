"use client";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const section = pathname.split("/")[1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50">
      <div className="container px-4 animate-fadeIn">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="flex flex-col items-center py-20 px-8">
            {/* Icono animado */}
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 rounded-full bg-red-100 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full bg-red-50 flex items-center justify-center shadow-lg">
                <span className="text-red-500 text-6xl font-light animate-bounce">
                  !
                </span>
              </div>
            </div>

            {/* Textos con mejor espaciado y tipografía */}
            <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">
              Recurso no encontrado
            </h1>
            <p className="text-lg text-slate-600 text-center mb-12 max-w-md">
              Lo sentimos, el recurso que estás buscando no existe o ha sido
              removido.
            </p>

            {/* Botón mejorado */}
            <Link href="/tramites">
              <Button className="bg-emerald-600 hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 px-8 py-3 rounded-full text-lg">
                <ArrowLeftIcon className="mr-3" size={20} />
                Volver a {section}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
