import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  // ─── Focus-on-mount regression (Bug 1: auto-scroll to Concluzii) ───────────
  //
  // Before the fix, the useEffect([open]) fired on mount with open=false and
  // called triggerRef.current.focus(). Because DatePicker is rendered inside
  // ConcluziiSection (§8), this scrolled the page to ~9176 px on every load.
  // The hasOpenedRef guard prevents focus being returned until the user has
  // actually opened the picker at least once.

  it('does NOT steal focus when first mounted (trigger is not focused on mount)', () => {
    render(
      <div>
        <button data-testid='other-button'>Other element</button>
        <DatePicker />
      </div>,
    )
    const trigger = screen.getByRole('button', { name: /selectați data/i })
    // Verify the trigger is NOT focused after mount
    expect(document.activeElement).not.toBe(trigger)
  })

  it('does NOT call focus() on the trigger button during mount', () => {
    const { container } = render(<DatePicker />)
    const trigger = container.querySelector('button[aria-haspopup="dialog"]')
    expect(trigger).not.toBeNull()
    // If the trigger had stolen focus it would be document.activeElement
    expect(document.activeElement).not.toBe(trigger)
  })

  // ─── Focus management after open → close ──────────────────────────────────

  it('returns focus to the trigger button after closing the calendar with Escape', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const trigger = screen.getByRole('button', { name: /selectați data/i })

    // Open the picker
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close via Escape
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('closes the calendar when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DatePicker />
        <div data-testid='outside' style={{ width: 100, height: 100 }}>
          Outside
        </div>
      </div>,
    )
    const trigger = screen.getByRole('button', { name: /selectați data/i })

    // Open the picker
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close by clicking outside
    await user.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('returns focus to the trigger button after closing via the Închide button', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const trigger = screen.getByRole('button', { name: /selectați data/i })

    // Open the picker
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close via the "Închide" button inside the dialog
    await user.click(screen.getByRole('button', { name: /închide/i }))
    expect(trigger).toHaveFocus()
  })

  // ─── Rendering ────────────────────────────────────────────────────────────

  it('renders the trigger button with placeholder text when no value', () => {
    render(<DatePicker placeholder='Alegeți data' />)
    expect(screen.getByText('Alegeți data')).toBeInTheDocument()
  })

  it('renders the formatted date when an ISO value is provided', () => {
    render(<DatePicker value='2026-03-14' />)
    // Should display "14 martie 2026"
    expect(screen.getByText('14 martie 2026')).toBeInTheDocument()
  })

  it('renders with custom aria-label on the trigger', () => {
    render(<DatePicker aria-label='Termen limită' />)
    expect(screen.getByRole('button', { name: 'Termen limită' })).toBeInTheDocument()
  })

  it('calendar is not visible before the trigger is clicked', () => {
    render(<DatePicker />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // ─── Open / close behavior ────────────────────────────────────────────────

  it('opens the calendar when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the calendar when the trigger is clicked again (toggle)', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const trigger = screen.getByRole('button', { name: /selectați data/i })
    await user.click(trigger)
    await user.click(trigger)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar via the Închide button', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    await user.click(screen.getByRole('button', { name: /închide/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // ─── Date selection ────────────────────────────────────────────────────────

  it('calls onChange with ISO date string when the Azi button is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<DatePicker value='2026-03-14' onChange={handleChange} />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    // Click the "Azi" (Today) button
    await user.click(screen.getByRole('button', { name: /^azi$/i }))
    expect(handleChange).toHaveBeenCalledOnce()
    // Should be called with an ISO date string (YYYY-MM-DD)
    const arg = handleChange.mock.calls[0][0] as string
    expect(arg).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('closes the calendar after a date is selected via the Azi button', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-03-14' onChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    await user.click(screen.getByRole('button', { name: /^azi$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // ─── Disabled state ────────────────────────────────────────────────────────

  it('does not open when disabled', async () => {
    const user = userEvent.setup()
    render(<DatePicker disabled />)
    const trigger = screen.getByRole('button', { name: /selectați data/i })
    expect(trigger).toBeDisabled()
    await user.click(trigger)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // ─── No value ─────────────────────────────────────────────────────────────

  it('shows the placeholder when value is undefined', () => {
    render(<DatePicker />)
    expect(screen.getByText('Selectați data...')).toBeInTheDocument()
  })

  // ─── Month navigation ─────────────────────────────────────────────────────

  it('navigates to the previous month when clicking Luna anterioară', async () => {
    const user = userEvent.setup()
    // Use a known month/year so we can verify navigation
    render(<DatePicker value='2026-03-14' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    const currentHeader = screen.getByText('Martie 2026')
    expect(currentHeader).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /luna anterioară/i }))
    expect(screen.getByText('Februarie 2026')).toBeInTheDocument()
  })

  it('navigates to the next month when clicking Luna următoare', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-03-14' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    await user.click(screen.getByRole('button', { name: /luna următoare/i }))
    expect(screen.getByText('Aprilie 2026')).toBeInTheDocument()
  })

  it('wraps month navigation from January to December when going previous', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-01-15' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    await user.click(screen.getByRole('button', { name: /luna anterioară/i }))
    expect(screen.getByText('Decembrie 2025')).toBeInTheDocument()
  })

  it('wraps month navigation from December to January when going next', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-12-01' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    await user.click(screen.getByRole('button', { name: /luna următoare/i }))
    expect(screen.getByText('Ianuarie 2027')).toBeInTheDocument()
  })

  // ─── aria-expanded reflects open state ────────────────────────────────────

  it('trigger has aria-expanded="false" when the calendar is closed', () => {
    render(<DatePicker />)
    expect(screen.getByRole('button', { name: /selectați data/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('trigger has aria-expanded="true" when the calendar is open', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    expect(screen.getByRole('button', { name: /selectați data/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  // ─── onChange not called on open/close without selection ──────────────────

  it('does not call onChange when opening then closing without selecting a date', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<DatePicker onChange={handleChange} />)

    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    await user.keyboard('{Escape}')

    expect(handleChange).not.toHaveBeenCalled()
  })

  // ─── Specific day click ────────────────────────────────────────────────────

  it('calls onChange with the correct ISO string when a specific day is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<DatePicker value='2026-03-14' onChange={handleChange} />)

    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    // Click the 20th of March 2026 (aria-label = "20 martie 2026")
    await user.click(screen.getByRole('button', { name: /20 martie 2026/i }))

    expect(handleChange).toHaveBeenCalledWith('2026-03-20')
  })

  it('closes the calendar after clicking a specific day', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-03-14' onChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /selectați data/i }))
    await user.click(screen.getByRole('button', { name: /20 martie 2026/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks the currently selected date with aria-pressed="true"', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2026-03-14' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    const selectedDayBtn = screen.getByRole('button', { name: /14 martie 2026/i })
    expect(selectedDayBtn).toHaveAttribute('aria-pressed', 'true')
  })

  // ─── Invalid ISO value ────────────────────────────────────────────────────

  it('shows the placeholder for an invalid ISO date string (no crash)', () => {
    render(<DatePicker value='not-a-date' placeholder='Selectați data...' />)
    expect(screen.getByText('Selectați data...')).toBeInTheDocument()
  })

  it('shows the placeholder for an incomplete ISO string (missing day)', () => {
    render(<DatePicker value='2026-03' placeholder='Alegeți data' />)
    expect(screen.getByText('Alegeți data')).toBeInTheDocument()
  })

  // ─── id prop ──────────────────────────────────────────────────────────────

  it('forwards the id prop to the trigger button', () => {
    render(<DatePicker id='start-date' />)
    expect(screen.getByRole('button', { name: /selectați data/i })).toHaveAttribute(
      'id',
      'start-date',
    )
  })

  // ─── Leap / non-leap February ─────────────────────────────────────────────

  it('shows 29 days for February in a leap year (2024)', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2024-02-15' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    // Day 29 must exist in leap year
    expect(screen.getByRole('button', { name: /29 februarie 2024/i })).toBeInTheDocument()
  })

  it('shows only 28 days for February in a non-leap year (2025)', async () => {
    const user = userEvent.setup()
    render(<DatePicker value='2025-02-15' />)
    await user.click(screen.getByRole('button', { name: /selectați data/i }))

    // Day 29 must NOT exist in non-leap year
    expect(screen.queryByRole('button', { name: /29 februarie 2025/i })).not.toBeInTheDocument()
    // Day 28 must exist
    expect(screen.getByRole('button', { name: /28 februarie 2025/i })).toBeInTheDocument()
  })
})
