import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirigir a la página de inicio si se accede a la raíz
  if (request.nextUrl.pathname === '/tramites') {
    return NextResponse.redirect(
      new URL('/tramites/introduccion', request.url),
    );
  }

  // Permitir el acceso a otras rutas
  return NextResponse.next();
}
