import { NextResponse } from 'next/server'

/**
 * Checks whether the requesting user owns the given resource.
 *
 * Returns a 403 NextResponse if:
 * - `resourceUserId` is null/undefined (unowned/legacy records are not accessible
 *   to prevent cross-tenant data exposure — assign ownership before granting access)
 * - `resourceUserId` does not match `requestingUserId`
 *
 * Returns null if access is allowed (userId matches).
 */
export const checkOwnership = (
  resourceUserId: string | null,
  requestingUserId: string,
): NextResponse | null => {
  if (!resourceUserId || resourceUserId !== requestingUserId) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  return null
}
