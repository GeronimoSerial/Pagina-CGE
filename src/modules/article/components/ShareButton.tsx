"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({
  title,
  summary,
}: {
  title: string;
  summary?: string;
}) {
  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator
        .share({
          title,
          text: summary || "Mira este artículo interesante",
          url,
        })
        .catch((error) => {
          console.log("Error al compartir:", error);
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert("¡Enlace copiado al portapapeles!");
      });
    } else {
      prompt("Copia el enlace:", url);
    }
  }

  return (
    <button
      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all rounded-full shadow-sm"
      onClick={handleShare}
      title="Compartir"
    >
      <Share2 className="w-4 h-4 text-emerald-800" size={18} />
      <span className="hidden sm:inline">Compartir</span>
    </button>
  );
}
