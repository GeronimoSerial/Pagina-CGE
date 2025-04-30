interface HeroSubSectionProps {
  title: string;
  description: string;
}

// const title = "Noticias y Novedades";
// const description =
//   "Mantente informado con las últimas noticias y novedades del Consejo General de Educación. Encuentra información actualizada sobre eventos, anuncios y comunicados importantes.";

export default function HeroSubSection({
  title,
  description,
}: HeroSubSectionProps) {
  return (
    <div className="bg-gradient-to-r from-[#2D6A27] to-[#3D8B37] text-white h-[300px] flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}
