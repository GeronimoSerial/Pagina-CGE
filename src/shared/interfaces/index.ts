//Interfaces comunes
export interface ContactoForm {
  nombre: string;
  email: string;
  mensaje: string;
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

// Interface para archivos de Directus
export interface DirectusFile {
  id: string;
  filename_download: string;
  title: string;
  type: string;
  width: number;
  height: number;
  description?: string;
  filesize: number;
}

// Interface para relación de imágenes en Directus
export interface DirectusImageRelation {
  directus_files_id: DirectusFile;
}

export interface Noticia {
  id: number;
  autor?: string;
  titulo: string;
  resumen: string;
  categoria: string; // Corregido: las categorías son strings en Directus
  esImportante: boolean;
  portada: string; // Cambió de { url: string } a string (UUID)
  slug: string;
  contenido: string;
  imagenes: DirectusImageRelation[]; // Cambió de imagen a imagenes con nueva estructura
  status: string; // Cambió de publicado a status
  fecha: string;
  date_created?: string; // Cambió de createdAt a date_created
  user_created?: string;
  user_updated?: string;
  date_updated?: string;
  metaTitle?: string;
  metaDescription?: string;
}