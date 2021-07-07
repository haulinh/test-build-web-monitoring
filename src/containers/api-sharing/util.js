import { getAuthToken } from 'utils/auth'

export function isView(rule) {
  return rule === 'view'
}

export function isEdit(rule) {
  return rule === 'edit'
}

export function isCreate(rule) {
  return rule === 'create'
}

export function generateGetUrl(url) {
  const accessToken = getAuthToken()

  return `curl '${url}' \
            -H 'authorization: ${accessToken}'`
}
