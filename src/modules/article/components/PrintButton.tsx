"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      className="p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors"
      onClick={handlePrint}
      title="Imprimir"
    >
      <Printer size={18} />
    </button>
  );
}
