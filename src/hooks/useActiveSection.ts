'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Uses IntersectionObserver to detect which section is currently visible
 * in the viewport and returns its id.
 *
 * @param sectionIds - ordered list of section element IDs to observe
 */
export const useActiveSection = (sectionIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const visibleSections = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.intersectionRatio)
        })

        // Pick the section with the highest intersection ratio
        let bestId: string | null = null
        let bestRatio = 0
        sectionIds.forEach((id) => {
          const ratio = visibleSections.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })

        if (bestId && bestRatio > 0) {
          setActiveId(bestId)
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
    // sectionIds is a stable reference (derived from a constant in usage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return activeId
}
