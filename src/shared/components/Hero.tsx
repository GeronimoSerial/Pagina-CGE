import {
  BookOpen,
  BookText,
  GraduationCap,
  Pencil,
  NotebookPen,
} from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  description?: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#3D8B37] to-[#2D6A27] text-white  shadow-xl  h-[230px] flex items-center justify-center overflow-hidden relative">
      <div className="flex absolute inset-0 flex-wrap justify-center items-center pointer-events-none">
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

      <div className="absolute inset-0 bg-gradient-to-tr to-transparent pointer-events-none from-white/15" />

      <div className="container relative z-10 px-5 mx-auto text-center">
        <div className="mx-auto space-y-4 max-w-2xl">
          <h1 className="mt-3 text-2xl font-bold text-white drop-shadow-md md:text-4xl">
            {title}
          </h1>
          <p className="leading-relaxed text-white text-md md:text-lg text-balance">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute right-6 bottom-6 opacity-25">
        <BookText size={100} className="text-white" strokeWidth={1.2} />
      </div>
    </div>
  );
}
