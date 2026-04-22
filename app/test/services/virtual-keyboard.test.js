import { describe, expect, it, vi } from 'vitest'

import { hideVirtualKeyboard, showVirtualKeyboard, supportsVirtualKeyboardApi } from '../../src/services/virtual-keyboard'

describe('virtual keyboard service', () => {
  it('reports support when show and hide are available', () => {
    const originalNavigator = globalThis.navigator

    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { virtualKeyboard: { show: vi.fn(), hide: vi.fn() } }
      })

      expect(supportsVirtualKeyboardApi()).toBe(true)
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator
      })
    }
  })

  it('shows and hides virtual keyboard when API is supported', () => {
    const show = vi.fn()
    const hide = vi.fn()
    const originalNavigator = globalThis.navigator

    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { virtualKeyboard: { show, hide } }
      })

      showVirtualKeyboard()
      hideVirtualKeyboard()

      expect(show).toHaveBeenCalledOnce()
      expect(hide).toHaveBeenCalledOnce()
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator
      })
    }
  })

  it('gracefully falls back when API is unavailable', () => {
    const originalNavigator = globalThis.navigator

    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: {}
      })

      expect(supportsVirtualKeyboardApi()).toBe(false)
      expect(() => showVirtualKeyboard()).not.toThrow()
      expect(() => hideVirtualKeyboard()).not.toThrow()
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator
      })
    }
  })
})
