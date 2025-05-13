import {
  BookOpen,
  BookText,
  GraduationCap,
  Pencil,
  NotebookPen,
} from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  ctaText?: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] text-white  shadow-xl hover:shadow-2xl transition-all duration-500 h-[250px] flex items-center justify-center overflow-hidden relative">
      {/* Patrón educativo más visible */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center pointer-events-none">
        {[...Array(18)].map((_, i) => {
          const iconSize = 24;
          const left = `${10 + (i % 6) * 15}%`;
          const top = `${10 + Math.floor(i / 6) * 15}%`;
          const rotate = `${-15 + (i % 7) * 5}deg`;
          const opacity = 0.2;

          const Icon = [BookOpen, BookText, GraduationCap, Pencil, NotebookPen][
            i % 5
          ];

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left,
                top,
                transform: `rotate(${rotate})`,
                opacity,
              }}
            >
              <Icon size={iconSize} className="text-white" strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent pointer-events-none" />

      <div className="container mx-auto text-center px-5 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl mt-3 font-bold text-white drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg text-green-100/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Libro grande destacado */}
      <div className="absolute bottom-6 right-6 opacity-25">
        <BookText size={100} className="text-white" strokeWidth={1.2} />
      </div>
    </div>
  );
}
