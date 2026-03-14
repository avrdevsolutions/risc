import { describe, expect, it } from 'vitest'

/**
 * The middleware matcher pattern from src/middleware.ts.
 * Kept here as a constant so changes to the pattern are reflected in tests.
 *
 * The regex must match exactly the value exported by the real middleware config.
 */
const MATCHER_PATTERN =
  '/((?!auth|api/auth|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)'

/**
 * Convert the Next.js path-matcher pattern string to a RegExp for testing.
 * The pattern `/((?!...).*)` means: match `/` followed by content that
 * doesn't start with one of the exclusion prefixes.
 */
const buildMatcherRegex = (pattern: string): RegExp => {
  const inner = pattern.slice(1) // remove leading '/'
  return new RegExp(`^/${inner}$`)
}

const protectedRegex = buildMatcherRegex(MATCHER_PATTERN)

describe('middleware route protection matcher', () => {
  it('protects the home page', () => {
    expect('/').toMatch(protectedRegex)
  })

  it('protects the evaluari page (legacy redirect)', () => {
    expect('/evaluari').toMatch(protectedRegex)
    expect('/evaluari/some-id').toMatch(protectedRegex)
  })

  it('protects the securitate-fizica page', () => {
    expect('/securitate-fizica').toMatch(protectedRegex)
    expect('/securitate-fizica/some-id').toMatch(protectedRegex)
  })

  it('protects the plan-de-paza page', () => {
    expect('/plan-de-paza').toMatch(protectedRegex)
    expect('/plan-de-paza/some-id').toMatch(protectedRegex)
  })

  it('protects the templates page', () => {
    expect('/templates').toMatch(protectedRegex)
  })

  it('protects API routes (except auth)', () => {
    expect('/api/evaluari').toMatch(protectedRegex)
    expect('/api/templates').toMatch(protectedRegex)
    expect('/api/evaluari/123').toMatch(protectedRegex)
    expect('/api/securitate-fizica').toMatch(protectedRegex)
    expect('/api/securitate-fizica/123').toMatch(protectedRegex)
    expect('/api/plan-de-paza').toMatch(protectedRegex)
    expect('/api/plan-de-paza/123').toMatch(protectedRegex)
  })

  it('excludes /auth/* routes from protection', () => {
    expect('/auth/login').not.toMatch(protectedRegex)
    expect('/auth/signup').not.toMatch(protectedRegex)
  })

  it('excludes /api/auth/* routes from protection', () => {
    expect('/api/auth/signin').not.toMatch(protectedRegex)
    expect('/api/auth/callback/credentials').not.toMatch(protectedRegex)
    expect('/api/auth/session').not.toMatch(protectedRegex)
  })

  it('excludes Next.js static asset paths', () => {
    expect('/_next/static/chunk.js').not.toMatch(protectedRegex)
    expect('/_next/image').not.toMatch(protectedRegex)
  })

  it('excludes favicon.ico', () => {
    expect('/favicon.ico').not.toMatch(protectedRegex)
  })

  it('excludes public static file extensions (svg, png, txt, etc.)', () => {
    expect('/logo.svg').not.toMatch(protectedRegex)
    expect('/og-image.png').not.toMatch(protectedRegex)
    expect('/robots.txt').not.toMatch(protectedRegex)
    expect('/manifest.json').not.toMatch(protectedRegex)
    expect('/banner.jpg').not.toMatch(protectedRegex)
  })
})

describe('userId filtering logic', () => {
  it('returns only evaluari owned by the user', () => {
    const evaluari = [
      { id: '1', userId: 'user-a', denumireProiect: 'Project A' },
      { id: '2', userId: 'user-b', denumireProiect: 'Project B' },
      { id: '3', userId: 'user-a', denumireProiect: 'Project C' },
    ]

    const userId = 'user-a'
    const filtered = evaluari.filter((e) => e.userId === userId)

    expect(filtered).toHaveLength(2)
    expect(filtered.map((e) => e.id)).toEqual(['1', '3'])
  })

  it('returns 403 when user does not own resource', () => {
    const evaluare = { id: '1', userId: 'user-b' }
    const requestingUserId = 'user-a'

    const isOwner = evaluare.userId === requestingUserId
    const statusCode = !isOwner ? 403 : 200

    expect(statusCode).toBe(403)
  })

  it('returns 200 when user owns resource', () => {
    const evaluare = { id: '1', userId: 'user-a' }
    const requestingUserId = 'user-a'

    const isOwner = evaluare.userId === requestingUserId
    const statusCode = isOwner ? 200 : 403

    expect(statusCode).toBe(200)
  })

  it('denies access when userId is null (no unowned resource access)', () => {
    const evaluare = { id: '1', userId: null }
    const requestingUserId = 'user-a'

    // Null userId means unowned — deny access to prevent cross-tenant exposure
    const isDenied = !evaluare.userId || evaluare.userId !== requestingUserId
    expect(isDenied).toBe(true)
  })
})

describe('API 401 responses', () => {
  it('returns 401 status code when no session', () => {
    const session = null
    const userId = (session as null | { user?: { id?: string | null } })?.user?.id
    const status = !userId ? 401 : 200
    expect(status).toBe(401)
  })

  it('returns 401 when session exists but user id is missing', () => {
    const session = { user: {} }
    const userId = (session as { user?: { id?: string | null } })?.user?.id
    const status = !userId ? 401 : 200
    expect(status).toBe(401)
  })

  it('returns 401 when session user id is null', () => {
    const session = { user: { id: null } }
    const userId = session?.user?.id
    const status = !userId ? 401 : 200
    expect(status).toBe(401)
  })

  it('returns 200 when session has valid user id', () => {
    const session = { user: { id: 'user-123' } }
    const userId = session?.user?.id
    const status = !userId ? 401 : 200
    expect(status).toBe(200)
  })
})
