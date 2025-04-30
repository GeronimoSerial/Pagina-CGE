import { Info, Phone, Clock, ArrowRight, HelpCircle } from "lucide-react";
import ArticlesGrid from "../article/components/ArticlesGrid";
import HeroSubSection from "./Hero";

interface FAQ {
  question: string;
  answer: string;
}

interface InfoBarItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface PageWithFAQProps {
  // Props para la sección Hero
  heroTitle: string;
  heroDescription: string;

  // Props para la barra de información
  infoBarItems: InfoBarItem[];

  // Props para el grid de artículos
  articles: any[];
  categories?: string[];
  searchPlaceholder: string;
  buttonText: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateButtonText: string;
  basePath: string;

  // Props para la sección FAQ
  faqTitle: string;
  faqDescription: string;
  faqs: FAQ[];

  // Props para la sección de contacto
  contactTitle: string;
  contactSchedule: string;
  contactButtonText: string;
}

export default function PageWithFAQ({
  heroTitle,
  heroDescription,
  infoBarItems,
  articles,
  categories,
  searchPlaceholder,
  buttonText,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateButtonText,
  basePath,
  faqTitle,
  faqDescription,
  faqs,
  contactTitle,
  contactSchedule,
  contactButtonText,
}: PageWithFAQProps) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSubSection title={heroTitle} description={heroDescription} />

      {/* Sección de información importante */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {infoBarItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon}
                <p className="text-sm font-medium text-gray-600">
                  {item.label}{" "}
                  <span className="text-gray-900">{item.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección principal de contenido */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="py-8">
            <ArticlesGrid
              articles={articles}
              categories={categories}
              searchPlaceholder={searchPlaceholder}
              buttonText={buttonText}
              emptyStateTitle={emptyStateTitle}
              emptyStateDescription={emptyStateDescription}
              emptyStateButtonText={emptyStateButtonText}
              showUrgentBadge={true}
              showSearch={true}
              basePath={basePath}
            />
          </div>
        </div>
      </section>

      {/* Sección de preguntas frecuentes */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              {faqTitle}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">{faqDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                  {faq.question}
                </h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Ver más preguntas frecuentes
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#3D8B37] mr-3" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    {contactTitle}
                  </h4>
                  <p className="text-gray-600">{contactSchedule}</p>
                </div>
              </div>
              <a
                href="/contacto"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-colors"
              >
                {contactButtonText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
