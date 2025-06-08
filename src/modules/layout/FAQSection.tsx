import React from "react";
import { HelpCircle } from "lucide-react";
import {
  FAQ,
  FAQLink,
  faqsContact,
  faqsDocs,
  faqsEscuelas,
  faqsNews,
  faqsTramites,
} from "../faqs/faqs";

interface FAQSectionProps {
  basePath: string;
}

const getFaqsbyPath = (path: string): FAQ[] => {
  switch (path.toLowerCase()) {
    case "/noticias":
      return faqsNews;
    case "/tramites":
      return faqsTramites;
    case "/contacto":
      return faqsContact;
    case "/documentacion":
      return faqsDocs;
    case "/escuelas":
      return faqsEscuelas;
    default:
      return [];
  }
};

export default function FAQSection({ basePath }: FAQSectionProps) {
  const faqs = getFaqsbyPath(basePath);

  return (
    <section className="bg-gray-50 border-t border-gray-100 z-10 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r leading-tight md:leading-normal lg:leading-relaxed from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-md md:text-lg text-balance mb-8">
            Respuestas a las consultas más comunes sobre {basePath.slice(1)} del
            Consejo General de Educación.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-start mb-2">
                <div className="bg-[#3D8B37]/10 p-1 rounded-lg mr-3">
                  <HelpCircle className="h-5 w-5 text-[#3D8B37]" />
                </div>
                <h4 className="font-semibold text-base text-gray-800">
                  {faq.question}
                </h4>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div className="ml-10">
                  <p className="text-gray-600 text-sm text-balance">
                    {faq.answer.text}
                  </p>
                </div>
                {faq.answer.links && faq.answer.links.length > 0 && (
                  <div className="mt-3 space-y-1.5 ml-10">
                    {faq.answer.links.map(
                      (link: FAQLink, linkIndex: number) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          className="inline-block text-[#3D8B37] hover:text-[#2D6A27] font-medium transition-colors duration-200 text-sm"
                        >
                          {link.text} →
                        </a>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
