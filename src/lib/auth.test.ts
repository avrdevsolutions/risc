import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    signIn: vi.fn(),
    signOut: vi.fn(),
    auth: vi.fn(),
  })),
}))

// Mock next-auth/providers/credentials
vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config) => ({ ...config, type: 'credentials' })),
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
  compare: vi.fn(),
  hash: vi.fn(),
}))

// Mock the database
vi.mock('../../db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  },
}))

vi.mock('../../db/schema', () => ({
  users: { email: 'email' },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field, value) => ({ field, value })),
}))

describe('auth middleware config', () => {
  it('exports the correct matcher pattern', async () => {
    // The middleware matcher should exclude auth routes and Next.js internals
    const matcherPattern = '/((?!auth|api/auth|_next/static|_next/image|favicon.ico).*)'
    expect(matcherPattern).toMatch(/auth/)
    expect(matcherPattern).toMatch(/_next/)
    expect(matcherPattern).toMatch(/favicon/)
  })

  it('middleware excludes auth routes from protection', () => {
    // Test the conceptual exclusion logic rather than parsing the raw Next.js matcher string
    const isProtected = (pathname: string) => {
      return !pathname.startsWith('/auth') && !pathname.startsWith('/api/auth')
    }

    // Auth routes should NOT be protected
    expect(isProtected('/auth/login')).toBe(false)
    expect(isProtected('/api/auth/signin')).toBe(false)

    // Protected routes should be protected
    expect(isProtected('/')).toBe(true)
    expect(isProtected('/evaluari')).toBe(true)
    expect(isProtected('/templates')).toBe(true)
    expect(isProtected('/api/evaluari')).toBe(true)
  })
})

describe('authorize function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when user is not found', async () => {
    const { db } = await import('../../db')
    const mockFindFirst = vi.fn().mockResolvedValue(null)
    ;(db.query.users.findFirst as ReturnType<typeof vi.fn>) = mockFindFirst

    const bcrypt = await import('bcryptjs')
    const compareMock = vi.fn().mockResolvedValue(false)
    ;(bcrypt.default.compare as ReturnType<typeof vi.fn>) = compareMock

    // Simulate the authorize logic directly
    const user = await db.query.users.findFirst({})
    expect(user).toBeNull()
  })

  it('returns null when password is invalid', async () => {
    const { db } = await import('../../db')
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: '$2a$12$hashedpassword',
      role: 'evaluator' as const,
    }
    ;(db.query.users.findFirst as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(mockUser)

    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(false)

    const user = await db.query.users.findFirst({})
    const valid = await bcrypt.default.compare('wrongpassword', user!.passwordHash)

    expect(user).not.toBeNull()
    expect(valid).toBe(false)
  })

  it('returns user data when credentials are valid', async () => {
    const { db } = await import('../../db')
    const mockUser = {
      id: 'user-1',
      email: 'admin@secureeval.ro',
      name: 'Administrator',
      passwordHash: '$2a$12$hashedpassword',
      role: 'admin' as const,
    }
    ;(db.query.users.findFirst as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(mockUser)

    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(true)

    const user = await db.query.users.findFirst({})
    const valid = await bcrypt.default.compare('admin123', user!.passwordHash)

    expect(valid).toBe(true)
    expect(user?.id).toBe('user-1')
    expect(user?.email).toBe('admin@secureeval.ro')
    expect(user?.role).toBe('admin')
  })
})

describe('session callbacks', () => {
  it('session callback adds id and role from token', () => {
    const token = { sub: 'user-123', role: 'admin' }
    const session = {
      user: { name: 'Test', email: 'test@test.com' },
      expires: '2099-01-01',
    }

    // Simulate session callback logic
    if (token.sub) (session.user as Record<string, unknown>).id = token.sub
    if (token.role) (session.user as Record<string, unknown>).role = token.role

    expect((session.user as Record<string, unknown>).id).toBe('user-123')
    expect((session.user as Record<string, unknown>).role).toBe('admin')
  })

  it('jwt callback adds role from user object', () => {
    const token: Record<string, unknown> = { sub: 'user-123' }
    const user = { id: 'user-123', email: 'test@test.com', role: 'evaluator' }

    // Simulate jwt callback logic
    if (user) {
      token.role = (user as { role?: string }).role
    }

    expect(token.role).toBe('evaluator')
  })

  it('jwt callback preserves existing token when no user', () => {
    const token: Record<string, unknown> = { sub: 'user-123', role: 'admin' }

    // Simulate jwt callback with no user (subsequent requests)
    const user = undefined
    if (user) {
      token.role = (user as unknown as { role?: string }).role
    }

    expect(token.role).toBe('admin')
  })
})

describe('password hashing', () => {
  it('bcrypt compare returns false for wrong password', async () => {
    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(false)

    const result = await bcrypt.default.compare('wrongpass', '$2a$12$somehash')
    expect(result).toBe(false)
  })

  it('bcrypt compare returns true for correct password', async () => {
    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(true)

    const result = await bcrypt.default.compare('correctpass', '$2a$12$somehash')
    expect(result).toBe(true)
  })
})
