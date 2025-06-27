// src/app/noticia/[id]/page.tsx
import HeroMain from "@/src/modules/home/components/HeroMain";
import QuickAccess from "@modules/home/components/QuickAccess";
import { Separator } from "@radix-ui/react-separator";
import SocialMediaSection from "@modules/socials/SocialMediaSection";

export default async function PagPrincipal() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroMain />
        <Separator className="my-8 " />
        {/* Quick Access Section */}
        <section className=" bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <QuickAccess />
          </div>
        </section>
        <Separator className="my-8 bg-[#217A4B]/20" />
        <SocialMediaSection />
      </main>
    </div>
  );
}
