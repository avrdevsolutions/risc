import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAutosave } from './useAutosave'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useAutosave', () => {
  // ─── Initial state ─────────────────────────────────────────────────────────

  it('returns "idle" status on mount', () => {
    const { result } = renderHook(() =>
      useAutosave({ values: { name: 'test' }, onSave: vi.fn(), debounceMs: 100 }),
    )
    expect(result.current).toBe('idle')
  })

  // ─── No save when values have not changed ─────────────────────────────────

  it('does not call onSave when the same reference is re-rendered', async () => {
    const onSave = vi.fn()
    const values = { name: 'test' }
    const { rerender } = renderHook(() => useAutosave({ values, onSave, debounceMs: 100 }))

    rerender()
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(onSave).not.toHaveBeenCalled()
  })

  it('does not call onSave when new props object has identical deep content', async () => {
    const onSave = vi.fn()
    const { rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100 }),
      { initialProps: { values: { name: 'test' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'test' } }) // same content, new reference
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(onSave).not.toHaveBeenCalled()
  })

  // ─── Triggers save after debounce ─────────────────────────────────────────

  it('calls onSave with the changed diff after the debounce delay', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const { rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100 }),
      { initialProps: { values: { name: 'initial', city: 'Cluj' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'updated', city: 'Cluj' } })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(onSave).toHaveBeenCalledOnce()
    expect(onSave).toHaveBeenCalledWith({ name: 'updated' })
  })

  it('sends only changed fields — unchanged fields are excluded from the diff', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const { rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100 }),
      {
        initialProps: {
          values: { name: 'Alice', city: 'Cluj', age: 30 } as Record<string, unknown>,
        },
      },
    )

    rerender({ values: { name: 'Alice', city: 'Bucharest', age: 30 } })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(onSave).toHaveBeenCalledWith({ city: 'Bucharest' })
  })

  // ─── Debounce: multiple rapid changes → single save ───────────────────────

  it('debounces rapid changes into a single save with the final value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const { rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 200 }),
      { initialProps: { values: { name: 'v0' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'v1' } })
    await act(async () => {
      vi.advanceTimersByTime(50)
    })
    rerender({ values: { name: 'v2' } })
    await act(async () => {
      vi.advanceTimersByTime(50)
    })
    rerender({ values: { name: 'v3' } })
    await act(async () => {
      vi.advanceTimersByTime(200) // fires the final debounce
    })

    expect(onSave).toHaveBeenCalledOnce()
    expect(onSave).toHaveBeenCalledWith({ name: 'v3' })
  })

  // ─── Status lifecycle on success ──────────────────────────────────────────

  it('transitions idle → saving → saved → idle on a successful save', async () => {
    let resolveOnSave!: () => void
    const onSave = vi
      .fn()
      .mockImplementation(() => new Promise<void>((res) => (resolveOnSave = res)))

    const { result, rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100 }),
      { initialProps: { values: { name: 'a' } as Record<string, unknown> } },
    )

    expect(result.current).toBe('idle')

    rerender({ values: { name: 'b' } })
    expect(result.current).toBe('idle') // debounce not yet fired

    await act(async () => {
      vi.advanceTimersByTime(100) // fire debounce → saving
    })
    expect(result.current).toBe('saving')

    await act(async () => {
      resolveOnSave() // resolve the promise → saved
    })
    expect(result.current).toBe('saved')

    await act(async () => {
      vi.advanceTimersByTime(2000) // 2 s reset → idle
    })
    expect(result.current).toBe('idle')
  })

  // ─── Status lifecycle on failure ──────────────────────────────────────────

  it('transitions to "error" when onSave always fails (maxRetries=1 means no retries)', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('network error'))

    const { result, rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100, maxRetries: 1 }),
      { initialProps: { values: { name: 'a' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'b' } })
    await act(async () => {
      vi.advanceTimersByTime(100) // fire debounce → attempt 1 → fails → error (no retries)
    })

    expect(result.current).toBe('error')
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('retries on failure and calls onSave multiple times before giving up', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('transient error'))

    const { result, rerender } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100, maxRetries: 2 }),
      { initialProps: { values: { name: 'a' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'b' } })
    // Fire debounce → attempt 1 fails, schedules retry in 1000 ms (2^1 * 500).
    // With maxRetries=2: attempt 1 (< 2) → retry; attempt 2 (not < 2) → error.
    // Total: 2 calls to onSave.
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    // Advance past retry delay → attempt 2 fires and also fails → error
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe('error')
    expect(onSave).toHaveBeenCalledTimes(2)
  })

  // ─── Unmount safety ───────────────────────────────────────────────────────

  it('does not throw when the component unmounts while a save is in progress', async () => {
    let resolveOnSave!: () => void
    const onSave = vi
      .fn()
      .mockImplementation(() => new Promise<void>((res) => (resolveOnSave = res)))

    const { rerender, unmount } = renderHook(
      ({ values }) => useAutosave({ values, onSave, debounceMs: 100 }),
      { initialProps: { values: { name: 'a' } as Record<string, unknown> } },
    )

    rerender({ values: { name: 'b' } })
    await act(async () => {
      vi.advanceTimersByTime(100) // fire debounce, save starts
    })

    unmount() // unmount while saving

    // Resolving the save after unmount should not cause a "setState on unmounted component" error
    await act(async () => {
      resolveOnSave()
    })

    expect(onSave).toHaveBeenCalledOnce()
  })
})
