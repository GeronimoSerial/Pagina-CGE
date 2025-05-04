"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  function handlePrint() {
    const article = document
      .querySelector(".printable-article")
      ?.cloneNode(true) as HTMLElement;

    if (!article) {
      alert("No se encontró el contenido para imprimir.");
      return;
    }

    // Eliminamos cualquier elemento con clase 'no-print' dentro del artículo clonado
    article.querySelectorAll(".no-print").forEach((el) => el.remove());

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("No se pudo abrir la ventana de impresión.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir artículo</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 40px;
              background: white;
            }
            * {
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body></body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.document.body.appendChild(article);
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  return (
    <button
      className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all rounded-full shadow-sm"
      onClick={handlePrint}
      title="Imprimir"
    >
      <Printer size={18} />
      <span className="hidden sm:inline">Imprimir</span>
    </button>
  );
}
