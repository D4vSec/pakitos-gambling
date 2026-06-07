export const copyTextToClipboard = async (value) => {
  const text = String(value)

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall through when clipboard permissions or the current context reject the API.
    }
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  textarea.style.pointerEvents = "none"

  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Clipboard copy was rejected")
    }
  } finally {
    textarea.remove()
  }
}
