'use client';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const HeroMain = () => {
  return (
    <div className="relative w-full h-[520px] md:h-[600px] bg-[#F7FAF9] overflow-hidden flex items-center">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero3.png"
          alt="Imagen de fondo principal"
          fill
          quality={100}
          priority
          className="object-cover"
        />
      </div>
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <Image
          src="/images/heromobile.png"
          alt="Imagen de fondo principal para móviles"
          fill
          quality={100}
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="mt-16 text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
            Consejo General de Educación
          </h1>

          <p className="text-md md:text-xl text-gray-300 mb-8 font-medium text-balance">
            Gestión y acompañamiento pedagógico integral en la educación
            inicial, primaria y de adultos de nuestra provincia.
          </p>
          <Button
            asChild
            size="default"
            className="bg-[#3B8A57] hover:bg-[#194931] text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-colors focus:ring-2 focus:ring-[#194931]"
          >
            <Link href="/institucional">Conocé nuestras acciones</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <ChevronDown
            className="w-8 h-8 text-white animate-bounce"
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroMain;
