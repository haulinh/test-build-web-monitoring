const AUTH_TOKEN = 'authToken'
const SECRET_KEY = 'secretKey'

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN, token)
}

export function resetAuthToken() {
  localStorage.removeItem(AUTH_TOKEN)
}

export function getAuthToken() {
  if (
    localStorage.getItem(AUTH_TOKEN) === 'null' ||
    !localStorage.getItem(AUTH_TOKEN)
  )
    return null
  return localStorage.getItem(AUTH_TOKEN)
}

export function setSecretKey(secretKey) {
  localStorage.setItem(SECRET_KEY, secretKey)
}

export function resetSecretKey() {
  localStorage.removeItem(SECRET_KEY)
}

export function getSecretKey() {
  if (
    localStorage.getItem(SECRET_KEY) === 'null' ||
    !localStorage.getItem(SECRET_KEY)
  )
    return null
  return localStorage.getItem(SECRET_KEY)
}

export default {
  setAuthToken,
  resetAuthToken,
  getAuthToken,
  setSecretKey,
  resetSecretKey,
  getSecretKey,
}
