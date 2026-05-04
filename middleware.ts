import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth_token')?.value;
    console.log(`[Middleware] Rota: ${pathname}, Token presente: ${!!token}`);

    if (!token) {
      console.log('[Middleware] Token ausente, redirecionando para login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.log(`[Middleware] Token inválido para a rota: ${pathname}`);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    console.log(`[Middleware] Autorizado: ${payload.email}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
