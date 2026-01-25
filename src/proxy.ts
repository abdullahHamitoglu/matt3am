import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAuth = request.cookies?.has('auth_token')
  const localeCookie = request.cookies?.get('NEXT_LOCALE')
  const Locale = localeCookie?.value || 'en'

  console.log('proxy is working')

  // Ignore static files and images
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)
  ) {
    return NextResponse.next()
  }

  // Ignore admin routes - no localization
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Redirect root path to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${Locale}`, request.nextUrl))
  }

  // Proxy login to dashboard if authenticated
  if (pathname.includes('/login') && userAuth) {
    return NextResponse.rewrite(new URL(`/${Locale}/dashboard`, request.nextUrl))
  }

  // Proxy dashboard to login if not authenticated
  if (!userAuth && pathname.startsWith(`/${Locale}/dashboard`)) {
    return NextResponse.rewrite(new URL(`/${Locale}/login`, request.nextUrl))
  }

  // Apply i18n middleware to frontend routes only
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Frontend only - all localized routes and root
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
