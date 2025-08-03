//Common interfaces
export interface ContactForm {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  area: string;
}

export interface QuickAccessItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export interface GenericCarouselImage {
  imagen?: string;
  src?: string;
  titulo?: string;
  alt?: string;
  descripcion?: string;
}

export interface SocialMediaProps {
  facebookUrl?: string;
  instagramUrl?: string;
  title?: string;
  description?: string;
}

export interface School {
  cue: number;
  nombre: string;
  director: string;
  matricula2024: number;
  matricula2025: number;
  tipoEscuela: string;
  departamento: string;
  localidad: string;
  turno: string;
  ubicacion: string;
  cabecera: string;
  supervisorID?: number;
  mail?: string | null;
  fechaFundacion?: string;
  fechaFundacion2?: number;
  zona?: string;
  categoria?: string;
}
export interface Supervisor {
  id: number;
  nombre: string;
}

export interface NewsItem {
  id: number;
  autor?: string;
  titulo: string;
  resumen: string;
  categoria: string;
  esImportante: boolean;
  portada: { url: string };
  slug: string;
  contenido: string;
  imagen: { url: string; width: number; height: number }[];
  imagenes?: any[];
  publicado: boolean;
  fecha: string;
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}
