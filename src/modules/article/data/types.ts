import { FAQ } from "../../faqs/faqs";

interface InfoBarItem {
    icon: React.ReactNode;
    label: string;
    value: string;
}
  
export interface PageWithFAQProps {
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
    contactUrl?: string;
  
    //prop para el sorted
    isNoticia?: boolean;
  
    // Props para la paginación del servidor
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }