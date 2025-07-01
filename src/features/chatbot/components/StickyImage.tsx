'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { ChatbotIcon } from '@/shared/styles/svg/ChatbotIcon';

interface StickyImageProps {
  enlace: string;
}

export default function StickyImage({ enlace }: StickyImageProps) {
  return (
    <div className="sticky top-24 self-start">
      <div className="relative">
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="block group focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2 rounded-xl"
          aria-label="Acceder al Chat Normativo CGE"
        >
          <div className="cursor-pointer transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-[#3D8B37]/30 transform hover:-translate-y-2 rounded-2xl p-1 bg-gradient-to-r from-[#3D8B37]/15 via-[#3D8B37]/20 to-[#3D8B37]/40">
            <div className="relative h-[500px] sm:h-[550px] lg:h-[500px] overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <ChatbotIcon size={42} />
                  </div>
                  <p className="text-2xl font-semibold">Acceder al Chat</p>
                  <p className="text-lg mt-2">
                    Haz click para comenzar tu consulta
                  </p>
                  <div className="mt-6 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
              <Image
                src="/images/Chatbot.png"
                alt="Asistente virtual del CGE - Interfaz del Chat Normativo"
                width={800}
                height={700}
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </a>
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center z-20">
          <span className="text-sm text-[#3D8B37] font-medium italic bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md whitespace-nowrap border border-[#3D8B37]/20">
            Imagen ilustrativa del asistente virtual
          </span>
        </div>
      </div>
    </div>
  );
}
