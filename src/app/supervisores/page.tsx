import HeroSection from "../../modules/layout/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supervisores",
  description: "Supervisores del CGE Corrientes, y sus escuelas asignadas",
};

export default function Supervisores() {
  return (
    <main>
      <HeroSection
        title="Supervisores"
        description="Supervisores del CGE Corrientes, y sus escuelas asignadas"
      />
      <div className="container mx-auto px-4 py-8" />
      <div className="max-w-4xl mx-auto"></div>
    </main>
  );
}
