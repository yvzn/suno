import { describe, expect, it, vi } from 'vitest'

import { hideVirtualKeyboard, scrollSubmitButtonIntoView } from '../../src/components/location-utils'

describe('location utils', () => {
  it('scrolls submit button into view using alignToTop false', () => {
    const scrollIntoView = vi.fn()
    const submitButton = { scrollIntoView }

    scrollSubmitButtonIntoView(submitButton)

    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(scrollIntoView).toHaveBeenCalledWith(false)
  })

  it('hides virtual keyboard when API is supported', () => {
    const hide = vi.fn()
    const originalNavigator = globalThis.navigator
    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { virtualKeyboard: { hide } }
      })

      hideVirtualKeyboard()

      expect(hide).toHaveBeenCalledOnce()
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator
      })
    }
  })

  it('does not throw when virtual keyboard API is unavailable', () => {
    const originalNavigator = globalThis.navigator
    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: {}
      })

      expect(() => hideVirtualKeyboard()).not.toThrow()
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator
      })
    }
  })
})
