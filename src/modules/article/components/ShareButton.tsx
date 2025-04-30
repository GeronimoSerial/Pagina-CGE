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
      className="p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors"
      onClick={handleShare}
      title="Compartir"
    >
      <Share2 size={18} />
    </button>
  );
}
