import React from "react";
import { HelpCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

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
  <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-t border-gray-100">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
          {faqTitle}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {faqDescription}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#3D8B37]/20 group"
          >
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-start group-hover:text-[#3D8B37] transition-colors">
              <HelpCircle className="h-6 w-6 mr-3 text-[#3D8B37] flex-shrink-0 mt-0.5" />
              {faq.question}
            </h4>
            <p className="text-gray-600 ml-9">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;
