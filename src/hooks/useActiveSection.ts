'use client'

import { useEffect, useRef, useState } from 'react'

/** Delay after mount before IntersectionObserver is activated (ms). */
const OBSERVER_READINESS_DELAY_MS = 500

/**
 * Uses IntersectionObserver to detect which section is currently visible
 * in the viewport and returns its id.
 *
 * A readiness delay is applied after mount before the observer is activated.
 * This prevents hydration-time intersection events (caused by layout shifts or
 * browser scroll restoration) from incorrectly marking a section deep in the
 * page (e.g. "8. Concluzii") as active on load.
 *
 * @param sectionIds - ordered list of section element IDs to observe
 */
export const useActiveSection = (sectionIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)
  const [isReady, setIsReady] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Wait for the page to settle (hydration, layout shifts, browser scroll
  // restoration) before enabling scroll observation.
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), OBSERVER_READINESS_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isReady) return

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
    // isReady is the intentional trigger for this effect.
    // sectionIds is a stable reference (derived from a constant in usage).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  return activeId
}
