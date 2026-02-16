import { proxy } from './src/proxy'

export default proxy

// Config must be exported directly in middleware.ts, not re-exported
export const config = {
  matcher: [
    // Frontend only - all localized routes and root
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
