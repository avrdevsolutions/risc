/**
 * Environment variable validation and access.
 *
 * ALWAYS import env vars from this file, never access process.env directly.
 * This ensures all variables are validated at startup.
 *
 * See docs/adrs/0006-environment.md for the full strategy.
 */

import { z } from 'zod'

// =============================================================================
// Schema Definition
// =============================================================================

const envSchema = z.object({
  // ---------------------------------------------------------------------------
  // Server-only variables (no NEXT_PUBLIC_ prefix)
  // ---------------------------------------------------------------------------

  /** Node environment */
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** Internal API base URL */
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),

  /** Database connection string (optional until DB is added) */
  DATABASE_URL: z.string().url().optional(),

  /** Auth secret for session encryption (optional until auth is added) */
  AUTH_SECRET: z.string().min(32).optional(),

  // ---------------------------------------------------------------------------
  // Public variables (NEXT_PUBLIC_ prefix - exposed to client)
  // ---------------------------------------------------------------------------

  /** Base URL of the application */
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  /** Environment name for display/logging */
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
})

// =============================================================================
// Validation
// =============================================================================

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

// =============================================================================
// Export
// =============================================================================

/**
 * Validated environment variables.
 *
 * @example
 * import { env } from '@/lib/env'
 * console.log(env.NEXT_PUBLIC_APP_URL)
 */
export const env = parseEnv()

/**
 * Type of the validated environment.
 */
export type Env = z.infer<typeof envSchema>

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Check if running in production.
 */
export const isProduction = () => env.NODE_ENV === 'production'

/**
 * Check if running in development.
 */
export const isDevelopment = () => env.NODE_ENV === 'development'

/**
 * Check if running in test environment.
 */
export const isTest = () => env.NODE_ENV === 'test'
