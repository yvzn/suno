export function scrollSubmitButtonIntoView(submitButton) {
  if (!submitButton || typeof submitButton.scrollIntoView !== 'function') {
    return
  }

  submitButton.scrollIntoView(false)
}

export function hideVirtualKeyboard() {
  if (typeof navigator === 'undefined') {
    return
  }

  navigator.virtualKeyboard?.hide?.()
}
