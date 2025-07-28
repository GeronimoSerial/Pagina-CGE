'use client';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const HeroMain = () => {
  return (
    <div className="relative w-full h-[520px] md:h-[600px] bg-[#F7FAF9] overflow-hidden flex items-center">
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

      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in-up">
          <h1
            className="mt-16 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:text-balance leading-tight"
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            Consejo General de Educación de Corrientes
          </h1>

          <p
            className="text-lg md:text-xl text-white mb-8 font-medium text-balance"
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            Gestión y acompañamiento pedagógico integral en la educación
            inicial, primaria y de adultos de nuestra provincia.
          </p>
          <Button
            asChild
            size="default"
            className="bg-[#205C3B] hover:bg-[#194931] text-white font-bold px-6 py-3 rounded-xl text-base shadow-lg transition-colors border-2 border-white/10 focus:ring-2 focus:ring-[#194931]"
          >
            <Link href="/institucional">Conocé nuestras acciones</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroMain;
