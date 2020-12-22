/* eslint-disable */
export function isStateless(Component) {
  return !Component.prototype.render
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function isLimitSize(size) {
  return size / 1024 / 1024 < 10
}

export function copyTextToClipboard(text, message) {
  const input = document.createElement('textarea')

  input.style.position = 'fixed'
  input.style.top = 0
  input.style.left = 0

  input.style.width = '2em'
  input.style.height = '2em'
  input.style.padding = 0
  input.style.border = 'none'
  input.style.outline = 'none'
  input.style.boxShadow = 'none'
  input.style.background = 'transparent'

  input.value = text

  document.body.appendChild(input)
  input.focus()
  input.select()

  try {
    return document.execCommand('copy')
  } catch (err) {
    console.log('Oops, unable to copy')
    return false
  }

  document.body.removeChild(input)
}
