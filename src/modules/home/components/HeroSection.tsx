"use client";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const HeroMain = () => {
  return (
    <div className="relative w-full h-[520px] md:h-[600px] bg-[#F7FAF9] overflow-hidden flex items-center">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero2.png"
          alt="Imagen de fondo principal"
          fill
          quality={100}
          priority
          className="object-cover"
        />
      </div>
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <Image
          src="/images/header2.png"
          alt="Imagen de fondo principal"
          fill
          quality={100}
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-20 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight"
            style={{ textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Consejo General de Educación de Corrientes
          </h1>

          <p
            className="text-lg md:text-xl text-white mb-8 font-medium"
            style={{ textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Gestión y acompañamiento pedagógico en la educación inicial,
            primaria y de adultos.
          </p>
          <Button
            asChild
            size="default"
            className="bg-[#217A4B] hover:bg-[#205C3B] text-white font-bold px-6 py-3 rounded-xl text-base shadow-lg transition-colors border-2 border-white/10 focus:ring-2 focus:ring-[#205C3B]"
          >
            <Link href="/institucional">Conocé nuestras acciones</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroMain;
