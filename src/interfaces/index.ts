export interface ContactoForm {
    nombre: string;
    email: string;
    mensaje: string;
  }

export interface articlesItem {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl: string;
    categoria: string;
    content?: string;
  }

export interface QuickAccessItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
  }