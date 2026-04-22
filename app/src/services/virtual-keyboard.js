function getVirtualKeyboardApi() {
  if (typeof navigator === 'undefined') {
    return undefined
  }

  return navigator.virtualKeyboard
}

export function supportsVirtualKeyboardApi() {
  const virtualKeyboard = getVirtualKeyboardApi()

  return typeof virtualKeyboard?.show === 'function' && typeof virtualKeyboard?.hide === 'function'
}

export function showVirtualKeyboard() {
  if (!supportsVirtualKeyboardApi()) {
    return
  }

  navigator.virtualKeyboard.show()
}

export function hideVirtualKeyboard() {
  if (!supportsVirtualKeyboardApi()) {
    return
  }

  navigator.virtualKeyboard.hide()
}
