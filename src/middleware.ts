/**
 * Next.js Middleware
 *
 * Authentication-based route protection.
 * All routes except /auth/* and Next.js internals require a valid session.
 *
 * See docs/adrs/0008-middleware.md and docs/adrs/0010-authentication.md
 */

export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/((?!auth|api/auth|_next/static|_next/image|favicon.ico).*)'],
}

