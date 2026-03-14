import { NextResponse } from 'next/server'

/**
 * Checks whether the requesting user owns the given resource.
 *
 * Returns a 403 NextResponse if the resource has a userId and it does not
 * match the requesting user. Returns null if access is allowed (either the
 * resource has no userId — legacy data — or the userId matches).
 */
export const checkOwnership = (
  resourceUserId: string | null,
  requestingUserId: string,
): NextResponse | null => {
  if (resourceUserId && resourceUserId !== requestingUserId) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  return null
}
