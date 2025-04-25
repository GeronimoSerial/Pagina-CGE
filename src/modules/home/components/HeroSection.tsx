'use client'
import React from "react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";
interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "Consejo General de Educación de Corrientes",
  subtitle = "Trabajando por una educación pública de calidad",
  ctaText = "Conocé nuestras acciones",
  backgroundImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[500px] bg-gray-100 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8">{subtitle}</p>

          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>

      {/* Decorative Element - Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
