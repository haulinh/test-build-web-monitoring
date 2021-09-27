import { getConfigApi } from 'config'
import { getFetch, putFetch, postFetch } from 'utils/fetch'

export function getLanguageUrl(prefix = '') {
  return getConfigApi().language + prefix
}

export function getListLanguageWeb() {
  return getFetch(getLanguageUrl('/web'))
}

export function getListLanguageAll(query) {
  return getFetch(getLanguageUrl(''), query)
}

export function updateLanguage(locale, value = {}, device) {
  let url = getLanguageUrl(`/${locale}`)
  return putFetch(url, {
    value: value,
    device,
  })
}

export function versionLastedLanguage() {
  return getFetch(getLanguageUrl('/version-web/lasted'))
}

export function initialLanguage(data = {}) {
  return postFetch(getLanguageUrl(`/initial-web/lasted`), data)
}

export function getListLanguages() {
  return getFetch(getLanguageUrl(`/list`))
}

export function putLanguageEnable({ locale, enable }) {
  return putFetch(getLanguageUrl(`/enable/${locale}`), {
    enable,
  })
}

export function resetLanguage(locale) {
  return getFetch(getLanguageUrl(`/reset/${locale}`))
}

/* #endregion */

export default {
  getListLanguageWeb,
  getListLanguageAll,
  updateLanguage,
  versionLastedLanguage,
  initialLanguage,
  getListLanguages,
  putLanguageEnable,
  resetLanguage,
}
