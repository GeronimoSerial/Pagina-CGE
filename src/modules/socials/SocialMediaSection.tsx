import { Facebook, Instagram, ExternalLink } from "lucide-react";
import type { SocialMediaProps } from "@/src/interfaces";

const SocialMediaSection = ({
  facebookUrl = "https://facebook.com/ConsejoGeneralEducacion",
  instagramUrl = "https://instagram.com/consejogeneral",
  title = "Seguinos en redes sociales",
  description = "Mantenete conectado y recibí las últimas actualizaciones a través de nuestras redes sociales",
}: SocialMediaProps) => {
  return (
    <section className="relative py-16 overflow-hidden bg-gray-50 to-white">
      <div className="container relative mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-5xl leading-relaxed font-bold mb-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-600 text-xl leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-3xl mx-auto">
          {/* Instagram Card */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-1 transform transition-transform duration-500 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <div className="relative p-8 bg-white border border-gray-100 rounded-3xl">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50">
                    <Instagram className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-500">
                      Encontrános en
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      Instagram
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 transform transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                  <ExternalLink className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>
          </a>
          {/* Facebook Card */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-1 transform transition-transform duration-500 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <div className="relative p-8 bg-white border border-gray-100 rounded-3xl">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50">
                    <Facebook className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-500">
                      Conectate en
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      Facebook
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 transform transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
