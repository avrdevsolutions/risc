'use client'

import { ConflictDialog } from './ConflictDialog'
import { SyncButton } from './SyncButton'

/**
 * Composes the floating SyncButton and the ConflictDialog into a single
 * component so the sync section barrel exports a single public surface.
 */
export const SyncControls = () => (
  <>
    <SyncButton />
    <ConflictDialog />
  </>
)
