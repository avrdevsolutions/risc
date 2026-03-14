/**
 * Next.js Middleware
 *
 * Authentication-based route protection.
 * All routes except /auth/*, /api/auth/*, Next.js internals, and static
 * public assets require a valid session.
 *
 * See docs/adrs/0008-middleware.md and docs/adrs/0010-authentication.md
 */

export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: [
    '/((?!auth|api/auth|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)',
  ],
}

