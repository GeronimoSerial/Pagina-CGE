import React from "react";
import { HelpCircle } from "lucide-react";
import { FAQ, FAQLink } from "../faqs/faqs";

interface FAQSectionProps {
  faqTitle: string;
  faqDescription: string;
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({
  faqTitle,
  faqDescription,
  faqs,
}) => (
  <section className="bg-gray-50 border-t border-gray-100 z-10 relative py-16">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-6 z-100 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent leading-relaxed">
          {faqTitle}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {faqDescription}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex items-start mb-2">
              <div className="bg-[#3D8B37]/10 p-1 rounded-lg mr-4">
                <HelpCircle className="h-6 w-6 text-[#3D8B37]" />
              </div>
              <h4 className="font-semibold text-lg text-gray-800">
                {faq.question}
              </h4>
            </div>
            <div className="flex flex-col h-full justify-between">
              <div className="ml-12">
                <p className="text-gray-600">{faq.answer.text}</p>
              </div>
              {faq.answer.links && faq.answer.links.length > 0 && (
                <div className="mt-4 space-y-2 ml-12 ">
                  {faq.answer.links.map((link: FAQLink, linkIndex: number) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      className="inline-block text-[#3D8B37] hover:text-[#2D6A27] font-medium transition-colors duration-200"
                    >
                      {link.text} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;
