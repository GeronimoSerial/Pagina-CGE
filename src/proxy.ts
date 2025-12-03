import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validación básica: si existe la cookie de sesión, permitir acceso.
  // La validación granular de roles se hace en los componentes/páginas específicas.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
