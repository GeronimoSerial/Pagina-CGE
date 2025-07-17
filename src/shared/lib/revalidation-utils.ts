import { revalidatePath } from 'next/cache';

/**
 * Utilidades para revalidación manual del ISR
 */

export interface RevalidateOptions {
  paths?: string[];
  tags?: string[];
  force?: boolean;
}

/**
 * Revalida múltiples rutas de forma optimizada
 */
export async function revalidateMultiplePaths(paths: string[]): Promise<void> {
  const revalidatePromises = paths.map(path => revalidatePath(path));
  await Promise.allSettled(revalidatePromises);
}

/**
 * Revalida todas las rutas relacionadas con trámites
 */
export async function revalidateTramitesCache(): Promise<void> {
  const paths = [
    '/tramites',
    '/tramites/introduccion', // Ruta por defecto
    '/' // Homepage que puede mostrar trámites destacados
  ];
  
  await revalidateMultiplePaths(paths);
}

/**
 * Revalida todas las rutas relacionadas con noticias
 */
export async function revalidateNoticiasCache(): Promise<void> {
  const paths = [
    '/', // Homepage con noticias destacadas
    '/noticias'
  ];
  
  await revalidateMultiplePaths(paths);
}

/**
 * Revalida cache completo (usar con precaución)
 * Solo para Trámites y Noticias - otros contenidos son estáticos
 */
export async function revalidateFullCache(): Promise<void> {
  const paths = [
    '/',           // Homepage con LatestNews
    '/noticias',   // Listado de noticias
    '/tramites'    // Página de trámites
  ];
  
  await revalidateMultiplePaths(paths);
}

/**
 * Obtiene las rutas que deberían revalidarse para una colección específica
 * Solo configurado para Trámites y Noticias - otros contenidos son estáticos
 */
export function getRevalidationPathsForCollection(collection: string, itemSlug?: string): string[] {
  const basePaths: Record<string, string[]> = {
    // Noticias: Revalidar home (LatestNews), listado y detalle
    noticias: ['/', '/noticias'],
    // Trámites: Solo revalidar páginas de trámites
    tramites: ['/tramites']
  };

  const paths = basePaths[collection] || [];
  
  // Agregar ruta específica del item si tiene slug
  if (itemSlug) {
    if (collection === 'noticias') {
      paths.push(`/noticias/${itemSlug}`);
    } else if (collection === 'tramites') {
      paths.push(`/tramites/${itemSlug}`);
    }
  }

  return paths;
}
