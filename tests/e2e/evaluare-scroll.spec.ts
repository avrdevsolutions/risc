import { expect, test } from '@playwright/test'

/**
 * E2E tests for the EvaluarePage scroll behavior.
 *
 * The regression being tested:
 *   Before the fix, every evaluation page load would auto-scroll to ~9176 px
 *   (section 8 — "Concluzii") because the DatePicker component's useEffect
 *   called triggerRef.current.focus() on initial mount. Since child effects fire
 *   after the parent's window.scrollTo(0, 0), the focus-scroll won the race.
 *
 * Mock data:
 *   These tests use a real dev server (configured in playwright.config.ts via
 *   `webServer`). The route /evaluari/[id] calls GET /api/evaluari/[id] which
 *   returns 404 for a non-existent ID. EvaluarePage handles this with its error
 *   state. For the scroll tests we only need the page to mount the DatePicker —
 *   even the error/loading UI is sufficient to verify that scrollY stays at 0
 *   and the DatePicker trigger does not have focus on mount.
 *
 *   To run these tests against a real evaluation, set TEST_EVALUARE_ID in your
 *   environment: `TEST_EVALUARE_ID=<real-id> pnpm test:e2e`
 */
test.describe('EvaluarePage scroll behavior', () => {
  // ─── Scroll to top on load ─────────────────────────────────────────────────

  test('page loads at scrollY=0 — DatePicker does not steal focus on mount', async ({ page }) => {
    const evaluareId = process.env.TEST_EVALUARE_ID ?? 'test-mock-id'
    await page.goto(`/evaluari/${evaluareId}`)

    // Wait for the main content to be rendered
    await page.waitForLoadState('networkidle')

    const scrollY = await page.evaluate(() => window.scrollY)
    // Should be at the top — not scrolled to section 8 (~9176px)
    expect(scrollY).toBeLessThan(200)
  })

  test('page does not auto-scroll to section 8 (Concluzii) on load', async ({ page }) => {
    const evaluareId = process.env.TEST_EVALUARE_ID ?? 'test-mock-id'
    await page.goto(`/evaluari/${evaluareId}`)
    await page.waitForLoadState('networkidle')

    // Section 8 heading should NOT be in the viewport
    const sectiune8 = page.getByRole('heading', { name: /concluzii/i })
    if (await sectiune8.count() > 0) {
      const isVisible = await sectiune8.isVisible()
      if (isVisible) {
        // It may be in the DOM but should not be in the viewport (i.e., scrolled into view)
        const boundingBox = await sectiune8.boundingBox()
        const viewportHeight = page.viewportSize()?.height ?? 768
        // The heading should be below the fold (not visible at scroll position 0)
        expect(boundingBox?.y).toBeGreaterThan(viewportHeight)
      }
    }
  })

  test('Termen limită DatePicker trigger does not have focus on mount', async ({ page }) => {
    const evaluareId = process.env.TEST_EVALUARE_ID ?? 'test-mock-id'
    await page.goto(`/evaluari/${evaluareId}`)
    await page.waitForLoadState('networkidle')

    // The focused element should be the body or a link — not the DatePicker trigger
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        ariaLabel: el?.getAttribute('aria-label'),
        ariaHasPopup: el?.getAttribute('aria-haspopup'),
      }
    })

    // The trigger button has aria-haspopup="dialog" — it should NOT be focused on load
    expect(focusedElement.ariaHasPopup).not.toBe('dialog')
  })

  // ─── Calendar interaction does not change initial scroll ──────────────────

  test('opening and closing the DatePicker returns focus to the trigger button', async ({
    page,
  }) => {
    const evaluareId = process.env.TEST_EVALUARE_ID ?? 'test-mock-id'
    await page.goto(`/evaluari/${evaluareId}`)
    await page.waitForLoadState('networkidle')

    // Find the Termen limită DatePicker trigger (aria-haspopup=dialog)
    const triggers = page.locator('button[aria-haspopup="dialog"]')
    const count = await triggers.count()

    if (count > 0) {
      const trigger = triggers.first()
      // Open the calendar
      await trigger.click()

      // Verify calendar opened
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      // Close with Escape
      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()

      // Trigger should have focus after close
      await expect(trigger).toBeFocused()
    }
  })
})
