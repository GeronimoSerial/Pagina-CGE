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

export interface ImagenCarruselGenerica {
  imagen?: string;
  src?: string;
  titulo?: string;
  alt?: string;
  descripcion?: string;
}

export interface ArticlesGridProps {
  articles?: articlesItem[];
  title?: string;
  subtitle?: string;
}

export interface SocialMediaProps {
  facebookUrl?: string;
  instagramUrl?: string;
  title?: string;
  description?: string;
}

export interface Escuela {
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
