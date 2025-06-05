import HeroSection from "@modules/layout/Hero";
import { Metadata } from "next";
import { EscuelasClient } from "@components/data/dynamic-client";
import FAQSection from "@/src/modules/layout/FAQSection";
import { getEscuelas } from "@/src/modules/escuelas/utils/escuelas";

export const metadata: Metadata = {
  title: "Escuelas",
  description: "Instituciones dependientes del Consejo General de Educación",
};

export default async function Escuelas() {
  const escuelas = getEscuelas();
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Escuelas"
        description="Instituciones dependientes del Consejo General de Educación."
      />
      <div className="container mx-auto px-4 py-8">
        <EscuelasClient escuelas={escuelas} />
      </div>
      <FAQSection basePath="/escuelas" />
    </main>
  );
}
