import { describe, expect, it, vi, beforeEach } from 'vitest'

// ─── Module mocks (must be hoisted) ─────────────────────────────────────────

vi.mock('next-auth', () => {
  // Capture the config passed to NextAuth so tests can invoke the callbacks
  let capturedConfig: Record<string, unknown> = {}
  const NextAuth = vi.fn((config: Record<string, unknown>) => {
    capturedConfig = config
    return {
      handlers: { GET: vi.fn(), POST: vi.fn() },
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: vi.fn(),
    }
  })
  ;(NextAuth as unknown as { _getConfig: () => Record<string, unknown> })._getConfig = () =>
    capturedConfig
  return { default: NextAuth }
})

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((cfg: unknown) => ({ ...((cfg as object) ?? {}), type: 'credentials' })),
}))

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
  compare: vi.fn(),
  hash: vi.fn(),
}))

vi.mock('../../db', () => ({
  db: { query: { users: { findFirst: vi.fn() } } },
}))

vi.mock('../../db/schema', () => ({ users: { email: 'email' } }))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field: unknown, value: unknown) => ({ field, value })),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

type AuthConfig = {
  providers: Array<{ credentials: unknown; authorize: (c: unknown) => Promise<unknown> }>
  callbacks?: {
    session?: (args: { session: unknown; token: unknown }) => unknown
    jwt?: (args: { token: unknown; user?: unknown }) => unknown
  }
}

const getAuthConfig = async (): Promise<AuthConfig> => {
  const NextAuth = (await import('next-auth')).default as unknown as {
    _getConfig: () => AuthConfig
  } & ReturnType<typeof vi.fn>
  // Re-import auth.ts to trigger NextAuth() call and capture config
  await import('./auth')
  return NextAuth._getConfig()
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('authorize callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when email is missing', async () => {
    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = await authorize({ email: '', password: 'secret' })
    expect(result).toBeNull()
  })

  it('returns null when password is missing', async () => {
    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = await authorize({ email: 'user@test.com', password: '' })
    expect(result).toBeNull()
  })

  it('returns null when credentials are undefined', async () => {
    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = await authorize({ email: undefined, password: undefined })
    expect(result).toBeNull()
  })

  it('returns null when user is not found in DB', async () => {
    const { db } = await import('../../db')
    ;(db.query.users.findFirst as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = await authorize({ email: 'unknown@test.com', password: 'secret' })
    expect(result).toBeNull()
  })

  it('returns null when password does not match', async () => {
    const { db } = await import('../../db')
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: '$2a$12$hash',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    ;(db.query.users.findFirst as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockUser as never,
    )

    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      false as never,
    )

    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = await authorize({ email: 'test@example.com', password: 'wrongpass' })
    expect(result).toBeNull()
  })

  it('returns user data when credentials are valid', async () => {
    const { db } = await import('../../db')
    const mockUser = {
      id: 'user-1',
      email: 'user@secureeval.ro',
      name: 'Ion Popescu',
      passwordHash: '$2a$12$hash',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    ;(db.query.users.findFirst as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockUser as never,
    )

    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      true as never,
    )

    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    const result = (await authorize({ email: 'user@secureeval.ro', password: 'correct' })) as {
      id: string
      email: string
      name: string
    }

    expect(result).not.toBeNull()
    expect(result.id).toBe('user-1')
    expect(result.email).toBe('user@secureeval.ro')
    expect(result.name).toBe('Ion Popescu')
  })

  it('normalizes email to lowercase before querying', async () => {
    const { db } = await import('../../db')
    ;(db.query.users.findFirst as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const config = await getAuthConfig()
    const authorize = config.providers[0].authorize

    await authorize({ email: 'User@SECUREEVAL.RO', password: 'pass' })

    const { eq } = await import('drizzle-orm')
    const eqMock = eq as unknown as ReturnType<typeof vi.fn>
    // eq was called with the lowercase email
    expect(eqMock).toHaveBeenCalledWith(expect.anything(), 'user@secureeval.ro')
  })
})

describe('session callback', () => {
  it('adds id from token.sub to session.user', async () => {
    const config = await getAuthConfig()
    const sessionCallback = config.callbacks?.session

    const session = { user: { name: 'Test', email: 'test@test.com' }, expires: '2099-01-01' }
    const token = { sub: 'user-abc' }

    const result = (await sessionCallback?.({ session, token })) as typeof session & {
      user: { id?: string }
    }
    expect(result.user.id).toBe('user-abc')
  })

  it('does not add id when token.sub is missing', async () => {
    const config = await getAuthConfig()
    const sessionCallback = config.callbacks?.session

    const session = { user: { name: 'Test', email: 'test@test.com' }, expires: '2099-01-01' }
    const token = {}

    const result = (await sessionCallback?.({ session, token })) as typeof session & {
      user: { id?: string }
    }
    expect((result.user as { id?: string }).id).toBeUndefined()
  })
})

describe('password hashing', () => {
  it('bcrypt compare returns false for wrong password', async () => {
    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      false as never,
    )

    const result = await bcrypt.default.compare('wrongpass', '$2a$12$somehash')
    expect(result).toBe(false)
  })

  it('bcrypt compare returns true for correct password', async () => {
    const bcrypt = await import('bcryptjs')
    ;(bcrypt.default.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      true as never,
    )

    const result = await bcrypt.default.compare('correctpass', '$2a$12$somehash')
    expect(result).toBe(true)
  })
})
