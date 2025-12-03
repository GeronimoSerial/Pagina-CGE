import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(req: NextRequest) {
    const sessionCookie = getSessionCookie(req);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // We can't easily validate the role here without a DB call or decoding the token if it's a JWT.
    // better-auth's getSessionCookie just gets the string.
    // For now, we'll rely on the presence of the cookie for general protection, 
    // and let the layout/page handle granular role checks if needed, 
    // OR if we assume the cookie is a JWT we could decode it.
    // However, for "session SOLO por cookies", usually implies we trust the cookie or validate it via API.
    // But proxy is synchronous-ish or edge-compatible.
    
    // If we need to check role for /configuracion, we might need to fetch session.
    // But fetching session in proxy might be expensive or not allowed if it needs DB.
    // Let's start with basic protection: if no cookie, redirect to login.
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
