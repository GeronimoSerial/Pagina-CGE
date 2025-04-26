'use client'
import React from "react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";


const HeroSection = () => {
  return (
    <div className="relative w-full h-[520px] md:h-[600px] bg-[#F7FAF9] overflow-hidden flex items-center">
      {/* Imagen de fondo con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/images/header2.png)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#205C3B]/80 via-[#205C3B]/60 to-[#F7FAF9]/60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-xl leading-tight">
          Consejo General de Educación de Corrientes
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow-lg">
          Trabajando por una educación pública de calidad
          </p>

            <Button
              asChild
              size="default"
              className="bg-[#217A4B] hover:bg-[#205C3B] text-white font-bold px-6 py-3 rounded-xl text-base shadow-lg transition-colors border-2 border-white/10 focus:ring-2 focus:ring-[#205C3B]"
            >
              <Link href="/institucional">
              Conocé nuestras acciones
              </Link>
            </Button>
        </motion.div>
      </div>

      {/* Elemento decorativo: onda inferior */}
      {/* <div className="bottom-0 left-0 right-0 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#F7FAF9"
            fillOpacity="1"
            d="M0,80L80,90C160,100,320,120,480,110C640,100,800,60,960,50C1120,40,1280,60,1360,70L1440,80L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div> */}
    </div>
  );
};

export default HeroSection;
